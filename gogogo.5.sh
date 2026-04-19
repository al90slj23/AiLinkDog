#!/bin/bash

TARGET="$SCRIPT_DIR/web/dist"
PLACEHOLDER="$TARGET/index.html"

if [ -d "$TARGET" ]; then
  find "$TARGET" -mindepth 1 ! -path "$PLACEHOLDER" -exec rm -rf {} +
  print_success "🧹 已清理构建产物，保留占位文件：$PLACEHOLDER"
else
  print_warn "ℹ️ 无需清理，目录不存在：$TARGET"
fi
