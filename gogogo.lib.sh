#!/bin/bash

sanitize_session_suffix() {
  printf '%s' "$1" | tr '/ .' '---' | tr -cd '[:alnum:]_-'
}

get_dev_session_name() {
  local suffix

  suffix="$(sanitize_session_suffix "$SCRIPT_DIR")"
  printf 'new-api-dev-%s' "$suffix"
}

list_dev_sessions() {
  tmux list-sessions -F '#{session_name}' 2>/dev/null | while IFS= read -r session_name; do
    case "$session_name" in
      new-api-dev-*)
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
  if ! command -v "$1" >/dev/null 2>&1; then
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
