#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"

platform_script="$repo_root/gogogo.9.sh"

if [ ! -f "$platform_script" ]; then
  echo "SKIP: gogogo.9.sh not found yet"
  exit 0
fi

tmp_home="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-opencode-home.XXXXXX")"
tmp_project="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-opencode-project.XXXXXX")"
trap 'rm -rf "$tmp_home" "$tmp_project"' EXIT

mkdir -p "$tmp_project/.ai/L0#Execution/skills/global/demo-global-skill"
mkdir -p "$tmp_project/.ai/L0#Execution/skills/project/demo-project-skill"
mkdir -p "$tmp_project/.ai/L1#Overview"

printf '%s\n' '---' 'name: demo-global-skill' 'description: Use when validating gogogo global skill symlink setup' '---' '' '# Demo Global Skill' > "$tmp_project/.ai/L0#Execution/skills/global/demo-global-skill/SKILL.md"
printf '%s\n' '---' 'name: demo-project-skill' 'description: Use when validating gogogo project skill symlink setup' '---' '' '# Demo Project Skill' > "$tmp_project/.ai/L0#Execution/skills/project/demo-project-skill/SKILL.md"
printf '%s\n' '# Guide' > "$tmp_project/.ai/L1#Overview/guide.md"

mkdir -p "$tmp_project/web"
touch "$tmp_project/main.go"

mkdir -p "$tmp_home/.config/opencode"
printf '%s\n' '{' '  "skills": {' '    "paths": [' "      \"$tmp_home/.opencode/skills\"," "      \"$tmp_project/.opencode/skills/project\"" '    ]' '  }' '}' > "$tmp_home/.config/opencode/opencode.json"

HOME="$tmp_home" SCRIPT_DIR="$tmp_project" bash "$platform_script" 9 opencode force >/tmp/gogogo-opencode-skills-test.out 2>&1 || {
  cat /tmp/gogogo-opencode-skills-test.out
  echo "FAIL: opencode skill setup command failed"
  exit 1
}

if [ ! -L "$tmp_home/.opencode/skills/demo-global-skill" ]; then
  echo "FAIL: global skill symlink not created"
  exit 1
fi

if [ ! -L "$tmp_project/.opencode/skills/project/demo-project-skill" ]; then
  echo "FAIL: project skill symlink not created"
  exit 1
fi

echo "PASS: opencode global and project skill symlinks created"
