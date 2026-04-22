#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/gogogo.lib.sh"

SESSION_NAME="$(get_dev_session_name)"
BACKEND_LOG_PATH="$(get_backend_log_path)"
FRONTEND_LOG_PATH="$(get_frontend_log_path)"
MONITOR_EVENTS_LOG_PATH="$(get_monitor_events_log_path)"
MONITOR_STATE_PATH="$(get_monitor_state_path)"

START_TS="$(date +%s)"

FRONTEND_STATUS='未启动'
FRONTEND_URL='待日志确认'
FRONTEND_READY_AT=''
BACKEND_STATUS='未启动'
BACKEND_URL='待日志确认'
BACKEND_URL_CONFIRMED='0'
confirmed_backend_url=''
BACKEND_READY_AT=''
BACKEND_MARKED_READY='0'
BACKEND_READY_EVENT_KEY=''
WARNING_COUNT='0'
ERROR_COUNT='0'
LAST_EVENT='监控脚本已启动，等待前后端日志输出'
LAST_FRONTEND_LINE=''
LAST_BACKEND_LINE=''
LAST_CLASSIFIED_SIGNATURE=''

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
    已就绪)
      printf '%b' "${BOLD}${BRIGHT_GREEN}[ 已就绪 ]${NC}"
      ;;
    启动中)
      printf '%b' "${BOLD}${BRIGHT_YELLOW}[ 启动中 ]${NC}"
      ;;
    异常)
      printf '%b' "${BOLD}${BRIGHT_RED}[ 异常 ]${NC}"
      ;;
    *)
      printf '%b' "${BOLD}${WHITE}[ 未启动 ]${NC}"
      ;;
  esac
}

event_color() {
  local line lower

  line="$1"
  lower="$(printf '%s' "$line" | tr '[:upper:]' '[:lower:]')"

  case "$lower" in
    *异常*|*error*|*fatal*|*failed*|*panic*)
      printf '%b' "${BRIGHT_RED}${line}${NC}"
      ;;
    *warning*|*warn*|*deprecated*)
      printf '%b' "${BRIGHT_YELLOW}${line}${NC}"
      ;;
    *已就绪*|*ready*)
      printf '%b' "${BRIGHT_GREEN}${line}${NC}"
      ;;
    *)
      printf '%b' "${BRIGHT_CYAN}${line}${NC}"
      ;;
  esac
}

render_key_value() {
  local label value color

  label="$1"
  value="$2"
  color="${3:-$WHITE}"
  printf '%b\n' "${DIM}${label}${NC} ${color}${value}${NC}"
}

refresh_backend_ready_event() {
  local elapsed ready_event_key

  [ -n "$BACKEND_READY_AT" ] || return 0

  elapsed=$((BACKEND_READY_AT - START_TS))
  BACKEND_STATUS='已就绪'

  if [ "$BACKEND_URL_CONFIRMED" = '1' ]; then
    LAST_EVENT="后端已就绪，地址 ${BACKEND_URL}，耗时 ${elapsed}s"
    ready_event_key="confirmed:${BACKEND_URL}"
  elif [ "$BACKEND_URL" != '待日志确认' ]; then
    LAST_EVENT="后端已就绪，推断地址 ${BACKEND_URL}，耗时 ${elapsed}s"
    ready_event_key="derived:${BACKEND_URL}"
  else
    LAST_EVENT="后端已就绪，地址待日志确认，耗时 ${elapsed}s"
    ready_event_key='pending'
  fi

  if [ "$ready_event_key" != "$BACKEND_READY_EVENT_KEY" ]; then
    BACKEND_READY_EVENT_KEY="$ready_event_key"
    append_event "$LAST_EVENT"
  fi
}

render_overall_status() {
  if [ "$ERROR_COUNT" -gt 0 ]; then
    printf '%b' "${BOLD}${BRIGHT_RED}后端或前端存在异常${NC}"
    return 0
  fi

  if [ "$WARNING_COUNT" -gt 0 ]; then
    printf '%b' "${BOLD}${BRIGHT_YELLOW}系统运行中，存在警告${NC}"
    return 0
  fi

  if [ "$FRONTEND_STATUS" = '已就绪' ] && [ "$BACKEND_STATUS" = '已就绪' ]; then
    printf '%b' "${BOLD}${BRIGHT_GREEN}系统运行正常${NC}"
    return 0
  fi

  printf '%b' "${BOLD}${BRIGHT_BLUE}系统正在启动${NC}"
}

render_status_banner() {
  local message width line_color fill_char alert_text inner_width right_width left_width left_text right_text

  message="$1"
  width="$2"

  if [ "$ERROR_COUNT" -gt 0 ]; then
    line_color="$BRIGHT_RED"
    fill_char='!'
  elif [ "$WARNING_COUNT" -gt 0 ]; then
    line_color="$BRIGHT_YELLOW"
    fill_char='~'
  else
    line_color="$BRIGHT_GREEN"
    fill_char='='
  fi

  alert_text="错误 ${ERROR_COUNT}   警告 ${WARNING_COUNT}"
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

render_column_block() {
  local title status url_label url_value extra_label extra_value duration_value width

  title="$1"
  status="$2"
  url_label="$3"
  url_value="$4"
  extra_label="$5"
  extra_value="$6"
  duration_value="$7"
  width="$8"

  printf '%b\n' "$(pad_right "${BOLD}${BRIGHT_MAGENTA}${title}${NC} $(status_badge "$status")" "$width")"
  printf '%b\n' "$(pad_right "${DIM}${url_label}${NC} ${BRIGHT_CYAN}${url_value}${NC}" "$width")"
  printf '%b\n' "$(pad_right "${DIM}${extra_label}${NC} ${WHITE}${extra_value}${NC}" "$width")"
  printf '%b\n' "$(pad_right "${DIM}启动耗时${NC} ${BRIGHT_YELLOW}${duration_value}${NC}" "$width")"
}

format_elapsed() {
  if [ -n "$1" ]; then
    printf '%ss' "$(( $1 - START_TS ))"
  else
    printf '计算中'
  fi
}

append_event() {
  local message

  message="$1"
  printf '[%s] %s\n' "$(date '+%H:%M:%S')" "$message" >>"$MONITOR_EVENTS_LOG_PATH"
}

extract_frontend_url() {
  local line

  line="$1"
  if [[ "$line" =~ https?://(localhost|127\.0\.0\.1):[0-9]+/? ]]; then
    printf '%s' "${BASH_REMATCH[0]}"
    return 0
  fi
  return 1
}

extract_backend_url() {
  local line

  line="$1"

  if [[ "$line" =~ https?://(localhost|127\.0\.0\.1):[0-9]+/? ]]; then
    printf '%s|1' "${BASH_REMATCH[0]}"
    return 0
  fi

  if [[ "$line" =~ :([0-9]{4,5}) ]]; then
    printf 'http://localhost:%s|0' "${BASH_REMATCH[1]}"
    return 0
  fi

  return 1
}

classify_line() {
  local line lower

  line="$1"
  lower="$(printf '%s' "$line" | tr '[:upper:]' '[:lower:]')"

  case "$lower" in
    *panic*|*fatal*|*failed*|*error*)
      printf 'error'
      return 0
      ;;
    *warn*|*warning*|*deprecated*)
      printf 'warning'
      return 0
      ;;
  esac

  return 1
}

update_alert_state() {
  local source line kind signature

  source="$1"
  line="$2"
  [ -n "$line" ] || return 0

  kind="$(classify_line "$line" || true)"
  [ -n "$kind" ] || return 0

  signature="$source|$kind|$line"
  if [ "$signature" = "$LAST_CLASSIFIED_SIGNATURE" ]; then
    return 0
  fi
  LAST_CLASSIFIED_SIGNATURE="$signature"

  if [ "$kind" = 'warning' ]; then
    WARNING_COUNT=$((WARNING_COUNT + 1))
    LAST_EVENT="检测到 warning：$line"
  else
    ERROR_COUNT=$((ERROR_COUNT + 1))
    LAST_EVENT="检测到 error：$line"
  fi

  append_event "$LAST_EVENT"
}

update_frontend_state() {
  local line url now elapsed

  line="$1"
  [ -n "$line" ] || return 0

  if [ "$FRONTEND_STATUS" = '未启动' ]; then
    FRONTEND_STATUS='启动中'
  fi

  url="$(extract_frontend_url "$line" || true)"
  if [ -n "$url" ] && [ "$url" != "$FRONTEND_URL" ]; then
    FRONTEND_URL="$url"
    now="$(date +%s)"
    FRONTEND_READY_AT="$now"
    elapsed=$((now - START_TS))
    FRONTEND_STATUS='已就绪'
    LAST_EVENT="前端已就绪，地址 ${FRONTEND_URL}，耗时 ${elapsed}s"
    append_event "$LAST_EVENT"
  fi
}

update_backend_state() {
  local line result url confirmed now lowered old_url old_confirmed

  line="$1"
  [ -n "$line" ] || return 0

  if [ "$BACKEND_STATUS" = '未启动' ]; then
    BACKEND_STATUS='启动中'
  fi

  old_url="$BACKEND_URL"
  old_confirmed="$BACKEND_URL_CONFIRMED"
  result="$(extract_backend_url "$line" || true)"
  if [ -n "$result" ]; then
    url="${result%%|*}"
    confirmed="${result##*|}"
    if [ "$confirmed" = '1' ]; then
      confirmed_backend_url="$url"
      BACKEND_URL="$url"
      BACKEND_URL_CONFIRMED='1'
    elif [ -z "$confirmed_backend_url" ]; then
      BACKEND_URL="$url"
      BACKEND_URL_CONFIRMED="$confirmed"
    fi

    if [ "$BACKEND_MARKED_READY" = '1' ] && { [ "$BACKEND_URL" != "$old_url" ] || [ "$BACKEND_URL_CONFIRMED" != "$old_confirmed" ]; }; then
      refresh_backend_ready_event
    fi
  fi

  lowered="$(printf '%s' "$line" | tr '[:upper:]' '[:lower:]')"

  case "$lowered" in
    *'[fatal]'*|*process\ exit\ with\ code*|*panic*|*failed*)
      BACKEND_STATUS='异常'
      LAST_EVENT="后端异常：$line"
      append_event "$LAST_EVENT"
      return 0
      ;;
  esac

  case "$lowered" in
    *listening*|*server\ started*|*listen\ on*|*ready*)
      if [ "$BACKEND_MARKED_READY" = '0' ]; then
        now="$(date +%s)"
        BACKEND_READY_AT="$now"
        BACKEND_MARKED_READY='1'
      fi
      refresh_backend_ready_event
      ;;
  esac
}

scan_recent_frontend_log() {
  local lines line

  lines="$(tail -n 40 "$FRONTEND_LOG_PATH" 2>/dev/null || true)"
  [ -n "$lines" ] || return 0

  while IFS= read -r line; do
    [ -n "$line" ] || continue
    update_frontend_state "$line"
    update_alert_state 'frontend' "$line"
  done <<EOF
$lines
EOF
}

scan_recent_backend_log() {
  local lines line

  lines="$(tail -n 40 "$BACKEND_LOG_PATH" 2>/dev/null || true)"
  [ -n "$lines" ] || return 0

  while IFS= read -r line; do
    [ -n "$line" ] || continue
    update_backend_state "$line"
    update_alert_state 'backend' "$line"
  done <<EOF
$lines
EOF
}

write_state_snapshot() {
  {
    printf 'frontend_status=%s\n' "$FRONTEND_STATUS"
    printf 'frontend_url=%s\n' "$FRONTEND_URL"
    printf 'backend_status=%s\n' "$BACKEND_STATUS"
    printf 'backend_url=%s\n' "$BACKEND_URL"
    printf 'backend_url_confirmed=%s\n' "$BACKEND_URL_CONFIRMED"
    printf 'warnings=%s\n' "$WARNING_COUNT"
    printf 'errors=%s\n' "$ERROR_COUNT"
    printf 'last_event=%s\n' "$LAST_EVENT"
  } >"$MONITOR_STATE_PATH"
}

render_dashboard() {
  local pane_width left_width right_width divider
  local frontend_elapsed backend_elapsed backend_source last_error last_warning
  local event_lines rendered_line

  clear

  pane_width="$(tmux display-message -p '#{pane_width}' 2>/dev/null || printf '160')"
  if [ "$pane_width" -lt 80 ]; then
    pane_width=80
  fi
  divider='  '
  left_width=$(((pane_width - 2) / 2))
  right_width=$((pane_width - left_width - 2))

  frontend_elapsed="$(format_elapsed "$FRONTEND_READY_AT")"
  backend_elapsed="$(format_elapsed "$BACKEND_READY_AT")"

  if [ "$BACKEND_URL_CONFIRMED" = '1' ]; then
    backend_source='日志确认'
  elif [ "$BACKEND_URL" != '待日志确认' ]; then
    backend_source='地址推断'
  else
    backend_source='等待确认'
  fi

  last_error='暂无'
  last_warning='暂无'
  if [ -f "$MONITOR_EVENTS_LOG_PATH" ]; then
    last_error="$(perl -ne 'if(/异常|error|fatal|failed|panic/i){$last=$_} END{print $last if defined $last}' "$MONITOR_EVENTS_LOG_PATH")"
    last_warning="$(perl -ne 'if(/warning|warn|deprecated/i){$last=$_} END{print $last if defined $last}' "$MONITOR_EVENTS_LOG_PATH")"
    [ -n "$last_error" ] || last_error='暂无'
    [ -n "$last_warning" ] || last_warning='暂无'
  fi

  printf '%b\n' "${BOLD}${BLUE}$(repeat_char '=' "$pane_width")${NC}"
  printf '%b\n' "$(pad_right "${BOLD}${BRIGHT_CYAN}本地开发监控大屏${NC}" "$pane_width")"
  printf '%b\n' "$(pad_right "${DIM}会话：${NC}${WHITE}${SESSION_NAME}${NC}   ${DIM}当前时间：${NC}${WHITE}$(date '+%H:%M:%S')${NC}" "$pane_width")"
  render_status_banner "$(render_overall_status)" "$pane_width"
  printf '\n'

  render_column_block '前端状态卡' "$FRONTEND_STATUS" '前端地址' "$FRONTEND_URL" '地址来源' '日志确认' "$frontend_elapsed" "$left_width"
  printf '%s' "$divider"
  render_column_block '后端状态卡' "$BACKEND_STATUS" '后端地址' "$BACKEND_URL" '地址来源' "$backend_source" "$backend_elapsed" "$right_width"

  printf '\n\n'
  printf '%b\n' "${BOLD}${MAGENTA}告警摘要${NC}"
  render_key_value '错误数量' "$ERROR_COUNT" "$BRIGHT_RED"
  render_key_value '警告数量' "$WARNING_COUNT" "$BRIGHT_YELLOW"
  render_key_value '最新变化' "$LAST_EVENT" "$BRIGHT_GREEN"
  render_key_value '最近错误' "$last_error" "$BRIGHT_RED"
  render_key_value '最近警告' "$last_warning" "$BRIGHT_YELLOW"

  printf '\n%b\n' "${BOLD}${MAGENTA}最近事件流${NC}"
  if [ -f "$MONITOR_EVENTS_LOG_PATH" ]; then
    event_lines="$(tail -n 8 "$MONITOR_EVENTS_LOG_PATH")"
    while IFS= read -r rendered_line; do
      [ -n "$rendered_line" ] || continue
      printf '%b\n' "$(event_color "$rendered_line")"
    done <<EOF
$event_lines
EOF
  else
    printf '%b\n' "${DIM}等待日志输出...${NC}"
  fi

  printf '\n%b\n' "${DIM}日志文件：后端 ${BACKEND_LOG_PATH}${NC}"
  printf '%b\n' "${DIM}日志文件：前端 ${FRONTEND_LOG_PATH}${NC}"
}

append_event "$LAST_EVENT"

while true; do
  frontend_line="$(tail -n 1 "$FRONTEND_LOG_PATH" 2>/dev/null || true)"
  backend_line="$(tail -n 1 "$BACKEND_LOG_PATH" 2>/dev/null || true)"

  if [ "$frontend_line" != "$LAST_FRONTEND_LINE" ]; then
    LAST_FRONTEND_LINE="$frontend_line"
    scan_recent_frontend_log
  fi

  if [ "$backend_line" != "$LAST_BACKEND_LINE" ]; then
    LAST_BACKEND_LINE="$backend_line"
    scan_recent_backend_log
  fi

  write_state_snapshot
  render_dashboard
  sleep 1
done
