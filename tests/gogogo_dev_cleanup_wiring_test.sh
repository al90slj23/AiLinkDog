#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
main_script="$repo_root/gogogo.sh"
dev_script="$repo_root/gogogo.1.sh"
lib_script="$repo_root/gogogo.lib.sh"

grep -q 'kill_dev_processes_for_workspace' "$main_script" || {
  echo 'FAIL: gogogo.sh stop path should clean workspace processes'
  exit 1
}

grep -q 'cleanup_dev_runtime_dir' "$main_script" || {
  echo 'FAIL: gogogo.sh stop path should cleanup runtime directory'
  exit 1
}

grep -q 'kill_dev_processes_for_workspace' "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should clean workspace processes before restart'
  exit 1
}

grep -q 'cleanup_dev_runtime_dir' "$lib_script" || {
  echo 'FAIL: gogogo.lib.sh should define cleanup_dev_runtime_dir'
  exit 1
}

echo 'PASS: gogogo cleanup wiring is connected'
