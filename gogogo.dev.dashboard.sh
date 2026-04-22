#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/gogogo.lib.sh"

MONITOR_STATE_PATH="$(get_monitor_state_path)"
SESSION_NAME="$(get_dev_session_name)"

NC='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
MAGENTA='\033[35m'
CYAN='\033[36m'
WHITE='\033[37m'
BRIGHT_RED='\033[91m'
BRIGHT_GREEN='\033[92m'
BRIGHT_YELLOW='\033[93m'
BRIGHT_BLUE='\033[94m'
BRIGHT_MAGENTA='\033[95m'
BRIGHT_CYAN='\033[96m'

frontend_status='未启动'
frontend_url='待日志确认'
backend_status='未启动'
backend_url='待日志确认'
backend_url_confirmed='0'
warnings='0'
errors='0'
last_event='等待采集器输出状态'

repeat_char() {
  local char count i output
  char="$1"
  count="$2"
  output=""
  for ((i = 0; i < count; i++)); do
    output="$output$char"
  done
  printf '%s' "$output"
}

strip_ansi() {
  printf '%s' "$1" | perl -pe 's/\e\[[0-9;]*m//g'
}

display_width() {
  printf '%s' "$(strip_ansi "$1")" | wc -m | tr -d ' '
}

pad_right() {
  local text width text_width padding
  text="$1"
  width="$2"
  text_width="$(display_width "$text")"
  padding=$((width - text_width))
  if [ "$padding" -lt 0 ]; then
    padding=0
  fi
  printf '%s%s' "$text" "$(repeat_char ' ' "$padding")"
}

status_badge() {
  case "$1" in
    已就绪) printf '%b' "${BOLD}${BRIGHT_GREEN}[ 已就绪 ]${NC}" ;;
    启动中) printf '%b' "${BOLD}${BRIGHT_YELLOW}[ 启动中 ]${NC}" ;;
    异常) printf '%b' "${BOLD}${BRIGHT_RED}[ 异常 ]${NC}" ;;
    *) printf '%b' "${BOLD}${WHITE}[ 未启动 ]${NC}" ;;
  esac
}

render_overall_status() {
  if [ "$errors" -gt 0 ]; then
    printf '%b' "${BOLD}${BRIGHT_RED}后端或前端存在异常${NC}"
    return 0
  fi
  if [ "$warnings" -gt 0 ]; then
    printf '%b' "${BOLD}${BRIGHT_YELLOW}系统运行中，存在警告${NC}"
    return 0
  fi
  if [ "$frontend_status" = '已就绪' ] && [ "$backend_status" = '已就绪' ]; then
    printf '%b' "${BOLD}${BRIGHT_GREEN}系统运行正常${NC}"
    return 0
  fi
  printf '%b' "${BOLD}${BRIGHT_BLUE}系统正在启动${NC}"
}

render_status_banner() {
  local message width line_color fill_char alert_text inner_width right_width left_width left_text right_text
  message="$1"
  width="$2"
  if [ "$errors" -gt 0 ]; then
    line_color="$BRIGHT_RED"
    fill_char='!'
  elif [ "$warnings" -gt 0 ]; then
    line_color="$BRIGHT_YELLOW"
    fill_char='~'
  else
    line_color="$BRIGHT_GREEN"
    fill_char='='
  fi
  alert_text="错误 ${errors}   警告 ${warnings}"
  inner_width=$((width - 2))
  right_width="$(display_width "$alert_text")"
  left_width=$((inner_width - right_width - 3))
  if [ "$left_width" -lt 12 ]; then
    left_width=12
  fi
  left_text="$(pad_right "${BOLD}${message}${NC}" "$left_width")"
  right_text="${BOLD}${alert_text}${NC}"
  printf '%b\n' "${line_color}$(repeat_char "$fill_char" "$width")${NC}"
  printf '%b\n' "${line_color}!${NC}${left_text} ${right_text}${line_color}!${NC}"
  printf '%b\n' "${line_color}$(repeat_char "$fill_char" "$width")${NC}"
}

render_key_value() {
  local label value color
  label="$1"
  value="$2"
  color="${3:-$WHITE}"
  printf '%b\n' "${DIM}${label}${NC} ${color}${value}${NC}"
}

render_column_block() {
  local title status url_label url_value extra_label extra_value width
  title="$1"
  status="$2"
  url_label="$3"
  url_value="$4"
  extra_label="$5"
  extra_value="$6"
  width="$7"
  printf '%b\n' "$(pad_right "${BOLD}${BRIGHT_MAGENTA}${title}${NC} $(status_badge "$status")" "$width")"
  printf '%b\n' "$(pad_right "${DIM}${url_label}${NC} ${BRIGHT_CYAN}${url_value}${NC}" "$width")"
  printf '%b\n' "$(pad_right "${DIM}${extra_label}${NC} ${WHITE}${extra_value}${NC}" "$width")"
}

load_state() {
  local line key value

  [ -f "$MONITOR_STATE_PATH" ] || return 0

  while IFS= read -r line; do
    [ -n "$line" ] || continue
    key="${line%%=*}"
    value="${line#*=}"
    case "$key" in
      frontend_status) frontend_status="$value" ;;
      frontend_url) frontend_url="$value" ;;
      backend_status) backend_status="$value" ;;
      backend_url) backend_url="$value" ;;
      backend_url_confirmed) backend_url_confirmed="$value" ;;
      warnings) warnings="$value" ;;
      errors) errors="$value" ;;
      last_event) last_event="$value" ;;
    esac
  done <"$MONITOR_STATE_PATH"
}

while true; do
  clear
  load_state
  pane_width="$(tmux display-message -p '#{pane_width}' 2>/dev/null || printf '160')"
  if [ "$pane_width" -lt 80 ]; then
    pane_width=80
  fi
  divider='  '
  left_width=$(((pane_width - 2) / 2))
  right_width=$((pane_width - left_width - 2))

  if [ "$backend_url_confirmed" = '1' ]; then
    backend_source='日志确认'
  elif [ "$backend_url" != '待日志确认' ]; then
    backend_source='地址推断'
  else
    backend_source='等待确认'
  fi

  printf '%b\n' "${BOLD}${BLUE}$(repeat_char '=' "$pane_width")${NC}"
  printf '%b\n' "$(pad_right "${BOLD}${BRIGHT_CYAN}本地开发监控大屏${NC}" "$pane_width")"
  printf '%b\n' "$(pad_right "${DIM}会话：${NC}${WHITE}${SESSION_NAME}${NC}   ${DIM}当前时间：${NC}${WHITE}$(date '+%H:%M:%S')${NC}" "$pane_width")"
  render_status_banner "$(render_overall_status)" "$pane_width"
  printf '\n'

  render_column_block '前端状态卡' "$frontend_status" '前端地址' "$frontend_url" '地址来源' '日志确认' "$left_width"
  printf '%s' "$divider"
  render_column_block '后端状态卡' "$backend_status" '后端地址' "$backend_url" '地址来源' "$backend_source" "$right_width"
  printf '\n\n'

  printf '%b\n' "${BOLD}${MAGENTA}告警摘要${NC}"
  render_key_value '错误数量' "$errors" "$BRIGHT_RED"
  render_key_value '警告数量' "$warnings" "$BRIGHT_YELLOW"
  render_key_value '最新变化' "$last_event" "$BRIGHT_GREEN"
  sleep 1
done
