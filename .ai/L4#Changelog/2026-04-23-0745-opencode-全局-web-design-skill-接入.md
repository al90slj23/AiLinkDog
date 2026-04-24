# L4 工作日志

## 2026-04-23-0745 OpenCode 全局 `web-design-engineer` skill 接入

## 本次工作总结

- 本次工作目标是将 `https://github.com/al90slj23/web-design-skill` 接入当前本地 OpenCode 环境，作为可被平台发现的全局 skill 使用。
- 经检查，源仓库已经包含标准 skill 目录结构：`.claude/skills/web-design-engineer/` 与 `.agents/skills/web-design-engineer/`，因此未对 skill 内容做二次改写，而是直接采用其现成的 `SKILL.md` 与 `references/advanced-patterns.md`。
- 本次接入采用“全局单点安装 + OpenCode 配置引入”的最小方案：
  - 将 skill 文件安装到 `~/.claude/skills/web-design-engineer/`
  - 在 `~/.opencode/opencode.json` 中补齐 `skills.paths = ["/Users/al90slj23/.claude/skills"]`
- 这样处理的边界是：不把第三方 skill 仓库整体复制到项目仓库内，不在项目内维护重复副本，也不额外引入项目级 symlink 管理；当前目标仅是让本机 OpenCode 能稳定识别该 skill。
- 本次还做了运行态验证：通过 `opencode debug skill` 确认 `web-design-engineer` 已被 OpenCode 识别，且其 `location` 指向 `~/.claude/skills/web-design-engineer/SKILL.md`。

### 关键判断

- 这次变化属于平台接入方式变化，而不是业务实现代码变化。
- 当前仓库内已有一套面向 OpenCode skill 管理的项目规范与脚本思路，但本次用户需求是“把这个 skill 安排到 opencode 的全局 skill 中”，因此优先满足全局安装目标，而不是改造成项目级 skill。
- 由于源 skill 已具备完整结构，本次不对 skill 内容做本地裁剪与重写，避免引入额外维护成本。

### 最终结果

- `web-design-engineer` 已进入本机 OpenCode 可见 skill 列表。
- 本次未修改项目业务代码、未修改仓库内 `.opencode/opencode.json`，仅完成本机 OpenCode 全局 skill 接入与验证。
- 本次额外在仓库 `.ai/L0#Execution/workflows/` 下补了一份执行说明，用于记录这种“本机全局 skill 安装 + OpenCode `skills.paths` 引入”的操作路径。

### 未做事项

- 未将该第三方 skill 转存到仓库内 `.ai/L0#Execution/skills/` 体系。
- 未改写现有 `L3` 正式规范。
- 未对第三方 skill 做版本锁定、自动更新或脚本化同步。

### 验证情况

- `git ls-remote --heads --tags https://github.com/al90slj23/web-design-skill.git`
- `ls -la ~/.claude/skills/web-design-engineer`
- `opencode debug skill`

### 来源

- 本条记录基于本次 OpenCode 全局 skill 安装、配置补齐与运行校验过程手工整理。
