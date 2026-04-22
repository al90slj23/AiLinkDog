#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
lib_script="$repo_root/gogogo.lib.sh"
memory_script="$repo_root/gogogo.memory.sh"

tmp_output="$(mktemp "${TMPDIR:-/tmp}/gogogo-memory-prompt.XXXXXX")"
trap 'rm -f "$tmp_output"' EXIT

env -i PATH="/usr/bin:/bin:/usr/sbin:/sbin" SCRIPT_DIR="$repo_root" bash -c '
  source "$1"
  source "$2"
  build_memory_file_selection_prompt "git-context" "nav-context" "candidate-files" "pre-summary"
' _ "$lib_script" "$memory_script" >"$tmp_output" 2>&1 || true

if grep -Fq 'command not found' "$tmp_output"; then
  echo 'FAIL: build_memory_file_selection_prompt should not execute backtick content'
  cat "$tmp_output"
  exit 1
fi

if ! grep -Fq '`L4#Changelog`' "$tmp_output"; then
  echo 'FAIL: prompt should preserve the literal `L4#Changelog` text'
  exit 1
fi

if ! grep -Fq '`L5`' "$tmp_output"; then
  echo 'FAIL: prompt should preserve the literal `L5` text'
  exit 1
fi

echo 'PASS: build_memory_file_selection_prompt keeps literal backtick text'
