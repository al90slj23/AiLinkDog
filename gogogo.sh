#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/gogogo.lib.sh" ]; then
  source "$SCRIPT_DIR/gogogo.lib.sh"
else
  echo "❌ 错误：找不到 gogogo.lib.sh"
  exit 1
fi

if [ -f "$SCRIPT_DIR/gogogo.ai.sh" ]; then
  source "$SCRIPT_DIR/gogogo.ai.sh"
fi

if [ -f "$SCRIPT_DIR/gogogo.git.sh" ]; then
  source "$SCRIPT_DIR/gogogo.git.sh"
fi

if [ -f "$SCRIPT_DIR/gogogo.memory.sh" ]; then
  source "$SCRIPT_DIR/gogogo.memory.sh"
fi

check_project_root

printf '%b\n' "${BLUE}================================${NC}"
printf '%b\n' "${BLUE}       new-api gogogo.sh${NC}"
printf '%b\n' "${BLUE}================================${NC}"
printf '\n'

if [ -n "$1" ]; then
  choice="$(normalize_choice "$1")"
  print_success "📌 执行选项: ${choice}"
else
  print_info "请选择操作："
  echo "1. 本地开发（tmux 分屏启动前后端）"
  echo "2. 构建项目"
  echo "3. 运行测试"
  echo "4. 运行检查"
  echo "5. 清理安全产物"
  echo "6. 部署"
  echo "attach. 进入当前开发会话"
  echo "stop. 停止当前开发会话"
  echo "0. 退出"
  echo ""
  read -t 10 -p "请输入选择 (10秒后自动选择1): " choice

  if [ -z "$choice" ]; then
    choice="1"
    print_success "⏱️  自动选择：本地开发"
  fi

  choice="$(normalize_choice "$choice")"
fi

if [ "$choice" = "0" ]; then
  print_success "👋 再见！"
  exit 0
fi

if [ "$choice" = "attach" ]; then
  session_name="$(get_dev_session_name)"
  if tmux has-session -t "$session_name" 2>/dev/null; then
    exec tmux attach-session -t "$session_name"
  fi
  print_error "❌ 当前工作区没有可进入的开发会话：$session_name"
  exit 1
fi

if [ "$choice" = "stop" ]; then
  session_name="$(get_dev_session_name)"
  if tmux has-session -t "$session_name" 2>/dev/null; then
    tmux kill-session -t "$session_name"
    print_success "✅ 已停止当前开发会话：$session_name"
    exit 0
  fi
  print_warn "ℹ️ 当前工作区没有运行中的开发会话：$session_name"
  exit 0
fi

START_TIME=$(date +%s)
export START_TIME

SUB_SCRIPT="$SCRIPT_DIR/gogogo.${choice}.sh"
if [ -f "$SUB_SCRIPT" ]; then
  source "$SUB_SCRIPT"
  sub_status=$?
  if [ "$sub_status" -ne 0 ]; then
    exit "$sub_status"
  fi
  if [ "${SUPPRESS_ELAPSED_TIME:-0}" != "1" ]; then
    show_elapsed_time "$START_TIME"
  fi
else
  print_error "❌ 无效选择：${choice}"
  print_warn "💡 可用选项：1/2/3/4/5/6、attach、stop 或 dev/build/test/lint/clean/deploy"
  exit 1
fi
