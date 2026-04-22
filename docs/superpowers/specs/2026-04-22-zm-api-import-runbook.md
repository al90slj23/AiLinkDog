# zm_api MySQL Dump 导入 PostgreSQL 执行说明

## 前置要求

1. 先对目标 PostgreSQL 数据库做完整备份，至少可回滚到导入前状态。
2. 确认目标库已经完成当前仓库 schema 初始化，且 25 张 legacy 表与 5 张 referral 表都已存在。
3. 确认仓库根目录存在 `zm_api.sql`，或准备好自定义 dump 路径。
4. 确认执行机可用 `python3` 与 `psql`。

## 环境变量

必须设置以下变量之一：

```bash
export POSTGRES_DSN='postgres://user:pass@127.0.0.1:5432/ailinkdog?sslmode=disable'
```

也可使用兼容变量名：

```bash
export PG_DSN='postgres://user:pass@127.0.0.1:5432/ailinkdog?sslmode=disable'
```

## 执行命令

先做一次 dry-run，只检查输入、TSV 提取和导入 SQL 构造：

```bash
POSTGRES_DSN='postgres://user:pass@127.0.0.1:5432/ailinkdog?sslmode=disable' \
  zsh scripts/migration/run_zm_api_mysql_to_pg_import.sh --dry-run
```

正式执行导入：

```bash
POSTGRES_DSN='postgres://user:pass@127.0.0.1:5432/ailinkdog?sslmode=disable' \
  zsh scripts/migration/run_zm_api_mysql_to_pg_import.sh
```

如果 dump 不在仓库根目录，可显式指定：

```bash
POSTGRES_DSN='postgres://user:pass@127.0.0.1:5432/ailinkdog?sslmode=disable' \
  zsh scripts/migration/run_zm_api_mysql_to_pg_import.sh \
  --dump /absolute/path/to/zm_api.sql \
  --staging-dir /absolute/path/to/tmp/zm_api_tsv
```

## referral backfill 何时可开

默认不要开启 `--with-referral-backfill`。

仅在以下条件同时成立时再开启：

1. 已确认 referral 五张表属于当前 PostgreSQL 新域，不应从旧 dump 原样导入。
2. 业务接受 `referral_accounts` 只是基于 `users.inviter_id` 与 `users.aff_*` 的保守兼容性回填。
3. 业务明确接受 `referral_links`、`referral_commissions`、`referral_withdrawals` 不能从 `zm_api.sql` 无损恢复。

开启方式：

```bash
POSTGRES_DSN='postgres://user:pass@127.0.0.1:5432/ailinkdog?sslmode=disable' \
  zsh scripts/migration/run_zm_api_mysql_to_pg_import.sh --with-referral-backfill
```

## 导入后验证命令

脚本本身会自动执行：

1. `scripts/migration/zm_api_mysql_to_pg_schema_check.sql`
2. legacy 25 表 `\copy`
3. `scripts/migration/zm_api_mysql_to_pg_sequence_reset.sql`
4. 可选 `scripts/migration/zm_api_mysql_to_pg_referral_backfill.sql`
5. `scripts/migration/zm_api_mysql_to_pg_postcheck.sql`

如果需要单独复核，可手动执行：

```bash
psql "$POSTGRES_DSN" -v ON_ERROR_STOP=1 -f scripts/migration/zm_api_mysql_to_pg_postcheck.sql
```

或检查关键表行数快照：

```bash
psql "$POSTGRES_DSN" -c "SELECT COUNT(*) FROM public.users;"
psql "$POSTGRES_DSN" -c "SELECT COUNT(*) FROM public.tokens;"
psql "$POSTGRES_DSN" -c "SELECT COUNT(*) FROM public.referral_accounts;"
```
