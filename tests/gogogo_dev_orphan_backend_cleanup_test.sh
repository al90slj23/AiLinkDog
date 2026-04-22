#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
lib_script="$repo_root/gogogo.lib.sh"

grep -q 'go_build_cache_main_pattern' "$lib_script" || {
  echo 'FAIL: gogogo.lib.sh should define a go build cache main cleanup pattern'
  exit 1
}

grep -q 'Library/Caches/go-build' "$lib_script" || {
  echo 'FAIL: gogogo.lib.sh should clean orphan backend binaries from Go build cache'
  exit 1
}

echo 'PASS: gogogo cleanup handles orphan backend binaries from Go build cache'
