#!/bin/bash

require_command go

print_info "🧪 运行 Go 测试"
(cd "$SCRIPT_DIR" && go test ./...) || exit 1

print_warn "ℹ️ 前端未配置 test 脚本，已跳过"
