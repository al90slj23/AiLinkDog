#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
git_script="$repo_root/gogogo.git.sh"

require_contains() {
  case "$1" in
    *"$2"*) ;;
    *)
      echo "FAIL: $3"
      exit 1
      ;;
  esac
}

tmp_repo="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-commit-summary.XXXXXX")"
trap 'rm -rf "$tmp_repo"' EXIT

git -C "$tmp_repo" init >/dev/null 2>&1
git -C "$tmp_repo" config user.name test
git -C "$tmp_repo" config user.email test@example.com
printf 'base\n' > "$tmp_repo/huge.txt"
git -C "$tmp_repo" add huge.txt
git -C "$tmp_repo" commit -m init >/dev/null 2>&1

awk 'BEGIN { for (i = 0; i < 20000; i++) printf "cached-marker-%05d\\n", i }' > "$tmp_repo/huge.txt"
git -C "$tmp_repo" add huge.txt
awk 'BEGIN { for (i = 0; i < 20000; i++) printf "working-marker-%05d\\n", i }' > "$tmp_repo/huge.txt"

context="$(SCRIPT_DIR="$tmp_repo" bash -c 'source "$1"; get_commit_diff_block' _ "$git_script")"

require_contains "$context" '[git diff --cached]' 'context should include cached diff header'
require_contains "$context" '[git diff]' 'context should include working diff header'
require_contains "$context" '当前 git diff --cached 已截断' 'oversized cached diff should be marked as truncated'
require_contains "$context" '当前 git diff 已截断' 'oversized working diff should be marked as truncated'

echo 'PASS: commit summary diff context truncates oversized blocks'
