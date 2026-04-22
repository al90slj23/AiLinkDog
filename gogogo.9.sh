#!/bin/bash

if [ -z "${SCRIPT_DIR:-}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

if ! command -v print_info >/dev/null 2>&1; then
  if [ -f "$SCRIPT_DIR/gogogo.lib.sh" ]; then
    # 独立执行时也要复用主脚本里的输出与工具函数。
    # shellcheck disable=SC1091
    source "$SCRIPT_DIR/gogogo.lib.sh"
  fi
fi

PROJECT_ROOT="${SCRIPT_DIR}"

PLATFORMS=("opencode")

L1_SOURCE_FILE=".ai/L1#Overview/guide.md"
L0_SKILLS_DIR=".ai/L0#Execution/skills"
L0_GLOBAL_SKILLS_DIR="${L0_SKILLS_DIR}/global"
L0_PROJECT_SKILLS_DIR="${L0_SKILLS_DIR}/project"
OPENCODE_PROJECT_CONFIG_DIR=".opencode"
OPENCODE_PROJECT_SKILLS_DIR="${OPENCODE_PROJECT_CONFIG_DIR}/skills/project"

path_starts_with() {
  case "$1" in
    "$2"|"$2"/*) return 0 ;;
    *) return 1 ;;
  esac
}

get_platform_name() {
  case "$1" in
    "opencode") printf 'OpenCode' ;;
    *) printf '' ;;
  esac
}

show_header() {
  printf '%b\n' "${BLUE}================================${NC}"
  printf '%b\n' "${BLUE}  AI 开发平台切换与 Symlink 管理${NC}"
  printf '%b\n' "${BLUE}================================${NC}"
  printf '\n'
}

ensure_skill_source_dirs() {
  mkdir -p "$PROJECT_ROOT/$L0_GLOBAL_SKILLS_DIR"
  mkdir -p "$PROJECT_ROOT/$L0_PROJECT_SKILLS_DIR"
}

list_skill_dirs() {
  local base_dir="$1"
  [ -d "$base_dir" ] || return 0

  for path in "$base_dir"/*; do
    [ -d "$path" ] || continue
    [ -f "$path/SKILL.md" ] || continue
    printf '%s\n' "$path"
  done
}

get_opencode_global_skill_paths() {
  local config_path

  config_path="${HOME}/.config/opencode/opencode.json"
  [ -f "$config_path" ] || return 0
  command -v jq >/dev/null 2>&1 || return 0

  jq -r '.skills.paths[]? // empty' "$config_path" 2>/dev/null | while IFS= read -r raw_path; do
    [ -z "$raw_path" ] && continue
    case "$raw_path" in
      ~/*)
        printf '%s/%s\n' "$HOME" "${raw_path#~/}"
        ;;
      /*)
        printf '%s\n' "$raw_path"
        ;;
      *)
        printf '%s/%s\n' "$PROJECT_ROOT" "$raw_path"
        ;;
    esac
  done
}

get_primary_opencode_global_skill_path() {
  local path

  while IFS= read -r path; do
    [ -n "$path" ] || continue
    if path_starts_with "$path" "$PROJECT_ROOT/$OPENCODE_PROJECT_CONFIG_DIR"; then
      continue
    fi
    printf '%s\n' "$path"
    return 0
  done <<EOF
$(get_opencode_global_skill_paths)
EOF

  return 1
}

list_global_skill_names() {
  local skill_dir

  while IFS= read -r skill_dir; do
    [ -n "$skill_dir" ] || continue
    basename "$skill_dir"
  done <<EOF
$(list_skill_dirs "$PROJECT_ROOT/$L0_GLOBAL_SKILLS_DIR")
EOF
}

list_project_skill_names() {
  local skill_dir

  while IFS= read -r skill_dir; do
    [ -n "$skill_dir" ] || continue
    basename "$skill_dir"
  done <<EOF
$(list_skill_dirs "$PROJECT_ROOT/$L0_PROJECT_SKILLS_DIR")
EOF
}

ensure_project_opencode_config() {
  local config_dir config_file project_skill_abs escaped_project_skill_abs

  config_dir="$PROJECT_ROOT/$OPENCODE_PROJECT_CONFIG_DIR"
  config_file="$config_dir/opencode.json"
  project_skill_abs="$PROJECT_ROOT/$OPENCODE_PROJECT_SKILLS_DIR"

  mkdir -p "$config_dir"

  if [ -f "$config_file" ]; then
    if command -v jq >/dev/null 2>&1; then
      if jq -e --arg path "$project_skill_abs" '.skills.paths? // [] | index($path)' "$config_file" >/dev/null 2>&1; then
        return 0
      fi

      jq --arg path "$project_skill_abs" '
        .skills = (.skills // {})
        | .skills.paths = ((.skills.paths // []) + [$path] | unique)
      ' "$config_file" >"$config_file.tmp" && mv "$config_file.tmp" "$config_file"
      return $?
    fi

    if grep -Fq "$project_skill_abs" "$config_file" 2>/dev/null; then
      return 0
    fi
  fi

  escaped_project_skill_abs=$(printf '%s' "$project_skill_abs" | sed 's/\\/\\\\/g; s/"/\\"/g')
  cat >"$config_file" <<EOF
{
  "\$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": [
      "${escaped_project_skill_abs}"
    ]
  }
}
EOF
}

resolve_target_reference() {
  local target="$1"
  local reference="$2"

  (
    cd "$PROJECT_ROOT" || exit 1
    cd "$(dirname "$target")" 2>/dev/null || exit 1
    cd "$(dirname "$reference")" 2>/dev/null || exit 1
    printf '%s/%s\n' "$(pwd -P)" "$(basename "$reference")"
  )
}

inspect_single_target() {
  local source="$1"
  local target="$2"
  local description="$3"

  if [ -L "$target" ]; then
    local current_target resolved_source resolved_current_target
    current_target="$(readlink "$target")"
    resolved_source="$(resolve_target_reference "$target" "$source")"
    resolved_current_target="$(resolve_target_reference "$target" "$current_target")"
    if [ "$current_target" = "$source" ] || { [ -n "$resolved_source" ] && [ "$resolved_current_target" = "$resolved_source" ]; }; then
      printf '   ✅ 已存在且正确：%s\n' "$description"
      return 0
    fi

    printf '   ❌ 已存在但指向错误：%s\n' "$description"
    printf '      当前 -> %s\n' "$current_target"
    printf '      期望 -> %s\n' "$source"
    return 2
  fi

  if [ -e "$target" ]; then
    printf '   ❌ 已存在但指向错误：%s\n' "$description"
    printf '      当前 -> 实际文件\n'
    printf '      期望 -> %s\n' "$source"
    return 2
  fi

  printf '   ⚠️ 缺失：%s\n' "$description"
  return 1
}

create_single_symlink() {
  local source="$1"
  local target="$2"
  local description="$3"
  local mode="${4:-force}"

  if [ ! -e "$source" ]; then
    printf '   ⚠️ 跳过：源不存在 - %s\n' "$description"
    return 1
  fi

  if [ -L "$target" ]; then
    local current_target resolved_source resolved_current_target
    current_target="$(readlink "$target")"
    resolved_source="$(resolve_target_reference "$target" "$source")"
    resolved_current_target="$(resolve_target_reference "$target" "$current_target")"
    if [ "$current_target" = "$source" ] || { [ -n "$resolved_source" ] && [ "$resolved_current_target" = "$resolved_source" ]; }; then
      if [ "$mode" = "fill-missing" ]; then
        printf '   ⏭️ 跳过已正确：%s\n' "$description"
        return 0
      fi
    elif [ "$mode" = "fill-missing" ]; then
      printf '   ⚠️ 保留错误目标：%s\n' "$description"
      return 1
    fi

    rm -f "$target"
    printf '   🗑️ 删除旧文件：%s\n' "$description"
  elif [ -e "$target" ]; then
    if [ "$mode" = "fill-missing" ]; then
      printf '   ⚠️ 保留实际文件：%s\n' "$description"
      return 1
    fi

    if [ -d "$target" ]; then
      printf '   ❌ 创建失败：目标是目录，无法覆盖 - %s\n' "$description"
      return 1
    fi

    rm -f "$target"
    printf '   🗑️ 删除旧文件：%s\n' "$description"
  elif [ "$mode" = "fill-missing" ]; then
    printf '   ➕ 补齐缺失：%s\n' "$description"
  fi

  mkdir -p "$(dirname "$target")"
  ln -s "$source" "$target"
  if [ $? -eq 0 ]; then
    printf '   ✅ 创建成功：%s\n' "$description"
    return 0
  fi

  printf '   ❌ 创建失败：%s\n' "$description"
  return 1
}

get_platform_targets() {
  local platform="$1"
  local global_root skill_dir skill_name primary_global_path

  case "$platform" in
    "opencode")
      printf '%s|%s|%s\n' "$L1_SOURCE_FILE" "AGENTS.md" "L1#Overview → AGENTS.md"

      primary_global_path="$(get_primary_opencode_global_skill_path)"
      if [ -n "$primary_global_path" ]; then
        while IFS= read -r skill_dir; do
          [ -n "$skill_dir" ] || continue
          skill_name="$(basename "$skill_dir")"
          printf '%s|%s|%s\n' "$skill_dir" "$primary_global_path/$skill_name" "Global Skill: $skill_name"
        done <<EOF
$(list_skill_dirs "$PROJECT_ROOT/$L0_GLOBAL_SKILLS_DIR")
EOF
      fi

      while IFS= read -r skill_dir; do
        [ -n "$skill_dir" ] || continue
        skill_name="$(basename "$skill_dir")"
        printf '%s|%s|%s\n' "$skill_dir" "$PROJECT_ROOT/$OPENCODE_PROJECT_SKILLS_DIR/$skill_name" "Project Skill: $skill_name"
      done <<EOF
$(list_skill_dirs "$PROJECT_ROOT/$L0_PROJECT_SKILLS_DIR")
EOF
      ;;
  esac
}

show_platform_target_status() {
  local platform="$1"
  local platform_name source target description
  platform_name="$(get_platform_name "$platform")"

  printf '%b\n' "${BLUE}📊 ${platform_name} 当前目标状态：${NC}"
  if [ "$platform" = "opencode" ]; then
    printf '   [Root Context]\n'
    while IFS='|' read -r source target description; do
      [ -z "$target" ] && continue
      case "$description" in
        L1#Overview*)
          inspect_single_target "$source" "$target" "$description"
          ;;
      esac
    done < <(get_platform_targets "$platform")

    printf '   [Global Skills]\n'
    while IFS='|' read -r source target description; do
      [ -z "$target" ] && continue
      case "$description" in
        Global\ Skill:*)
          inspect_single_target "$source" "$target" "$description"
          ;;
      esac
    done < <(get_platform_targets "$platform")

    if [ -z "$(get_primary_opencode_global_skill_path 2>/dev/null || true)" ] && [ -n "$(list_global_skill_names)" ]; then
      printf '   ⚠️ 未检测到可用的 OpenCode 全局 skill 路径，global skills 当前仅保留项目源文件\n'
    fi

    printf '   [Project Skills]\n'
    while IFS='|' read -r source target description; do
      [ -z "$target" ] && continue
      case "$description" in
        Project\ Skill:*)
          inspect_single_target "$source" "$target" "$description"
          ;;
      esac
    done < <(get_platform_targets "$platform")
  else
    while IFS='|' read -r source target description; do
      [ -z "$target" ] && continue
      inspect_single_target "$source" "$target" "$description"
    done < <(get_platform_targets "$platform")
  fi
  printf '\n'
}

show_opencode_skill_discovery_status() {
  local discovered_text skill_dir skill_name found_any=0

  if ! command -v opencode >/dev/null 2>&1; then
    printf '   ⚠️ 未安装 opencode，无法校验技能识别状态\n'
    return 1
  fi

  discovered_text="$(opencode debug skill 2>/dev/null || true)"
  if [ -z "$discovered_text" ]; then
    printf '   ⚠️ 无法读取 opencode debug skill 输出\n'
    return 1
  fi

  for skill_dir in "$PROJECT_ROOT/$L0_GLOBAL_SKILLS_DIR"/* "$PROJECT_ROOT/$L0_PROJECT_SKILLS_DIR"/*; do
    [ -d "$skill_dir" ] || continue
    [ -f "$skill_dir/SKILL.md" ] || continue
    skill_name="$(basename "$skill_dir")"
    found_any=1
    if printf '%s\n' "$discovered_text" | grep -Fq '"name": "'"$skill_name"'"'; then
      printf '   ✅ OpenCode 已识别 skill：%s\n' "$skill_name"
    else
      printf '   ⚠️ OpenCode 未识别 skill：%s\n' "$skill_name"
    fi
  done

  if [ "$found_any" -eq 0 ]; then
    printf '   ℹ️ 当前没有可校验的项目 skill\n'
  fi
}

check_source_files() {
  local missing_files=()

  if [ ! -f "$PROJECT_ROOT/$L1_SOURCE_FILE" ]; then
    missing_files+=("$L1_SOURCE_FILE")
  fi

  if [ ! -d "$PROJECT_ROOT/$L0_SKILLS_DIR" ]; then
    missing_files+=("$L0_SKILLS_DIR (目录)")
  fi

  if [ ${#missing_files[@]} -gt 0 ]; then
    printf '%b\n' "${RED}❌ 错误：以下源文件不存在${NC}"
    for file in "${missing_files[@]}"; do
      printf '   - %s\n' "$file"
    done
    return 1
  fi

  printf '%b\n' "${GREEN}✅ 所有源文件检查通过${NC}"
}

setup_platform() {
  local platform="$1"
  local mode="${2:-force}"
  local platform_name has_error=0

  platform_name="$(get_platform_name "$platform")"
  if [ -z "$platform_name" ]; then
    print_error "❌ 未知平台: $platform"
    return 1
  fi

  ensure_skill_source_dirs

  if [ "$platform" = "opencode" ]; then
    ensure_project_opencode_config || return 1
  fi

  if [ "$mode" = "force" ]; then
    print_info "📌 强制重新 symlink：${platform_name}"
  else
    print_info "📌 补齐缺失 symlink：${platform_name}"
  fi
  printf '\n'

  while IFS='|' read -r source target description; do
    [ -z "$target" ] && continue
    if ! create_single_symlink "$source" "$target" "$description" "$mode"; then
      has_error=1
    fi
  done < <(get_platform_targets "$platform")

  printf '\n'
  if [ "$platform" = "opencode" ]; then
    printf '%b\n' "${BLUE}🔎 OpenCode skill 识别状态：${NC}"
    show_opencode_skill_discovery_status || true
    printf '\n'
  fi

  if [ $has_error -eq 0 ]; then
    print_success "✅ ${platform_name} 平台处理完成"
    return 0
  fi

  print_warn "⚠️ ${platform_name} 平台处理完成，但存在未完成项目"
  return 1
}

show_status() {
  local platform

  printf '%b\n' "${BLUE}📊 当前 Symlink 状态：${NC}"
  printf '\n'
  for platform in "${PLATFORMS[@]}"; do
    show_platform_target_status "$platform"
    if [ "$platform" = "opencode" ]; then
      printf '%b\n' "${BLUE}🔎 OpenCode skill 识别状态：${NC}"
      show_opencode_skill_discovery_status || true
      printf '\n'
    fi
  done
}

handle_platform_action() {
  local platform="$1"
  local platform_choice

  while true; do
    printf '\n'
    show_platform_target_status "$platform"
    if [ "$platform" = "opencode" ]; then
      printf '%b\n' "${BLUE}🔎 OpenCode skill 识别状态：${NC}"
      show_opencode_skill_discovery_status || true
      printf '\n'
    fi
    printf '%b\n' "${YELLOW}请选择后续操作：${NC}"
    echo "1. 强制重新 symlink"
    echo "2. 补齐当前平台还没有 symlink 的"
    echo "3. 返回上一步"
    echo ""
    if ! read -r -p "请输入选择: " platform_choice; then
      print_error "❌ 未检测到可用输入，无法继续平台子菜单"
      return 1
    fi

    case "$platform_choice" in
      1)
        setup_platform "$platform" "force"
        return $?
        ;;
      2)
        setup_platform "$platform" "fill-missing"
        return $?
        ;;
      3)
        return 10
        ;;
      *)
        print_error "❌ 无效选择"
        ;;
    esac
  done
}

main() {
  local action action_from_cli=0 choice cli_mode

  show_header
  ensure_skill_source_dirs

  if ! check_source_files; then
    exit 1
  fi

  printf '\n'

  action="$1"
  cli_mode="$2"
  if [ "$action" = "9" ]; then
    action="$2"
    cli_mode="$3"
  fi

  if [ -n "$action" ]; then
    action_from_cli=1
  fi

  while true; do
    if [ -z "$action" ]; then
      printf '%b\n' "${YELLOW}请选择操作：${NC}"
      echo "1. 切换或重建平台：OpenCode"
      echo "8. 显示当前状态"
      echo "0. 退出"
      echo ""
      if ! read -r -p "请输入选择: " choice; then
        print_error "❌ 未检测到可用输入，无法继续主菜单"
        return 1
      fi

      case "$choice" in
        1) action="opencode" ;;
        8) action="status" ;;
        0) return 0 ;;
        *)
          print_error "❌ 无效选择"
          printf '\n'
          continue
          ;;
      esac
    fi

    printf '\n'

    case "$action" in
      "opencode")
        if [ -n "$cli_mode" ]; then
          case "$cli_mode" in
            force|fill-missing)
              setup_platform "$action" "$cli_mode"
              return $?
              ;;
          esac
        fi
        handle_platform_action "$action"
        case $? in
          0)
            return 0
            ;;
          10)
            if [ $action_from_cli -eq 1 ]; then
              return 0
            fi
            action=""
            printf '\n'
            ;;
          *)
            return 1
            ;;
        esac
        ;;
      "status")
        show_status
        return 0
        ;;
      *)
        print_error "❌ 未知操作: $action"
        print_warn "💡 可用操作: opencode, status"
        return 1
        ;;
    esac
  done
}

main "$@"
