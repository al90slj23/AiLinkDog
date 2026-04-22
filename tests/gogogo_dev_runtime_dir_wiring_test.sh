#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
lib_script="$repo_root/gogogo.lib.sh"
dev_script="$repo_root/gogogo.1.sh"

grep -q 'get_dev_runtime_dir()' "$lib_script" || {
  echo 'FAIL: gogogo.lib.sh should define get_dev_runtime_dir helper'
  exit 1
}

grep -q 'get_backend_log_path()' "$lib_script" || {
  echo 'FAIL: gogogo.lib.sh should define get_backend_log_path helper'
  exit 1
}

grep -q 'get_frontend_log_path()' "$lib_script" || {
  echo 'FAIL: gogogo.lib.sh should define get_frontend_log_path helper'
  exit 1
}

grep -q 'reset_dev_runtime_dir' "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should reset runtime directory before starting dev panes'
  exit 1
}

echo 'PASS: gogogo runtime dir helpers are wired'
