#!/bin/bash

MEMORY_CHANGELOG_DIR="${SCRIPT_DIR}/.ai/L4#Changelog"
MEMORY_RECENT_FIX_SUMMARY="${SCRIPT_DIR}/.ai/L5#Knowledge/recent-fix-summary.md"

collect_memory_changed_files() {
  git -C "$SCRIPT_DIR" status --short 2>/dev/null | while IFS= read -r line; do
    case "$line" in
      '?? '*) printf '%s\n' "${line#?? }" ;;
      ??' '*) printf '%s\n' "${line#?? }" ;;
    esac
  done
}

collect_memory_git_context() {
  local status_block cached_diff_block working_diff_block branch_name

  status_block="$(git -C "$SCRIPT_DIR" status --short 2>/dev/null)"
  cached_diff_block="$(git -C "$SCRIPT_DIR" diff --cached 2>/dev/null)"
  working_diff_block="$(git -C "$SCRIPT_DIR" diff 2>/dev/null)"
  branch_name="$(get_current_branch)"

  cat <<EOF
[当前分支]
${branch_name}

[git status --short]
${status_block}

[git diff --cached]
${cached_diff_block}

[git diff]
${working_diff_block}
EOF
}

collect_memory_navigation_context() {
  local file

  for file in \
    "$SCRIPT_DIR/.ai/L0#Execution/README.md" \
    "$SCRIPT_DIR/.ai/L1#Overview/guide.md" \
    "$SCRIPT_DIR/.ai/L2#Index/toc.md" \
    "$SCRIPT_DIR/.ai/L2#Index/conventions.md"
  do
    [ -f "$file" ] || continue
    printf '## FILE: %s\n' "$file"
    cat "$file"
    printf '\n\n'
  done
}

collect_memory_candidate_files() {
  local path
  shopt -s nullglob
  for path in \
    "$SCRIPT_DIR/.ai/L0#Execution"/**/*.md \
    "$SCRIPT_DIR/.ai/L1#Overview"/**/*.md \
    "$SCRIPT_DIR/.ai/L2#Index"/**/*.md \
    "$SCRIPT_DIR/.ai/L3#Standards/standards"/*.md
  do
    [ -f "$path" ] || continue
    printf '%s\n' "$path"
  done | awk 'NF && !seen[$0]++'
  shopt -u nullglob
}

build_memory_pre_summary_prompt() {
  local git_context

  git_context="$1"

  cat <<EOF
请根据以下仓库改动信息，生成一份中文“最近工作总结”。

要求：
1. 输出 Markdown。
2. 必须包含：
   - `# 标题`
   - `## 本次工作总结`
   - `## 涉及范围`
   - `## 关键改动`
   - `## 验证情况`
3. 不要编造不存在的验证结果。
4. 如果无法确认验证是否执行，请明确写“未从上下文确认”。

${git_context}
EOF
}

build_memory_file_selection_prompt() {
  local git_context navigation_context candidate_files pre_summary

  git_context="$1"
  navigation_context="$2"
  candidate_files="$3"
  pre_summary="$4"

  cat <<EOF
你现在要为本地知识库做“纯化前置判断”。

目标：
基于当前改动，判断 .ai/L0、.ai/L1、.ai/L2、.ai/L3 中哪些文件需要进一步详细阅读，才能产出“纯化建议与冲突说明”。

输出要求：
1. 只输出需要详细阅读的目标文件。
2. 每行格式严格如下：
FILE: <绝对路径> | REASON: <一句中文原因>
3. 最多输出 8 个文件。
4. 不要输出源码文件，不要输出 README/CLAUDE/AGENTS 这类改动来源文件。
5. 目标文件只能来自我给你的 .ai/L0、.ai/L1、.ai/L2、.ai/L3 候选列表。

## 最近工作总结

${pre_summary}

## Git 上下文

${git_context}

## L0/L1/L2 导航上下文

${navigation_context}

## 可选目标文件

${candidate_files}
EOF
}

parse_selected_memory_files() {
  printf '%s\n' "$1" | while IFS= read -r line; do
    case "$line" in
      FILE:\ *"| REASON:"*)
        line="${line#FILE: }"
        printf '%s\n' "${line%%| REASON:*}"
        ;;
    esac
  done
}

collect_selected_file_contents() {
  local file

  while IFS= read -r file; do
    [ -f "$file" ] || continue
    printf '## FILE: %s\n' "$file"
    cat "$file"
    printf '\n\n'
  done <<EOF
$1
EOF
}

build_purification_plan_prompt() {
  local git_context pre_summary selected_with_reasons selected_contents

  git_context="$1"
  pre_summary="$2"
  selected_with_reasons="$3"
  selected_contents="$4"

  cat <<EOF
你现在要基于当前改动，输出一份“知识库纯化建议与计划”。

要求：
1. 输出 Markdown。
2. 必须包含以下结构：

# <标题>
## 本次工作总结
## 需要纯化的文件
### FILE: <绝对路径>
- 触发原因：
- 旧规范 / 旧认知：
- 新设定 / 新事实：
- 冲突点：
- 建议纯化位置：
- 建议修改动作：
- 关联改动来源：

## 纯化执行计划
## 需要用户确认的事项

3. “需要纯化的文件”部分只写真正需要纯化的 .ai/L0、.ai/L1、.ai/L2、.ai/L3 目标文件。
4. 不能把源码文件当成纯化目标。
5. 必须明确“旧规范 / 新设定 / 冲突点”，不能只说“可能影响”。
6. 如果没有明显冲突，也要明确写“未发现明确冲突，仅建议补充同步”。

## 最近工作总结

${pre_summary}

## Git 上下文

${git_context}

## 已选择详细阅读的目标文件

${selected_with_reasons}

## 这些目标文件的当前内容

${selected_contents}
EOF
}

extract_summary_section() {
  printf '%s\n' "$1" | awk '
    /^## 本次工作总结/ { in_section = 1; print; next }
    /^## / && in_section { exit }
    in_section { print }
  '
}

update_recent_fix_summary_file() {
  local title summary_section tmp_file

  title="$1"
  summary_section="$2"
  tmp_file="$(mktemp "${TMPDIR:-/tmp}/gogogo-memory.XXXXXX")" || return 1

  {
    sed -n '1p' "$MEMORY_RECENT_FIX_SUMMARY"
    printf '\n## %s\n\n' "$title"
    printf '%s\n\n' "$summary_section"
    printf '### 来源\n\n- 本条由 `gogogo.sh 7` 更新。\n\n'
    tail -n +2 "$MEMORY_RECENT_FIX_SUMMARY"
  } >"$tmp_file"

  mv "$tmp_file" "$MEMORY_RECENT_FIX_SUMMARY"
}

extract_purification_target_files() {
  printf '%s\n' "$1" | awk '/^### FILE: / { sub(/^### FILE: /, ""); print }'
}

run_purification_followup() {
  local report_file report_content target_files action selection index target current_file

  report_file="$1"
  report_content="$2"
  target_files="$(extract_purification_target_files "$report_content")"

  if [ -z "$target_files" ]; then
    print_info "ℹ️ 本次总结未识别出需要进一步纯化的目标文件"
    return 0
  fi

  printf '\n'
  echo "1. 现在打开总结报告和所有纯化目标文件"
  echo "2. 只打开指定编号的纯化目标文件"
  echo "3. 仅记录总结与纯化计划，不立即打开文件"
  echo "0. 退出"
  echo ""
  read -r -p "请输入选择: " action

  case "$action" in
    1)
      open_path_in_editor "$report_file"
      while IFS= read -r target; do
        [ -z "$target" ] && continue
        open_path_in_editor "$target"
      done <<EOF
$target_files
EOF
      ;;
    2)
      index=1
      while IFS= read -r target; do
        [ -z "$target" ] && continue
        printf '%s. %s\n' "$index" "$target"
        index=$((index + 1))
      done <<EOF
$target_files
EOF
      printf '\n'
      read -r -p "请输入要打开的编号（多个编号用空格分隔）: " selection
      [ -z "$selection" ] && return 0
      open_path_in_editor "$report_file"
      index=1
      while IFS= read -r current_file; do
        [ -z "$current_file" ] && continue
        for target in $selection; do
          if [ "$target" = "$index" ]; then
            open_path_in_editor "$current_file"
            break
          fi
        done
        index=$((index + 1))
      done <<EOF
$target_files
EOF
      ;;
    3)
      print_info "ℹ️ 已记录总结与纯化计划，暂不自动打开文件"
      ;;
    0)
      print_info "ℹ️ 已退出，不继续纯化"
      ;;
    *)
      print_warn "⚠️ 无效选择，已结束本次总结流程"
      ;;
  esac
}

confirm_memory_report_save() {
  local report_content

  report_content="$1"

  printf '\n'
  print_info "================ 总结与纯化计划（预览） ================"
  printf '%s\n' "$report_content"
  print_info "================ 预览结束 ================"
  printf '\n'

  echo "1. 保存到知识库，并继续处理纯化"
  echo "2. 不保存，但打开完整内容查看"
  echo "0. 取消本次总结流程"
  echo ""
  read -r -p "请输入选择: " action

  case "$action" in
    1)
      return 0
      ;;
    2)
      return 2
      ;;
    0)
      return 1
      ;;
    *)
      print_warn "⚠️ 无效选择，已取消本次总结流程"
      return 1
      ;;
  esac
}

run_memory_sync_flow() {
  local changed_files title_input title_slug now title report_file
  local git_context navigation_context candidate_files pre_summary
  local selected_with_reasons selected_files selected_contents final_report summary_section save_decision preview_file

  changed_files="$(collect_memory_changed_files)"
  if [ -z "$changed_files" ]; then
    print_warn "ℹ️ 当前没有未提交的变更，已跳过知识库总结"
    return 0
  fi

  read -r -p "请输入本次工作主题（可回车自动生成）: " title_input
  if [ -z "$title_input" ]; then
    title_input="工作总结"
  fi

  title_slug="$(sanitize_session_suffix "$title_input")"
  now="$(date '+%Y-%m-%d-%H%M')"
  title="${now} ${title_input}"
  report_file="${MEMORY_CHANGELOG_DIR}/${now}-${title_slug}.md"

  git_context="$(collect_memory_git_context)"
  navigation_context="$(collect_memory_navigation_context)"
  candidate_files="$(collect_memory_candidate_files)"

  print_info "🧠 正在生成最近工作总结..."
  pre_summary="$(call_deepseek_text \
    '你是严谨的中文项目总结助手。' \
    "$(build_memory_pre_summary_prompt "$git_context")")" || {
    print_error "❌ DeepSeek 最近工作总结生成失败"
    return 1
  }

  print_info "📚 正在判断需要详细阅读的知识库文件..."
  selected_with_reasons="$(call_deepseek_text \
    '你是严谨的知识库纯化预判助手。' \
    "$(build_memory_file_selection_prompt "$git_context" "$navigation_context" "$candidate_files" "$pre_summary")")" || {
    print_error "❌ DeepSeek 纯化预判失败"
    return 1
  }

  selected_files="$(parse_selected_memory_files "$selected_with_reasons")"
  selected_contents="$(collect_selected_file_contents "$selected_files")"

  print_info "📝 正在生成纯化建议与计划..."
  final_report="$(call_deepseek_text \
    '你是严谨的中文知识库纯化助手。你的任务是基于当前改动与知识库文件内容，输出可执行的纯化建议。' \
    "$(build_purification_plan_prompt "$git_context" "$pre_summary" "$selected_with_reasons" "$selected_contents")")" || {
    print_error "❌ DeepSeek 纯化计划生成失败"
    return 1
  }

  confirm_memory_report_save "$final_report"
  save_decision=$?

  if [ "$save_decision" -eq 1 ]; then
    print_info "ℹ️ 已取消本次总结流程，未写入知识库"
    return 0
  fi

  if [ "$save_decision" -eq 2 ]; then
    preview_file="$(mktemp "${TMPDIR:-/tmp}/gogogo-memory-preview.XXXXXX.md")" || return 1
    printf '%s\n' "$final_report" >"$preview_file"
    open_path_in_editor "$preview_file"
    print_info "ℹ️ 本次总结未写入知识库，只打开了预览文件：$preview_file"
    return 0
  fi

  printf '%s\n' "$final_report" >"$report_file"
  summary_section="$(extract_summary_section "$final_report")"
  update_recent_fix_summary_file "$title" "$summary_section"

  print_success "✅ 已更新工作日志：$report_file"
  print_success "✅ 已更新近期修复总结：$MEMORY_RECENT_FIX_SUMMARY"

  run_purification_followup "$report_file" "$final_report"
}
