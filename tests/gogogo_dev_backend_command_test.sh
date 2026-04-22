#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
dev_script="$repo_root/gogogo.1.sh"

grep -q "require_command air" "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should require air before starting dev mode'
  exit 1
}

grep -q "split-window -h -t \"\$SESSION_NAME\":0" "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should split top panes horizontally'
  exit 1
}

grep -q "split-window -v -t \"\$SESSION_NAME\":0" "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should create a third monitor pane'
  exit 1
}

grep -q "tmux send-keys -t \"\$SESSION_NAME\":0.0" "$dev_script" || {
  echo 'FAIL: backend pane should still receive a startup command'
  exit 1
}

grep -q "air -c .air.toml 2>&1 | tee" "$dev_script" || {
  echo 'FAIL: backend pane should log air output to backend log file'
  exit 1
}

grep -q "bun install && bun run dev" "$dev_script" || {
  echo 'FAIL: frontend pane should continue to run bun install && bun run dev'
  exit 1
}

echo 'PASS: gogogo.1.sh keeps backend/frontend commands and adds third pane'
