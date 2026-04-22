#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/gogogo.lib.sh"

MONITOR_EVENTS_LOG_PATH="$(get_monitor_events_log_path)"

NC='\033[0m'
BRIGHT_RED='\033[91m'
BRIGHT_GREEN='\033[92m'
BRIGHT_YELLOW='\033[93m'
BRIGHT_CYAN='\033[96m'
BOLD='\033[1m'
MAGENTA='\033[35m'

event_color() {
  local line lower
  line="$1"
  lower="$(printf '%s' "$line" | tr '[:upper:]' '[:lower:]')"
  case "$lower" in
    *异常*|*error*|*fatal*|*failed*|*panic*) printf '%b' "${BRIGHT_RED}${line}${NC}" ;;
    *warning*|*warn*|*deprecated*) printf '%b' "${BRIGHT_YELLOW}${line}${NC}" ;;
    *已就绪*|*ready*) printf '%b' "${BRIGHT_GREEN}${line}${NC}" ;;
    *) printf '%b' "${BRIGHT_CYAN}${line}${NC}" ;;
  esac
}

printf '%b\n' "${BOLD}${MAGENTA}持续总结流${NC}"
printf '%b\n' "${BRIGHT_CYAN}等待事件输出...${NC}"

touch "$MONITOR_EVENTS_LOG_PATH"
tail -n 20 -F "$MONITOR_EVENTS_LOG_PATH" | while IFS= read -r line; do
  [ -n "$line" ] || continue
  printf '%b\n' "$(event_color "$line")"
done
