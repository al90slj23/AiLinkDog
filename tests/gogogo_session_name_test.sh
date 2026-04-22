#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"

lib_script="$repo_root/gogogo.lib.sh"

main_name="$(SCRIPT_DIR="$repo_root" bash -c 'source "$1"; get_dev_session_name' _ "$lib_script")"
worktree_name="$(SCRIPT_DIR="$repo_root/.worktrees/feature-gogogo-script" bash -c 'source "$1"; get_dev_session_name' _ "$lib_script")"

case "$main_name" in
  ALD-*)
    ;;
  *)
    echo "FAIL: session name should start with ALD-"
    echo "main: $main_name"
    exit 1
    ;;
esac

if [ "$main_name" = "$worktree_name" ]; then
  echo "FAIL: session names should differ between workspaces"
  echo "main: $main_name"
  echo "worktree: $worktree_name"
  exit 1
fi

echo "PASS: session names differ"
