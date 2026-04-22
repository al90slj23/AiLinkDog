#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
dev_script="$repo_root/gogogo.1.sh"
monitor_script="$repo_root/gogogo.dev.monitor.sh"
dashboard_script="$repo_root/gogogo.dev.dashboard.sh"
eventstream_script="$repo_root/gogogo.dev.eventstream.sh"

grep -q 'gogogo.dev.monitor.sh' "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should start gogogo.dev.monitor.sh as the monitor collector'
  exit 1
}

grep -q 'gogogo.dev.dashboard.sh' "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should start gogogo.dev.dashboard.sh in a fixed dashboard pane'
  exit 1
}

grep -q 'gogogo.dev.eventstream.sh' "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should start gogogo.dev.eventstream.sh in an event stream pane'
  exit 1
}

grep -q 'get_monitor_state_path' "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should prepare monitor state path before starting monitor pane'
  exit 1
}

[ -f "$monitor_script" ] || {
  echo 'FAIL: gogogo.dev.monitor.sh should exist'
  exit 1
}

[ -f "$dashboard_script" ] || {
  echo 'FAIL: gogogo.dev.dashboard.sh should exist'
  exit 1
}

[ -f "$eventstream_script" ] || {
  echo 'FAIL: gogogo.dev.eventstream.sh should exist'
  exit 1
}

grep -q 'render_dashboard' "$monitor_script" || {
  echo 'FAIL: monitor script should define render_dashboard'
  exit 1
}

grep -q 'append_event' "$monitor_script" || {
  echo 'FAIL: monitor script should define append_event'
  exit 1
}

grep -q 'extract_frontend_url' "$monitor_script" || {
  echo 'FAIL: monitor script should define extract_frontend_url'
  exit 1
}

grep -q 'FRONTEND_READY_AT' "$monitor_script" || {
  echo 'FAIL: monitor script should track frontend ready time'
  exit 1
}

grep -q 'extract_backend_url' "$monitor_script" || {
  echo 'FAIL: monitor script should define extract_backend_url'
  exit 1
}

grep -q 'BACKEND_URL_CONFIRMED' "$monitor_script" || {
  echo 'FAIL: monitor script should track whether backend url is confirmed'
  exit 1
}

grep -q 'WARNING_COUNT' "$monitor_script" || {
  echo 'FAIL: monitor script should track warning count'
  exit 1
}

grep -q 'ERROR_COUNT' "$monitor_script" || {
  echo 'FAIL: monitor script should track error count'
  exit 1
}

grep -q 'classify_line' "$monitor_script" || {
  echo 'FAIL: monitor script should define classify_line'
  exit 1
}

grep -q 'START_TS="$(date +%s)"' "$monitor_script" || {
  echo 'FAIL: monitor script should initialize START_TS from current monitor startup time'
  exit 1
}

if grep -q 'START_TIME' "$monitor_script"; then
  echo 'FAIL: monitor script should not reuse inherited START_TIME from older shells'
  exit 1
fi

grep -Eq 'listening|server\\ started|listen\\ on|ready' "$monitor_script" || {
  echo 'FAIL: monitor script should contain backend ready detection patterns'
  exit 1
}

grep -q "BACKEND_STATUS='异常'" "$monitor_script" || {
  echo 'FAIL: monitor script should support backend error status'
  exit 1
}

grep -Eq 'Process Exit with Code|\[FATAL\]|panic|failed' "$monitor_script" || {
  echo 'FAIL: monitor script should detect backend fatal or exit signals'
  exit 1
}

grep -q 'BACKEND_READY_EVENT_KEY' "$monitor_script" || {
  echo 'FAIL: monitor script should track backend ready event refresh state'
  exit 1
}

grep -q 'refresh_backend_ready_event' "$monitor_script" || {
  echo 'FAIL: monitor script should refresh backend ready event when backend url becomes confirmed'
  exit 1
}

grep -q 'confirmed_backend_url' "$monitor_script" || {
  echo 'FAIL: monitor script should preserve confirmed backend url without downgrading to derived url'
  exit 1
}

grep -q '后端已就绪，地址 ${BACKEND_URL}' "$monitor_script" || {
  echo 'FAIL: monitor script should refresh backend ready event when confirmed URL appears'
  exit 1
}

echo 'PASS: gogogo monitor pane wiring is connected'
