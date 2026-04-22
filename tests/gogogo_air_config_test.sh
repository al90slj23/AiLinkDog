#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
air_config="$repo_root/.air.toml"

if [ ! -f "$air_config" ]; then
  echo "FAIL: .air.toml not found"
  exit 1
fi

grep -q '^root = "."$' "$air_config" || {
  echo 'FAIL: air root should stay at repository root'
  exit 1
}

grep -q '^include_ext = \["go"\]$' "$air_config" || {
  echo 'FAIL: air should only watch Go source extensions in phase 1'
  exit 1
}

grep -q '^exclude_dir = \["tmp", "vendor", "web", "docs", ".ai", ".git", "node_modules"\]$' "$air_config" || {
  echo 'FAIL: air exclude_dir should ignore frontend, docs, git, tmp and node_modules'
  exit 1
}

grep -q '^delay = 800$' "$air_config" || {
  echo 'FAIL: air should debounce rebuilds with an 800ms delay'
  exit 1
}

grep -q '^stop_on_error = false$' "$air_config" || {
  echo 'FAIL: air should keep the old process alive on build error'
  exit 1
}

echo 'PASS: .air.toml enforces backend-only autoreload rules'
