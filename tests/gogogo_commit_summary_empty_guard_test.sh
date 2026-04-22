#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
git_script="$repo_root/gogogo.git.sh"

output="$(env -i PATH="/usr/bin:/bin:/usr/sbin:/sbin" bash -c '
  source "$1"
  print_error() { printf "%s\n" "$1" >&2; }
  extract_commit_title() { :; }
  extract_commit_body() { :; }
  get_commit_status_block() { printf "M file.txt\n"; }
  get_commit_diff_block() { printf "[git diff]\nchange\n"; }
  get_recent_commit_block() { printf "abc test\n"; }
  collect_commit_context() { printf "ctx\n"; }
  generate_commit_summary_text() { return 0; }
  confirm_or_edit_commit_summary() {
    printf "SHOULD_NOT_RUN\n" >&2
    return 99
  }
  get_confirmed_commit_summary opencode
' _ "$git_script" 2>&1 || true)"

if printf '%s' "$output" | grep -Fq 'SHOULD_NOT_RUN'; then
  echo 'FAIL: empty initial summary should not enter confirm_or_edit_commit_summary'
  exit 1
fi

echo 'PASS: empty initial summary is rejected before confirmation'
