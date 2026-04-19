#!/bin/bash

require_command tmux
require_command go
require_command bun

SESSION_NAME="$(get_dev_session_name)"

DEV_SESSIONS="$(list_dev_sessions)"

if [ -n "$DEV_SESSIONS" ] && [ -t 0 ]; then
  print_warn "⚠️ 检测到已有开发会话："
  index=1
  while IFS= read -r session_name; do
    if [ "$session_name" = "$SESSION_NAME" ]; then
      printf '%s\n' "$index. $session_name  [当前工作区]"
    else
      printf '%s\n' "$index. $session_name"
    fi
    index=$((index + 1))
  done <<EOF
$DEV_SESSIONS
EOF
  echo ""
  echo "请选择操作："
  echo "1. 进入已有会话"
  echo "2. 关闭当前工作区会话，并重启前后端"
  echo "3. 关闭所有开发会话，并重启前后端"
  echo "0. 退出"
  echo ""
  read -r -p "请输入选择: " session_action

  case "$session_action" in
    1)
      read -r -p "请输入要进入的会话编号: " session_choice
      target_session=""
      index=1
      while IFS= read -r session_name; do
        if [ "$index" = "$session_choice" ]; then
          target_session="$session_name"
          break
        fi
        index=$((index + 1))
      done <<EOF
$DEV_SESSIONS
EOF

      if [ -z "$target_session" ]; then
        print_error "❌ 无效会话编号：$session_choice"
        exit 1
      fi

      SUPPRESS_ELAPSED_TIME=1
      export SUPPRESS_ELAPSED_TIME
      exec tmux attach-session -t "$target_session"
      ;;
    2)
      if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        tmux kill-session -t "$SESSION_NAME"
      fi
      ;;
    3)
      while IFS= read -r session_name; do
        tmux kill-session -t "$session_name" 2>/dev/null
      done <<EOF
$DEV_SESSIONS
EOF
      ;;
    0)
      print_warn "ℹ️ 已取消进入开发模式"
      exit 0
      ;;
    *)
      print_error "❌ 无效选择：$session_action"
      exit 1
      ;;
  esac
elif tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  print_warn "⚠️ 当前工作区会话已存在，正在连接：$SESSION_NAME"
  SUPPRESS_ELAPSED_TIME=1
  export SUPPRESS_ELAPSED_TIME
  exec tmux attach-session -t "$SESSION_NAME"
fi

print_info "🚀 创建 tmux session：$SESSION_NAME"
tmux new-session -d -s "$SESSION_NAME" -c "$SCRIPT_DIR"
tmux send-keys -t "$SESSION_NAME":0.0 'go run main.go' C-m
tmux rename-window -t "$SESSION_NAME":0 'dev'
tmux split-window -h -t "$SESSION_NAME":0 -c "$SCRIPT_DIR/web"
tmux send-keys -t "$SESSION_NAME":0.1 'bun install && bun run dev' C-m
tmux select-layout -t "$SESSION_NAME":0 even-horizontal
tmux select-pane -t "$SESSION_NAME":0.0

SUPPRESS_ELAPSED_TIME=1
export SUPPRESS_ELAPSED_TIME
exec tmux attach-session -t "$SESSION_NAME"
