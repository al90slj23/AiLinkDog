#!/bin/bash

sanitize_session_suffix() {
  printf '%s' "$1" | tr '/ .' '---' | tr -cd '[:alnum:]_-'
}

get_dev_session_name() {
  local suffix

  suffix="$(sanitize_session_suffix "$SCRIPT_DIR")"
  printf 'ALD-%s' "$suffix"
}

get_dev_session_suffix() {
  sanitize_session_suffix "$SCRIPT_DIR"
}

get_dev_runtime_dir() {
  printf '%s/.tmp/gogogo/%s' "$SCRIPT_DIR" "$(get_dev_session_suffix)"
}

get_backend_log_path() {
  printf '%s/backend.log' "$(get_dev_runtime_dir)"
}

get_frontend_log_path() {
  printf '%s/frontend.log' "$(get_dev_runtime_dir)"
}

get_monitor_events_log_path() {
  printf '%s/monitor.events.log' "$(get_dev_runtime_dir)"
}

get_monitor_state_path() {
  printf '%s/monitor.state' "$(get_dev_runtime_dir)"
}

reset_dev_runtime_dir() {
  local runtime_dir

  runtime_dir="$(get_dev_runtime_dir)"
  rm -rf "$runtime_dir"
  mkdir -p "$runtime_dir"
}

cleanup_dev_runtime_dir() {
  rm -rf "$(get_dev_runtime_dir)"
}

list_dev_sessions() {
  tmux list-sessions -F '#{session_name}' 2>/dev/null | while IFS= read -r session_name; do
    case "$session_name" in
      ALD-*)
        printf '%s\n' "$session_name"
        ;;
    esac
  done
}

NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'

print_info() {
  printf '%b\n' "${BLUE}$1${NC}"
}

print_success() {
  printf '%b\n' "${GREEN}$1${NC}"
}

print_warn() {
  printf '%b\n' "${YELLOW}$1${NC}"
}

print_error() {
  printf '%b\n' "${RED}$1${NC}"
}

check_project_root() {
  if [ ! -f "$SCRIPT_DIR/main.go" ] || [ ! -d "$SCRIPT_DIR/web" ]; then
    print_error "❌ 请在项目根目录运行，要求存在 main.go 和 web/"
    exit 1
  fi
}

require_command() {
  local command_name gobin fallback_paths path_entry

  command_name="$1"

  if command -v "$command_name" >/dev/null 2>&1; then
    return 0
  fi

  gobin="${GOBIN:-}"
  fallback_paths=""

  if [ -n "$gobin" ]; then
    fallback_paths="$gobin"
  fi

  fallback_paths="$fallback_paths ${HOME:-}/go/bin"

  for path_entry in $fallback_paths; do
    [ -n "$path_entry" ] || continue
    if [ -x "$path_entry/$command_name" ]; then
      export PATH="$path_entry:$PATH"
      return 0
    fi
  done

  if ! command -v "$command_name" >/dev/null 2>&1; then
    print_error "❌ 缺少命令：$1"
    exit 1
  fi
}

normalize_choice() {
  case "$1" in
    1|dev) echo "1" ;;
    2|build) echo "2" ;;
    3|test) echo "3" ;;
    4|lint) echo "4" ;;
    5|clean) echo "5" ;;
    6|deploy) echo "6" ;;
    9|platform) echo "9" ;;
    attach) echo "attach" ;;
    stop) echo "stop" ;;
    0|exit) echo "0" ;;
    *) echo "$1" ;;
  esac
}

detect_compose_command() {
  if docker compose version >/dev/null 2>&1; then
    echo "docker compose"
    return 0
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
    return 0
  fi

  return 1
}

show_elapsed_time() {
  local end_time elapsed

  end_time=$(date +%s)
  elapsed=$((end_time - $1))
  print_success "✅ 完成，用时 ${elapsed}s"
}

get_current_branch() {
  git -C "${SCRIPT_DIR:-$(pwd)}" rev-parse --abbrev-ref HEAD 2>/dev/null || printf 'unknown'
}

edit_text_in_tempfile() {
  local initial_text editor tmp_file
  local -a editor_parts

  initial_text="$1"
  editor="${EDITOR:-vi}"
  tmp_file="$(mktemp "${TMPDIR:-/tmp}/gogogo-edit.XXXXXX")" || return 1

  printf '%s' "$initial_text" >"$tmp_file"

  read -r -a editor_parts <<<"$editor"

  if [ "${#editor_parts[@]}" -eq 0 ]; then
    editor_parts=(vi)
  fi

  "${editor_parts[@]}" "$tmp_file" || {
    rm -f "$tmp_file"
    return 1
  }

  cat "$tmp_file"
  rm -f "$tmp_file"
}

open_path_in_editor() {
  local editor target_path
  local -a editor_parts

  target_path="$1"
  editor="${EDITOR:-vi}"

  read -r -a editor_parts <<<"$editor"

  if [ "${#editor_parts[@]}" -eq 0 ]; then
    editor_parts=(vi)
  fi

  "${editor_parts[@]}" "$target_path"
}

escape_pkill_pattern() {
  local input output i ch

  input="$1"
  output=""

  for ((i = 0; i < ${#input}; i++)); do
    ch="${input:i:1}"
    case "$ch" in
      '[' | ']' | '(' | ')' | '{' | '}' | '.' | '^' | '$' | '*' | '+' | '?' | '|' | '\\')
        output+="\\$ch"
        ;;
      *)
        output+="$ch"
        ;;
    esac
  done

  printf '%s' "$output"
}

terminate_matching_processes() {
  local pattern

  pattern="$1"

  if ! pgrep -f "$pattern" >/dev/null 2>&1; then
    return 0
  fi

  pkill -f "$pattern" 2>/dev/null || true
  sleep 1

  if pgrep -f "$pattern" >/dev/null 2>&1; then
    pkill -9 -f "$pattern" 2>/dev/null || true
  fi
}

get_process_cwd() {
  local pid cwd

  pid="$1"
  cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | while IFS= read -r line; do
    if [ "${line#n}" != "$line" ]; then
      printf '%s' "${line#n}"
      break
    fi
  done)"

  printf '%s' "$cwd"
}

filter_live_pids() {
  local pid live_pids

  live_pids=""
  for pid in "$@"; do
    [ -n "$pid" ] || continue
    if kill -0 "$pid" 2>/dev/null; then
      live_pids="$live_pids $pid"
    fi
  done

  printf '%s' "${live_pids# }"
}

terminate_workspace_processes_by_cwd() {
  local cwd_pattern command_pattern pid process_cwd matched_pids live_pids

  cwd_pattern="$1"
  command_pattern="$2"
  matched_pids=""

  while IFS= read -r pid; do
    [ -n "$pid" ] || continue
    process_cwd="$(get_process_cwd "$pid")"
    if [ "$process_cwd" = "$cwd_pattern" ]; then
      matched_pids="$matched_pids $pid"
    fi
  done <<EOF
$(pgrep -f "$command_pattern" 2>/dev/null || true)
EOF

  matched_pids="${matched_pids# }"
  if [ -z "$matched_pids" ]; then
    return 0
  fi

  kill $matched_pids 2>/dev/null || true
  sleep 1
  live_pids="$(filter_live_pids $matched_pids)"
  if [ -n "$live_pids" ]; then
    kill -9 $live_pids 2>/dev/null || true
  fi
}

wait_for_port_release() {
  local port max_attempts attempt

  port="$1"
  max_attempts="${2:-20}"
  attempt=0

  while lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge "$max_attempts" ]; then
      return 1
    fi
    sleep 0.25
  done

  return 0
}

kill_dev_processes_for_workspace() {
  local script_path web_path escaped_script_path escaped_web_path
  local main_pattern web_pattern vite_pattern air_pattern air_tmp_pattern air_config_pattern go_build_cache_main_pattern

  script_path="$SCRIPT_DIR"
  web_path="$SCRIPT_DIR/web"
  escaped_script_path="$(escape_pkill_pattern "$script_path")"
  escaped_web_path="$(escape_pkill_pattern "$web_path")"
  main_pattern="(^|[ /])go( |$).*run main\.go($| )"
  web_pattern="(^|[ /])bun( |$).*run dev($| )"
  vite_pattern="(^|[ /])(bun|node)( |$).*(vite|vite\.config)"
  air_config_pattern="-c \.air\.toml"
  air_pattern="(^|[ /])air($| |$air_config_pattern)"
  air_tmp_pattern="$escaped_script_path/tmp/main"
  go_build_cache_main_pattern="Library/Caches/go-build/.*/main"

  terminate_workspace_processes_by_cwd "$script_path" "$main_pattern"
  terminate_workspace_processes_by_cwd "$script_path" "$go_build_cache_main_pattern"
  terminate_workspace_processes_by_cwd "$web_path" "$web_pattern"
  terminate_workspace_processes_by_cwd "$script_path" "$air_pattern"
  terminate_matching_processes "$air_tmp_pattern"
  terminate_workspace_processes_by_cwd "$web_path" "$vite_pattern"
}
