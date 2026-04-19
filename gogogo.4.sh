#!/bin/bash

require_command bun

if [ -d "$SCRIPT_DIR/web/dist" ]; then
  find "$SCRIPT_DIR/web/dist" -mindepth 1 ! -path "$SCRIPT_DIR/web/dist/index.html" -exec rm -rf {} +
  print_info "🧹 已清理 web/dist 构建产物，避免干扰 lint"
fi

print_info "🔍 运行前端格式检查"
(cd "$SCRIPT_DIR/web" && bun install && bun run lint) || exit 1

print_info "🔍 运行前端 ESLint"
(cd "$SCRIPT_DIR/web" && bun run eslint) || exit 1

print_warn "ℹ️ 后端 lint 暂未接入 gogogo.sh"
