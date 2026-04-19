#!/bin/bash

DEEPSEEK_GITHUB_ENDPOINT="https://api.deepseek.com/chat/completions"

SUMMARY_PROVIDER_OPENCODE="opencode"
SUMMARY_PROVIDER_DEEPSEEK="deepseek"
SUMMARY_PROVIDER_CLAUDE="claude"

is_supported_summary_provider() {
  case "$1" in
    "$SUMMARY_PROVIDER_OPENCODE"|"$SUMMARY_PROVIDER_DEEPSEEK"|"$SUMMARY_PROVIDER_CLAUDE")
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

load_deepseek_github_key_from_zshrc() {
  local zshrc_path loaded_value

  if [ -n "${DEEPSEEK_APIKEY_GOGOGOSH_GITHUB:-}" ]; then
    return 0
  fi

  zshrc_path="${HOME}/.zshrc"
  if [ ! -f "$zshrc_path" ]; then
    return 1
  fi

  loaded_value="$(zsh -c 'source "$HOME/.zshrc" >/dev/null 2>&1; printf %s "${DEEPSEEK_APIKEY_GOGOGOSH_GITHUB:-}"' 2>/dev/null)"
  if [ -n "$loaded_value" ]; then
    export DEEPSEEK_APIKEY_GOGOGOSH_GITHUB="$loaded_value"
    return 0
  fi

  return 1
}

require_deepseek_github_key() {
  load_deepseek_github_key_from_zshrc >/dev/null 2>&1
  if [ -z "${DEEPSEEK_APIKEY_GOGOGOSH_GITHUB:-}" ]; then
    print_error "❌ 缺少环境变量：DEEPSEEK_APIKEY_GOGOGOSH_GITHUB"
    return 1
  fi
}

call_deepseek_text() {
  local system_prompt prompt payload response content

  system_prompt="$1"
  prompt="$2"

  if ! command -v curl >/dev/null 2>&1; then
    return 1
  fi

  if ! command -v jq >/dev/null 2>&1; then
    return 1
  fi

  require_deepseek_github_key || return 1

  payload="$(jq -n \
    --arg system_prompt "$system_prompt" \
    --arg prompt "$prompt" \
    '{
      model: "deepseek-chat",
      temperature: 0.2,
      messages: [
        {role: "system", content: $system_prompt},
        {role: "user", content: $prompt}
      ]
    }')" || return 1

  response="$(curl -fsSL "$DEEPSEEK_GITHUB_ENDPOINT" \
    -H "Authorization: Bearer ${DEEPSEEK_APIKEY_GOGOGOSH_GITHUB}" \
    -H "Content-Type: application/json" \
    -d "$payload")" || return 1

  content="$(printf '%s' "$response" | jq -r '.choices[0].message.content // empty')" || return 1

  if [ -z "$content" ]; then
    return 1
  fi

  printf '%s\n' "$content"
}

build_commit_summary_prompt() {
  local status_block diff_block recent_commit_block extra_guidance branch_name

  status_block="$1"
  diff_block="$2"
  recent_commit_block="$3"
  extra_guidance="$4"
  branch_name="$(get_current_branch)"

  cat <<EOF
你是资深 Git 提交摘要助手。请严格根据以下仓库上下文，输出一版详细、具体、可复核的中文提交摘要。

输出要求：
1. 必须严格使用以下格式。
2. 第一行必须输出 TITLE: ，后跟一行中文标题，尽量控制在 18-32 个汉字内。
3. 第二部分必须输出 BODY: ，后跟 3-8 行中文正文。
4. 正文要尽可能具体，优先说明：主要改动、影响范围、删除/新增/重构重点。
5. 不要编造未发生的修改，不要编造验证结果，不要输出代码块，不要输出额外字段。
6. 若用户给了补充要求，要优先按补充要求调整摘要重点。
7. 如果改动很多，允许归纳，但仍要尽量点出关键方向，而不是只写“整理若干文件改动”。
8. 禁止使用 Markdown 标题、禁止使用 ##、禁止输出项目符号列表外的其他包装。

输出示例：
TITLE: 调整 gogogo 部署与 GitHub 提交流程
BODY:
本次提交主要补齐了 gogogo 的部署入口与 GitHub 提交流程，并补充了相关交互脚本。
同时整理了摘要确认、推送目标和可选 PR 创建逻辑，使本地提交流程更集中一致。
改动还覆盖了相关文档与菜单入口，便于后续继续扩展服务器部署能力。

当前分支：${branch_name}

[recent commits]
${recent_commit_block}

[git status --short]
${status_block}

[changes]
${diff_block}

[extra guidance]
${extra_guidance}
EOF
}

normalize_provider_summary_text() {
  local raw_text title body

  raw_text="$1"
  if printf '%s' "$raw_text" | grep -q '^TITLE:' && printf '%s' "$raw_text" | grep -q '^BODY:'; then
    title="$(printf '%s\n' "$raw_text" | awk 'BEGIN { found = 0 } /^TITLE:[[:space:]]*/ && !found { sub(/^TITLE:[[:space:]]*/, ""); print; found = 1 }')"
    body="$(printf '%s\n' "$raw_text" | awk '
      BEGIN { in_body = 0; count = 0 }
      /^BODY:[[:space:]]*$/ {
        in_body = 1
        next
      }
      /^BODY:[[:space:]]+/ {
        in_body = 1
        sub(/^BODY:[[:space:]]*/, "")
      }
      !in_body {
        next
      }
      NF {
        print
        count++
        if (count >= 8) {
          exit
        }
      }
    ')"

    if [ -n "$title" ] && [ -n "$body" ]; then
      cat <<EOF
TITLE: ${title}
BODY:
${body}
EOF
      return 0
    fi
  fi

  title="$(printf '%s\n' "$raw_text" | awk 'NF { gsub(/^#+[[:space:]]*/, ""); print; exit }')"
  body="$(printf '%s\n' "$raw_text" | awk 'BEGIN { first = 1 } NF { if (first) { first = 0; next } print }')"

  if [ -n "$title" ] && [ -n "$body" ]; then
    cat <<EOF
TITLE: ${title}
BODY:
${body}
EOF
    return 0
  fi

  return 1
}

call_deepseek_for_commit_summary() {
  local status_block diff_block recent_commit_block extra_guidance prompt payload response content

  status_block="$1"
  diff_block="$2"
  recent_commit_block="$3"
  extra_guidance="$4"

  if ! command -v curl >/dev/null 2>&1; then
    return 1
  fi

  if ! command -v jq >/dev/null 2>&1; then
    return 1
  fi

  require_deepseek_github_key || return 1

  prompt="$(build_commit_summary_prompt "$status_block" "$diff_block" "$recent_commit_block" "$extra_guidance")"
  payload="$(jq -n \
    --arg prompt "$prompt" \
    '{
      model: "deepseek-chat",
      temperature: 0.3,
      messages: [
        {role: "system", content: "你是严谨的中文 Git 提交摘要助手。"},
        {role: "user", content: $prompt}
      ]
    }')" || return 1

  response="$(curl -fsSL "$DEEPSEEK_GITHUB_ENDPOINT" \
    -H "Authorization: Bearer ${DEEPSEEK_APIKEY_GOGOGOSH_GITHUB}" \
    -H "Content-Type: application/json" \
    -d "$payload")" || return 1

  content="$(printf '%s' "$response" | jq -r '.choices[0].message.content // empty')" || return 1

  if [ -z "$content" ]; then
    return 1
  fi

  content="$(normalize_provider_summary_text "$content")" || return 1

  if ! printf '%s' "$content" | grep -q '^TITLE:'; then
    return 1
  fi

  printf '%s\n' "$content"
}

call_opencode_for_commit_summary() {
  local status_block diff_block recent_commit_block extra_guidance prompt content

  status_block="$1"
  diff_block="$2"
  recent_commit_block="$3"
  extra_guidance="$4"

  if ! command -v opencode >/dev/null 2>&1; then
    return 1
  fi

  prompt="$(build_commit_summary_prompt "$status_block" "$diff_block" "$recent_commit_block" "$extra_guidance")"
  content="$(opencode run "$prompt" </dev/null)" || return 1

  if [ -z "$content" ]; then
    return 1
  fi

  content="$(normalize_provider_summary_text "$content")" || return 1

  if ! printf '%s' "$content" | grep -q '^TITLE:'; then
    return 1
  fi

  printf '%s\n' "$content"
}

build_local_commit_summary_fallback() {
  local status_block diff_block recent_commit_block extra_guidance changed_files first_file file_count title body line candidate nl

  status_block="$1"
  diff_block="$2"
  recent_commit_block="$3"
  extra_guidance="$4"
  changed_files=""
  nl='\
'

  while IFS= read -r line; do
    case "$line" in
      ""|"[git status --short]"|"[changes]")
        continue
        ;;
    esac

    case "$line" in
      '?? '*)
        candidate="${line#?? }"
        ;;
      [[:space:]][[:space:]]*)
        continue
        ;;
      ??' '*)
        candidate="${line#?? }"
        ;;
      *)
        continue
        ;;
    esac

    case "$candidate" in
      *' -> '*)
        candidate="${candidate##* -> }"
        ;;
    esac

    if [ "$candidate" = "$line" ] || [ -z "$candidate" ]; then
      continue
    fi

    case "${nl}${changed_files}${nl}" in
      *"${nl}${candidate}${nl}"*)
        ;;
      *)
        if [ -n "$changed_files" ]; then
          changed_files="${changed_files}
${candidate}"
        else
          changed_files="$candidate"
        fi
        ;;
    esac
  done <<EOF
$status_block
EOF

  first_file="$(printf '%s\n' "$changed_files" | awk 'NF { print; exit }')"
  file_count="$(printf '%s\n' "$changed_files" | awk 'NF { count++ } END { print count + 0 }')"

  if [ -z "$first_file" ]; then
    title="整理提交内容摘要"
    body="基于当前工作区状态生成中文提交说明。
改动范围信息有限，建议提交前再人工确认。"
  elif [ "$file_count" -eq 1 ]; then
    title="更新 ${first_file}"
    body="基于当前工作区改动生成中文提交说明。
本次主要涉及 ${first_file} 的调整。"
  else
    title="整理 ${file_count} 个文件改动"
    body="基于当前工作区改动生成中文提交说明。
本次涉及 ${first_file} 等 ${file_count} 个文件的调整。"
  fi

  if [ -n "$extra_guidance" ]; then
    body="${body}
补充要求：${extra_guidance}"
  fi

  if [ -n "$recent_commit_block" ]; then
    body="${body}
最近提交风格参考：$(printf '%s\n' "$recent_commit_block" | awk 'NF { print; exit }')"
  fi

  cat <<EOF
TITLE: ${title}
BODY:
${body}
EOF
}

generate_commit_summary_text() {
  local provider status_block diff_block recent_commit_block extra_guidance ai_result

  provider="$1"
  status_block="$2"
  diff_block="$3"
  recent_commit_block="$4"
  extra_guidance="$5"

  case "$provider" in
    "$SUMMARY_PROVIDER_OPENCODE")
      call_opencode_for_commit_summary "$status_block" "$diff_block" "$recent_commit_block" "$extra_guidance"
      ;;
    "$SUMMARY_PROVIDER_DEEPSEEK")
      ai_result="$(call_deepseek_for_commit_summary "$status_block" "$diff_block" "$recent_commit_block" "$extra_guidance" 2>/dev/null)"
      if [ -n "$ai_result" ]; then
        printf '%s\n' "$ai_result"
        return 0
      fi

      printf '%s\n' 'DeepSeek 失败，已回退本地摘要。' >&2
      build_local_commit_summary_fallback "$status_block" "$diff_block" "$recent_commit_block" "$extra_guidance"
      ;;
    "$SUMMARY_PROVIDER_CLAUDE")
      printf '%s\n' 'Claude provider 尚未实现，当前为预留接口。' >&2
      return 2
      ;;
    *)
      printf 'Unsupported summary provider: %s\n' "$provider" >&2
      return 1
      ;;
  esac
}

extract_commit_title() {
  printf '%s\n' "$1" | awk 'BEGIN { title = "" } /^TITLE:[[:space:]]*/ { sub(/^TITLE:[[:space:]]*/, ""); title = $0 } END { print title }'
}

extract_commit_body() {
  printf '%s\n' "$1" | awk '
    /^BODY:[[:space:]]*$/ { in_body = 1; next }
    /^BODY:[[:space:]]+/ {
      sub(/^BODY:[[:space:]]*/, "")
      print
      in_body = 1
      next
    }
    in_body { print }
  '
}
