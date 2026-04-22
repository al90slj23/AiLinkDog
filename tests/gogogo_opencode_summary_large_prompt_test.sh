#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
ai_script="$repo_root/gogogo.ai.sh"
tmp_bin="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-opencode-bin.XXXXXX")"
trap 'rm -rf "$tmp_bin"' EXIT

cat > "$tmp_bin/opencode" <<'EOF'
#!/bin/bash
if [ "$#" -gt 1 ]; then
  echo 'argument overload' >&2
  exit 1
fi
stdin_payload="$(cat)"
[ -n "$stdin_payload" ] || exit 1
printf 'TITLE: ok\nBODY:\nstdin ok\n'
EOF
chmod +x "$tmp_bin/opencode"

env -i PATH="$tmp_bin:/usr/bin:/bin:/usr/sbin:/sbin" bash -c '
  source "$1"
  get_current_branch() { printf "main\n"; }
  status_block="M file.txt"
  diff_block="$(awk "BEGIN { for (i = 0; i < 200000; i++) printf \"x\" }")"
  result="$(call_opencode_for_commit_summary "$status_block" "$diff_block" "abc test" "")"
  [ -n "$result" ]
' _ "$ai_script"

echo 'PASS: OpenCode summary provider handles oversized prompt input'
