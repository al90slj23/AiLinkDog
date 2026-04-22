#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
lib_script="$repo_root/gogogo.lib.sh"
memory_script="$repo_root/gogogo.memory.sh"

require_contains() {
  local haystack needle message

  haystack="$1"
  needle="$2"
  message="$3"

  case "$haystack" in
    *"$needle"*) ;;
    *)
      echo "FAIL: $message"
      exit 1
      ;;
  esac
}

require_not_contains() {
  local haystack needle message

  haystack="$1"
  needle="$2"
  message="$3"

  case "$haystack" in
    *"$needle"*)
      echo "FAIL: $message"
      exit 1
      ;;
  esac
}

extract_context_block() {
  local full_context header after_header next_header block_content

  full_context="$1"
  header="$2"
  after_header="${full_context#*"${header}"}"

  if [ "$after_header" = "$full_context" ]; then
    echo "FAIL: test fixture could not locate the ${header} block in collected git context"
    exit 1
  fi

  next_header="$(printf '%s' "$after_header" | awk 'match($0, /\n\[[^]]+\]/) { print substr($0, RSTART + 1); exit }')"

  if [ -z "$next_header" ]; then
    printf '%s' "$after_header"
    return 0
  fi

  block_content="${after_header%%$'\n'"$next_header"*}"
  printf '%s' "$block_content"
}

assert_large_diff_is_truncated() {
  local tmp_repo raw_cached_diff raw_cached_diff_bytes raw_working_diff raw_working_diff_bytes
  local git_context git_context_bytes git_cached_diff_block git_diff_block
  local git_cached_diff_block_bytes git_diff_block_bytes

  tmp_repo="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-memory-git-context-large.XXXXXX")"

  git -C "$tmp_repo" init >/dev/null 2>&1
  git -C "$tmp_repo" config user.name 'Test User'
  git -C "$tmp_repo" config user.email 'test@example.com'

  printf 'line-0000\n' > "$tmp_repo/huge.txt"
  git -C "$tmp_repo" add huge.txt
  git -C "$tmp_repo" commit -m 'init' >/dev/null 2>&1

  awk 'BEGIN { for (i = 0; i < 20000; i++) printf "cached-context-marker-%05d\\n", i }' > "$tmp_repo/huge.txt"
  git -C "$tmp_repo" add huge.txt
  awk 'BEGIN { for (i = 0; i < 20000; i++) printf "working-context-marker-%05d\\n", i }' > "$tmp_repo/huge.txt"

  raw_cached_diff="$(git -C "$tmp_repo" diff --cached 2>/dev/null)"
  raw_cached_diff_bytes="$(printf '%s' "$raw_cached_diff" | wc -c | tr -d ' ')"
  raw_working_diff="$(git -C "$tmp_repo" diff 2>/dev/null)"
  raw_working_diff_bytes="$(printf '%s' "$raw_working_diff" | wc -c | tr -d ' ')"

  if [ "$raw_cached_diff_bytes" -lt 200000 ]; then
    echo "FAIL: test fixture did not create a large enough cached git diff to require truncation (raw_cached_diff=${raw_cached_diff_bytes} bytes)"
    exit 1
  fi

  if [ "$raw_working_diff_bytes" -lt 200000 ]; then
    echo "FAIL: test fixture did not create a large enough git diff to require truncation (raw_diff=${raw_working_diff_bytes} bytes)"
    exit 1
  fi

  git_context="$(SCRIPT_DIR="$tmp_repo" bash -c 'source "$1"; source "$2"; collect_memory_git_context' _ "$lib_script" "$memory_script")"
  git_context_bytes="$(printf '%s' "$git_context" | wc -c | tr -d ' ')"
  git_cached_diff_block="$(extract_context_block "$git_context" '[git diff --cached]')"
  git_diff_block="$(extract_context_block "$git_context" '[git diff]')"
  git_cached_diff_block_bytes="$(printf '%s' "$git_cached_diff_block" | wc -c | tr -d ' ')"
  git_diff_block_bytes="$(printf '%s' "$git_diff_block" | wc -c | tr -d ' ')"

  require_contains "$git_context" '[git status --short]' 'git context should include the status block header'
  require_contains "$git_context" '[git diff --cached]' 'git context should include the cached diff block header'
  require_contains "$git_context" '[git diff]' 'git context should include the working diff block header'

  require_contains "$git_cached_diff_block" '当前 git diff --cached 已截断' 'oversized cached diff should be marked with 当前 git diff --cached 已截断 inside the [git diff --cached] block'
  require_contains "$git_diff_block" '当前 git diff 已截断' 'oversized working diff should be marked with 当前 git diff 已截断 inside the [git diff] block'

  if [ "$git_context_bytes" -ge "$raw_working_diff_bytes" ]; then
    echo "FAIL: truncated git context should be reduced compared with the raw oversized diff (context=${git_context_bytes} bytes, raw_diff=${raw_working_diff_bytes} bytes, cached_block=${git_cached_diff_block_bytes} bytes, git_diff_block=${git_diff_block_bytes} bytes)"
    exit 1
  fi

  rm -rf "$tmp_repo"
}

assert_small_diff_is_not_truncated() {
  local tmp_repo git_context git_cached_diff_block git_diff_block

  tmp_repo="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-memory-git-context-small.XXXXXX")"

  git -C "$tmp_repo" init >/dev/null 2>&1
  git -C "$tmp_repo" config user.name 'Test User'
  git -C "$tmp_repo" config user.email 'test@example.com'

  printf 'base\n' > "$tmp_repo/small.txt"
  git -C "$tmp_repo" add small.txt
  git -C "$tmp_repo" commit -m 'init' >/dev/null 2>&1

  printf 'cached-change\n' > "$tmp_repo/small.txt"
  git -C "$tmp_repo" add small.txt
  printf 'working-change\n' > "$tmp_repo/small.txt"

  git_context="$(SCRIPT_DIR="$tmp_repo" bash -c 'source "$1"; source "$2"; collect_memory_git_context' _ "$lib_script" "$memory_script")"
  git_cached_diff_block="$(extract_context_block "$git_context" '[git diff --cached]')"
  git_diff_block="$(extract_context_block "$git_context" '[git diff]')"

  require_contains "$git_cached_diff_block" '+cached-change' 'small cached diff should keep the staged diff content'
  require_contains "$git_diff_block" '+working-change' 'small working diff should keep the working-tree diff content'
  require_not_contains "$git_cached_diff_block" '已截断' 'small cached diff should not include truncation markers'
  require_not_contains "$git_diff_block" '已截断' 'small working diff should not include truncation markers'

  rm -rf "$tmp_repo"
}

trap 'rm -rf "${tmp_repo:-}"' EXIT

assert_large_diff_is_truncated
assert_small_diff_is_not_truncated

echo 'PASS: git context keeps small diffs intact and truncates oversized diffs with correct markers'
