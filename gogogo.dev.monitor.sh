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
BACKEND_READY_AT=''
BACKEND_MARKED_READY='0'
BACKEND_READY_EVENT_KEY=''
WARNING_COUNT='0'
ERROR_COUNT='0'
LAST_EVENT='监控脚本已启动，等待前后端日志输出'
LAST_FRONTEND_LINE=''
LAST_BACKEND_LINE=''
LAST_CLASSIFIED_SIGNATURE=''

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
  local line result url confirmed now elapsed lowered ready_event_key

  line="$1"
  [ -n "$line" ] || return 0

  if [ "$BACKEND_STATUS" = '未启动' ]; then
    BACKEND_STATUS='启动中'
  fi

  result="$(extract_backend_url "$line" || true)"
  if [ -n "$result" ]; then
    url="${result%%|*}"
    confirmed="${result##*|}"
    if [ "$url" != "$BACKEND_URL" ] || [ "$confirmed" != "$BACKEND_URL_CONFIRMED" ]; then
      BACKEND_URL="$url"
      BACKEND_URL_CONFIRMED="$confirmed"
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
  clear
  printf 'gogogo dev monitor\n'
  printf 'session: %s\n' "$SESSION_NAME"
  printf 'backend status: %s\n' "$BACKEND_STATUS"
  printf 'backend url: %s\n' "$BACKEND_URL"
  printf 'backend url confirmed: %s\n' "$BACKEND_URL_CONFIRMED"
  printf 'frontend status: %s\n' "$FRONTEND_STATUS"
  printf 'frontend url: %s\n' "$FRONTEND_URL"
  printf 'warnings: %s\n' "$WARNING_COUNT"
  printf 'errors: %s\n' "$ERROR_COUNT"
  printf 'last event: %s\n' "$LAST_EVENT"
  printf 'backend log: %s\n' "$BACKEND_LOG_PATH"
  printf 'frontend log: %s\n' "$FRONTEND_LOG_PATH"
  printf '\nRecent events:\n'
  if [ -f "$MONITOR_EVENTS_LOG_PATH" ]; then
    tail -n 10 "$MONITOR_EVENTS_LOG_PATH"
  else
    printf 'Waiting for log output...\n'
  fi
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
