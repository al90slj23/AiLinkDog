#!/bin/bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
lib_script="$repo_root/gogogo.lib.sh"
tmp_home="$(mktemp -d "${TMPDIR:-/tmp}/gogogo-home.XXXXXX")"
trap 'rm -rf "$tmp_home"' EXIT

mkdir -p "$tmp_home/go/bin"
cat > "$tmp_home/go/bin/air" <<'EOF'
#!/bin/bash
exit 0
EOF
chmod +x "$tmp_home/go/bin/air"

env -i HOME="$tmp_home" PATH="/usr/bin:/bin:/usr/sbin:/sbin" SCRIPT_DIR="$repo_root" bash -c '
  source "$1"
  require_command air
' _ "$lib_script"

echo 'PASS: require_command resolves commands from HOME go bin fallback'
