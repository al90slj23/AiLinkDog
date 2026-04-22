#!/usr/bin/env zsh

set -euo pipefail

SCRIPT_DIR=${0:A:h}
REPO_ROOT=${SCRIPT_DIR:h:h}
SCRIPT_NAME=${0:t}

readonly SCRIPT_DIR
readonly REPO_ROOT
readonly SCRIPT_NAME

typeset -a LEGACY_TABLES=(
  options
  setups
  users
  abilities
  models
  vendors
  channels
  tokens
  checkins
  custom_oauth_providers
  user_oauth_bindings
  two_fas
  two_fa_backup_codes
  passkey_credentials
  prefill_groups
  quota_data
  redemptions
  top_ups
  subscription_plans
  subscription_orders
  user_subscriptions
  subscription_pre_consume_records
  tasks
  midjourneys
  logs
)

dump_path="${REPO_ROOT}/zm_api.sql"
staging_dir="${REPO_ROOT}/tmp/zm_api_tsv"
run_referral_backfill=0
dry_run=0
keep_staging=0

usage() {
  cat <<EOF
用法:
  ${SCRIPT_NAME} [选项]

说明:
  将 zm_api MySQL dump 提取为 TSV，并按 25 张 legacy 表顺序导入 PostgreSQL。
  默认不执行 referral backfill，也不会导入任何 referral_* 源表。

环境变量:
  POSTGRES_DSN   PostgreSQL 连接串，必填
  PG_DSN         可作为 POSTGRES_DSN 的备用变量名

选项:
  --dump PATH                    指定 MySQL dump 文件，默认: ${dump_path}
  --staging-dir PATH             指定 TSV 输出目录，默认: ${staging_dir}
  --with-referral-backfill       在导入完成后执行 referral backfill
  --keep-staging                 导入结束后保留 TSV 和临时 SQL 文件
  --dry-run                      只检查输入和生成导入 SQL，不连接数据库
  -h, --help                     显示帮助

示例:
  POSTGRES_DSN='postgres://user:pass@127.0.0.1:5432/ailinkdog?sslmode=disable' \
    ${SCRIPT_NAME} --dry-run

  POSTGRES_DSN='postgres://user:pass@127.0.0.1:5432/ailinkdog?sslmode=disable' \
    ${SCRIPT_NAME} --with-referral-backfill
EOF
}

log() {
  print -r -- "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

fail() {
  print -u2 -r -- "ERROR: $*"
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "缺少命令: $1"
}

normalize_path() {
  local input_path="$1"
  if [[ "$input_path" = /* ]]; then
    print -r -- "$input_path"
  else
    print -r -- "${REPO_ROOT}/${input_path}"
  fi
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dump)
        [[ $# -ge 2 ]] || fail "--dump 需要路径参数"
        dump_path=$(normalize_path "$2")
        shift 2
        ;;
      --staging-dir)
        [[ $# -ge 2 ]] || fail "--staging-dir 需要路径参数"
        staging_dir=$(normalize_path "$2")
        shift 2
        ;;
      --with-referral-backfill)
        run_referral_backfill=1
        shift
        ;;
      --keep-staging)
        keep_staging=1
        shift
        ;;
      --dry-run)
        dry_run=1
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        usage
        fail "未知参数: $1"
        ;;
    esac
  done
}

validate_inputs() {
  require_command python3
  require_command psql

  [[ -f "$dump_path" ]] || fail "未找到 dump 文件: $dump_path"

  POSTGRES_DSN="${POSTGRES_DSN:-${PG_DSN:-}}"
  [[ -n "$POSTGRES_DSN" ]] || fail "必须设置 POSTGRES_DSN 或 PG_DSN"
  export POSTGRES_DSN

  mkdir -p "$staging_dir"
  [[ -d "$staging_dir" ]] || fail "无法创建 staging 目录: $staging_dir"
}

cleanup() {
  if [[ "$keep_staging" -eq 1 ]]; then
    return 0
  fi

  [[ -n "${import_sql_path:-}" && -f "$import_sql_path" ]] && rm -f "$import_sql_path"
}

extract_tsv() {
  log "提取 TSV 到 ${staging_dir}"
  python3 "${SCRIPT_DIR}/zm_api_mysql_dump_to_tsv.py" --dump "$dump_path" --out "$staging_dir"

  local table
  for table in "${LEGACY_TABLES[@]}"; do
    if [[ ! -f "${staging_dir}/${table}.tsv" ]]; then
      log "表 ${table} 在 dump 中无数据，创建空 TSV"
      : > "${staging_dir}/${table}.tsv"
    fi
  done
}

generate_import_sql() {
  import_sql_path="${staging_dir}/zm_api_mysql_to_pg_import.generated.sql"
  export DUMP_PATH="$dump_path"
  export STAGING_DIR="$staging_dir"
  export IMPORT_SQL_PATH="$import_sql_path"

  log "生成导入 SQL: ${import_sql_path}"
  python3 <<'PY'
import os
import pathlib
import re
import sys

legacy_tables = [
    "options",
    "setups",
    "users",
    "abilities",
    "models",
    "vendors",
    "channels",
    "tokens",
    "checkins",
    "custom_oauth_providers",
    "user_oauth_bindings",
    "two_fas",
    "two_fa_backup_codes",
    "passkey_credentials",
    "prefill_groups",
    "quota_data",
    "redemptions",
    "top_ups",
    "subscription_plans",
    "subscription_orders",
    "user_subscriptions",
    "subscription_pre_consume_records",
    "tasks",
    "midjourneys",
    "logs",
]

dump_path = pathlib.Path(os.environ["DUMP_PATH"])
staging_dir = pathlib.Path(os.environ["STAGING_DIR"])
import_sql_path = pathlib.Path(os.environ["IMPORT_SQL_PATH"])

sql = dump_path.read_text(encoding="utf-8", errors="ignore")

table_re = re.compile(
    r"CREATE TABLE `(?P<table>[^`]+)`\s*\((?P<body>.*?)\) ENGINE\s*=",
    re.S,
)

columns_by_table = {}
for match in table_re.finditer(sql):
    table = match.group("table")
    if table not in legacy_tables:
        continue
    columns = []
    for raw_line in match.group("body").splitlines():
        line = raw_line.strip()
        if not line.startswith("`"):
            continue
        name = line.split("`", 2)[1]
        columns.append(name)
    columns_by_table[table] = columns

missing = [table for table in legacy_tables if table not in columns_by_table]
if missing:
    print(f"missing create table definitions: {', '.join(missing)}", file=sys.stderr)
    sys.exit(1)

lines = [
    "\\set ON_ERROR_STOP on",
    "BEGIN;",
    "SET LOCAL client_min_messages = warning;",
    "SET LOCAL lock_timeout = '10s';",
    "SET LOCAL statement_timeout = '0';",
    "",
]

for table in legacy_tables:
    columns = columns_by_table[table]
    column_sql = ",\n    ".join(
        f'"{name}"' if name == "group" else name for name in columns
    )
    source = (staging_dir / f"{table}.tsv").as_posix().replace("'", "''")
    lines.extend(
        [
            f"TRUNCATE TABLE public.{table} RESTART IDENTITY CASCADE;",
            f"\\copy public.{table} ({', '.join(f'\"{name}\"' if name == 'group' else name for name in columns)}) FROM '{source}' WITH (FORMAT text, DELIMITER E'\\t', NULL '\\N');",
            "",
        ]
    )

lines.append("COMMIT;")
lines.append("")

import_sql_path.write_text("\n".join(lines), encoding="utf-8")
PY

  [[ -f "$import_sql_path" ]] || fail "导入 SQL 生成失败: $import_sql_path"
}

run_psql_file() {
  local label="$1"
  local sql_file="$2"
  log "执行 ${label}: ${sql_file}"
  psql "$POSTGRES_DSN" -v ON_ERROR_STOP=1 -f "$sql_file"
}

run_dry_run() {
  log "dry-run 模式，不连接数据库"
  log "已检查 dump、DSN、TSV 文件和导入 SQL 生成逻辑"
  log "schema check: ${SCRIPT_DIR}/zm_api_mysql_to_pg_schema_check.sql"
  log "import sql: ${import_sql_path}"
  log "sequence reset: ${SCRIPT_DIR}/zm_api_mysql_to_pg_sequence_reset.sql"
  log "postcheck: ${SCRIPT_DIR}/zm_api_mysql_to_pg_postcheck.sql"
  if [[ "$run_referral_backfill" -eq 1 ]]; then
    log "referral backfill: ${SCRIPT_DIR}/zm_api_mysql_to_pg_referral_backfill.sql"
  else
    log "referral backfill: skip"
  fi
}

main() {
  parse_args "$@"

  if [[ $# -eq 0 && ${#argv[@]} -eq 0 ]]; then
    :
  fi

  trap cleanup EXIT

  validate_inputs

  log "dump 文件: ${dump_path}"
  log "staging 目录: ${staging_dir}"
  log "referral backfill: $([[ "$run_referral_backfill" -eq 1 ]] && print yes || print no)"
  log "dry-run: $([[ "$dry_run" -eq 1 ]] && print yes || print no)"

  extract_tsv
  generate_import_sql

  if [[ "$dry_run" -eq 1 ]]; then
    run_dry_run
    return 0
  fi

  run_psql_file "schema check" "${SCRIPT_DIR}/zm_api_mysql_to_pg_schema_check.sql"
  run_psql_file "legacy data load" "$import_sql_path"
  run_psql_file "sequence reset" "${SCRIPT_DIR}/zm_api_mysql_to_pg_sequence_reset.sql"

  if [[ "$run_referral_backfill" -eq 1 ]]; then
    run_psql_file "referral backfill" "${SCRIPT_DIR}/zm_api_mysql_to_pg_referral_backfill.sql"
  else
    log "跳过 referral backfill"
  fi

  run_psql_file "postcheck" "${SCRIPT_DIR}/zm_api_mysql_to_pg_postcheck.sql"
  log "迁移脚本执行完成"
}

main "$@"
