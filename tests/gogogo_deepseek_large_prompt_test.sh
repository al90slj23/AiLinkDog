#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
ai_script="$repo_root/gogogo.ai.sh"
tmp_home="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-home.XXXXXX")"
tmp_bin="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-bin.XXXXXX")"
trap 'rm -rf "$tmp_home" "$tmp_bin"' EXIT

cat > "$tmp_bin/curl" <<'EOF'
#!/bin/bash
printf '%s' '{"choices":[{"message":{"content":"large prompt ok"}}]}'
EOF
chmod +x "$tmp_bin/curl"

env -i \
  HOME="$tmp_home" \
  PATH="$tmp_bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin" \
  DEEPSEEK_APIKEY_GOGOGOSH_GITHUB="test-key" \
  bash -c '
    source "$1"
    large_prompt="$(jot -b x 1300000 | tr -d "\n")"
    result="$(call_deepseek_text "system" "$large_prompt")"
    [ "$result" = "large prompt ok" ]
  ' _ "$ai_script"

echo 'PASS: call_deepseek_text handles oversized prompt input'
