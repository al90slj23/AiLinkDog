#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
platform_script="$repo_root/gogogo.9.sh"

tmp_home="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-opencode-global-home.XXXXXX")"
tmp_project="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-opencode-global-project.XXXXXX")"
trap 'rm -rf "$tmp_home" "$tmp_project"' EXIT

mkdir -p "$tmp_project/.ai/L0#Execution/skills/global/demo-global-skill"
mkdir -p "$tmp_project/.ai/L0#Execution/skills/project/demo-project-skill"
mkdir -p "$tmp_project/.ai/L1#Overview"
mkdir -p "$tmp_project/web"

printf '%s\n' '---' 'name: demo-global-skill' 'description: Use when validating gogogo global skill sync' '---' '' '# Demo Global Skill' > "$tmp_project/.ai/L0#Execution/skills/global/demo-global-skill/SKILL.md"
printf '%s\n' '---' 'name: demo-project-skill' 'description: Use when validating gogogo project skill sync' '---' '' '# Demo Project Skill' > "$tmp_project/.ai/L0#Execution/skills/project/demo-project-skill/SKILL.md"
printf '%s\n' '# Guide' > "$tmp_project/.ai/L1#Overview/guide.md"
touch "$tmp_project/main.go"

mkdir -p "$tmp_home/.config/opencode" "$tmp_home/.opencode/skills"
printf '%s\n' '{' '  "skills": {' '    "paths": [' "      \"$tmp_home/.opencode/skills\"" '    ]' '  }' '}' > "$tmp_home/.config/opencode/opencode.json"

HOME="$tmp_home" SCRIPT_DIR="$tmp_project" bash "$platform_script" 9 opencode fill-missing >/tmp/gogogo-opencode-global-skills-test.out 2>&1 || {
  cat /tmp/gogogo-opencode-global-skills-test.out
  echo "FAIL: opencode global fill-missing command failed"
  exit 1
}

if [ ! -L "$tmp_home/.opencode/skills/demo-global-skill" ]; then
  echo "FAIL: global skill symlink not created in shared opencode path"
  exit 1
fi

if [ ! -L "$tmp_project/.opencode/skills/project/demo-project-skill" ]; then
  echo "FAIL: project skill symlink not created in project opencode path"
  exit 1
fi

echo "PASS: opencode global and project skill sync works"
