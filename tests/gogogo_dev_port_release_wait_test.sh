#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
dev_script="$repo_root/gogogo.1.sh"
lib_script="$repo_root/gogogo.lib.sh"

grep -q 'wait_for_port_release' "$lib_script" || {
  echo 'FAIL: gogogo.lib.sh should define wait_for_port_release helper'
  exit 1
}

grep -q 'wait_for_port_release 3000' "$dev_script" || {
  echo 'FAIL: gogogo.1.sh should wait for backend port 3000 to be released before restart'
  exit 1
}

echo 'PASS: gogogo restart waits for backend port release'
