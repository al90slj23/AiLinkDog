#!/bin/bash

require_command go
require_command bun

print_info "📦 构建前端"
(cd "$SCRIPT_DIR/web" && bun install && bun run build) || exit 1

print_info "📦 编译后端"
(cd "$SCRIPT_DIR" && go build ./...) || exit 1
