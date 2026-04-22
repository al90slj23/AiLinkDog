#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
memory_script="$repo_root/gogogo.memory.sh"

tail_section="$(awk 'NR >= 436 && NR <= 444 { print }' "$memory_script")"

if ! printf '%s' "$tail_section" | grep -Fq 'print_info "ℹ️ 已记录总结与纯化计划，当前流程结束"'; then
  echo 'FAIL: memory save flow should print the direct-exit message after saving'
  exit 1
fi

if ! printf '%s' "$tail_section" | grep -Fq 'return 0'; then
  echo 'FAIL: memory save flow should return immediately after saving'
  exit 1
fi

if printf '%s' "$tail_section" | grep -Fq 'run_purification_followup'; then
  echo 'FAIL: memory save flow should not call run_purification_followup after saving'
  exit 1
fi

echo 'PASS: memory save flow exits immediately after saving'
