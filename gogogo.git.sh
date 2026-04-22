#!/bin/bash

GITHUB_DEPLOY_REMOTE_URL="https://github.com/al90slj23/AiLinkDog.git"
COMMIT_SUMMARY_DIFF_BYTE_LIMIT=32768

get_commit_status_block() {
  git -C "$SCRIPT_DIR" status --short 2>/dev/null
}

get_commit_cached_diff_block() {
  git -C "$SCRIPT_DIR" diff --cached 2>/dev/null
}

get_commit_working_diff_block() {
  git -C "$SCRIPT_DIR" diff 2>/dev/null
}

collect_commit_diff_summary_block() {
  local block_name tmp_file captured_bytes

  block_name="$1"
  shift
  tmp_file="$(mktemp "${TMPDIR:-/tmp}/gogogo-commit-diff.XXXXXX")" || return 1

  git -C "$SCRIPT_DIR" diff "$@" 2>/dev/null | dd bs=1 count="$((COMMIT_SUMMARY_DIFF_BYTE_LIMIT + 1))" of="$tmp_file" 2>/dev/null
  captured_bytes="$(wc -c < "$tmp_file" | tr -d ' ')"

  if [ "$captured_bytes" -le "$COMMIT_SUMMARY_DIFF_BYTE_LIMIT" ]; then
    cat "$tmp_file"
    rm -f "$tmp_file"
    return 0
  fi

  dd if="$tmp_file" bs=1 count="$COMMIT_SUMMARY_DIFF_BYTE_LIMIT" 2>/dev/null | iconv -f UTF-8 -t UTF-8 -c 2>/dev/null
  printf '\n\n[当前 %s 已截断，仅保留前 %s 字节]' "$block_name" "$COMMIT_SUMMARY_DIFF_BYTE_LIMIT"
  rm -f "$tmp_file"
}

get_recent_commit_block() {
  git -C "$SCRIPT_DIR" log -5 --pretty=format:'%h %s' 2>/dev/null
}

get_commit_diff_block() {
  printf '[git diff --cached]\n'
  collect_commit_diff_summary_block 'git diff --cached' --cached
  printf '\n\n[git diff]\n'
  collect_commit_diff_summary_block 'git diff'
}

collect_commit_context() {
  local status_block cached_diff_block working_diff_block recent_commits

  status_block="$(get_commit_status_block)"
  cached_diff_block="$(get_commit_cached_diff_block)"
  working_diff_block="$(get_commit_working_diff_block)"
  recent_commits="$(get_recent_commit_block)"

  cat <<EOF
[git status --short]
${status_block}

[git diff --cached]
${cached_diff_block}

[git diff]
${working_diff_block}

[recent commits]
${recent_commits}
EOF
}

build_commit_summary_from_guidance() {
  local provider guidance_text current_summary status_block diff_block recent_commit_block regenerated_summary

  provider="$1"
  guidance_text="$2"
  current_summary="$3"
  status_block="$4"
  diff_block="$5"
  recent_commit_block="$6"
  regenerated_summary="$(generate_commit_summary_text "$provider" "$status_block" "$diff_block" "$recent_commit_block" "${guidance_text}")"
  if [ -n "$regenerated_summary" ]; then
    printf '%s\n' "$regenerated_summary"
    return 0
  fi

  printf '%s\n' "$current_summary"
}

choose_summary_provider() {
  local provider_choice

  while true; do
    printf '\n' >&2
    print_info "请选择提交摘要生成 provider：" >&2
    printf '1. OpenCode\n' >&2
    printf '2. DeepSeek API\n' >&2
    printf '3. Claude Code（预留）\n' >&2
    read -r -p "请输入选择（直接回车默认 1）: " provider_choice >&2

    case "$provider_choice" in
      ""|1)
        printf '%s\n' "$SUMMARY_PROVIDER_OPENCODE"
        return 0
        ;;
      2)
        printf '%s\n' "$SUMMARY_PROVIDER_DEEPSEEK"
        return 0
        ;;
      3)
        printf '%s\n' "$SUMMARY_PROVIDER_CLAUDE"
        return 0
        ;;
      *)
        print_error "❌ 请输入有效选项：1、2、3，或直接回车" >&2
        ;;
    esac
  done
}

edit_summary_with_current_content() {
  local current_summary current_title current_body edited_title edited_body line

  current_summary="$1"
  current_title="$(extract_commit_title "$current_summary")"
  current_body="$(extract_commit_body "$current_summary")"

  print_info "当前标题如下，直接回车表示保留当前内容：" >&2
  printf '%s\n' "$current_title" >&2
  read -r -p "请输入新的标题: " edited_title >&2
  if [ -z "$edited_title" ]; then
    edited_title="$current_title"
  fi

  print_info "当前正文如下，结束请输入单独一行 .，直接回车后再输入 . 表示保留当前正文：" >&2
  printf '%s\n' "$current_body" >&2
  edited_body=""
  while IFS= read -r line; do
    if [ "$line" = "." ]; then
      break
    fi
    if [ -n "$edited_body" ]; then
      edited_body="${edited_body}
${line}"
    else
      edited_body="$line"
    fi
  done

  if [ -z "$edited_body" ]; then
    edited_body="$current_body"
  fi

  cat <<EOF
TITLE: ${edited_title}
BODY:
${edited_body}
EOF
}

parse_confirmed_summary() {
  local summary_text title body

  summary_text="$1"
  title="$(extract_commit_title "$summary_text")"
  body="$(extract_commit_body "$summary_text")"

  if [ -z "$title" ]; then
    print_error "❌ 提交标题不能为空"
    return 1
  fi

  if [ -z "$body" ]; then
    print_error "❌ 提交正文不能为空"
    return 1
  fi

  printf 'TITLE:%s\n' "$title"
  printf 'BODY:\n%s\n' "$body"
}

confirm_or_edit_commit_summary() {
  local provider context_text status_block diff_block recent_commit_block current_summary edited_summary action confirmed_summary

  provider="$1"
  context_text="$2"
  status_block="$3"
  diff_block="$4"
  recent_commit_block="$5"
  current_summary="$6"

  while true; do
    printf '\n' >&2
    print_info "当前提交摘要：" >&2
    printf '%s\n' "$current_summary" >&2
    printf '\n' >&2
    printf '1. 确认当前摘要，执行下一步\n' >&2
    printf '2. 自定义摘要（基于当前摘要改写）\n' >&2
    printf '3. 取消\n' >&2
    printf '\n' >&2
    printf '直接输入其他内容，则视为补充说明，我会基于当前摘要重新整理一版\n' >&2
    read -r -p "请输入选择或补充说明: " action >&2

    case "$action" in
      1)
        confirmed_summary="$(parse_confirmed_summary "$current_summary")" || continue
        printf '%s\n' "$confirmed_summary"
        return 0
        ;;
      2)
        edited_summary="$(edit_summary_with_current_content "$current_summary")" || continue
        confirmed_summary="$(parse_confirmed_summary "$edited_summary")" || continue
        current_summary="$confirmed_summary"
        ;;
      3)
        return 1
        ;;
      *)
        if [ -n "$action" ]; then
          current_summary="$(build_commit_summary_from_guidance "$provider" "$action" "$current_summary" "$status_block" "$diff_block" "$recent_commit_block")"
        else
          print_error "❌ 请输入有效选择或补充说明" >&2
        fi
        ;;
    esac
  done
}

get_confirmed_commit_summary() {
  local provider status_block diff_block recent_commit_block commit_context initial_summary confirmed_summary

  provider="$1"
  if [ -z "$provider" ]; then
    print_error "❌ 缺少提交摘要 provider"
    return 1
  fi

  status_block="$(get_commit_status_block)"
  diff_block="$(get_commit_diff_block)"
  recent_commit_block="$(get_recent_commit_block)"
  commit_context="$(collect_commit_context)"
  initial_summary="$(generate_commit_summary_text "$provider" "$status_block" "$diff_block" "$recent_commit_block" "")"
  if [ -z "$initial_summary" ]; then
    print_error "❌ 提交摘要生成失败"
    return 1
  fi
  confirmed_summary="$(confirm_or_edit_commit_summary "$provider" "$commit_context" "$status_block" "$diff_block" "$recent_commit_block" "$initial_summary")" || return 1
  printf '%s\n' "$confirmed_summary"
}

detect_upstream_default_branch() {
  local default_branch

  if ! command -v gh >/dev/null 2>&1; then
    printf 'main\n'
    return 0
  fi

  default_branch="$(gh repo view QuantumNous/new-api --json defaultBranchRef --jq '.defaultBranchRef.name' 2>/dev/null)"
  if [ -n "$default_branch" ]; then
    printf '%s\n' "$default_branch"
    return 0
  fi

  printf 'main\n'
}

build_pr_body() {
  local summary_text summary_body verification_lines

  summary_text="$1"
  summary_body="$(extract_commit_body "$summary_text")"

  if [ -z "$summary_body" ]; then
    summary_body="- 已完成本次提交内容整理"
  else
    summary_body="$(printf '%s\n' "$summary_body" | awk 'NF { print "- " $0 }')"
  fi

  verification_lines="- git status
- 根据本地流程完成提交与推送确认"

  cat <<EOF
## Summary
${summary_body}

## Verification
${verification_lines}
EOF
}

maybe_create_upstream_pr() {
  local summary_text pr_choice base_branch pr_title pr_body

  summary_text="$1"

  printf '\n'
  read -r -p "是否向 upstream -> QuantumNous/new-api 创建 PR？[y/N]: " pr_choice
  case "$pr_choice" in
    y|Y|yes|YES)
      ;;
    *)
      print_info "ℹ️ 已跳过创建 PR"
      return 0
      ;;
  esac

  require_command gh
  base_branch="$(detect_upstream_default_branch)"
  pr_title="$(extract_commit_title "$summary_text")"
  pr_body="$(build_pr_body "$summary_text")"

  gh pr create \
    --repo QuantumNous/new-api \
    --base "$base_branch" \
    --head "al90slj23:main" \
    --title "$pr_title" \
    --body "$pr_body"
}

run_github_deploy_flow() {
  local provider current_branch continue_choice confirmed_summary commit_title commit_body status_block summary_status

  provider="$1"
  if [ -z "$provider" ]; then
    print_error "❌ 缺少 GitHub 上传流程所需的摘要 provider"
    return 1
  fi

  current_branch="$(get_current_branch)"
  if [ "$current_branch" != "main" ]; then
    print_warn "⚠️ 当前分支不是 main：${current_branch}"
    read -r -p "仍然继续执行并推送到 origin(main) -> al90slj23/AiLinkDog 吗？[y/N]: " continue_choice
    case "$continue_choice" in
      y|Y|yes|YES)
        ;;
      *)
        print_info "ℹ️ 已取消 GitHub 上传流程"
        return 0
        ;;
    esac
  fi

  status_block="$(get_commit_status_block)"
  if [ -z "$status_block" ]; then
    print_warn "ℹ️ 当前没有可提交的变更，已跳过 GitHub 上传流程"
    return 0
  fi

  confirmed_summary="$(get_confirmed_commit_summary "$provider")"
  summary_status=$?
  if [ $summary_status -ne 0 ]; then
    print_info "ℹ️ 已取消 GitHub 上传流程"
    return 0
  fi

  commit_title="$(extract_commit_title "$confirmed_summary")"
  commit_body="$(extract_commit_body "$confirmed_summary")"

  print_info "📦 准备暂存所有改动"
  git -C "$SCRIPT_DIR" add . || return 1

  print_info "📝 创建提交"
  git -C "$SCRIPT_DIR" commit -m "$commit_title" -m "$commit_body" || return 1

  print_info "🚀 推送到 origin(main) -> al90slj23/AiLinkDog"
  git -C "$SCRIPT_DIR" push "$GITHUB_DEPLOY_REMOTE_URL" HEAD:main || return 1

  maybe_create_upstream_pr "$confirmed_summary"
}

run_publish_to_github_flow() {
  local provider

  provider="$(choose_summary_provider)" || return 1
  if [ "$provider" = "$SUMMARY_PROVIDER_CLAUDE" ]; then
    print_warn "Claude Code provider 暂未接入，后续安排"
    print_info "ℹ️ 已结束上传到 GitHub 流程"
    return 0
  fi

  run_memory_sync_flow || return 1
  run_github_deploy_flow "$provider"
}
