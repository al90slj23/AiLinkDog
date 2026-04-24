# OpenCode 全局 Skill 接入说明

## 适用场景

- 用户明确要求把某个第三方 skill 安装到本机 OpenCode 的全局 skill 中
- 目标是让当前机器上的 OpenCode 能直接发现该 skill
- 不要求把该 skill 纳入当前仓库的项目级 `skills/` 维护体系

## 推荐路径

优先采用“全局单点安装 + OpenCode 配置引入”的最小方案：

1. 确认源 skill 仓库是否已经提供标准目录结构，例如：
   - `.claude/skills/<skill-name>/SKILL.md`
   - `.agents/skills/<skill-name>/SKILL.md`
2. 将所需 skill 安装到本机全局目录：`~/.claude/skills/<skill-name>/`
3. 在 `~/.opencode/opencode.json` 中补齐：

```json
{
  "skills": {
    "paths": [
      "/Users/al90slj23/.claude/skills"
    ]
  }
}
```

4. 使用 `opencode debug skill` 验证 skill 已被平台识别

## 使用边界

- 该路径面向“本机全局 skill 安装”，不是项目级 skill 分发方案
- 不要求把第三方 skill 仓库整体复制进当前项目
- 不要求改写第三方 skill 内容，除非用户明确要求本地定制
- 如果目标是团队协作、项目内复用、统一版本控制，应优先回到 `.ai/L0#Execution/skills/` 与既有 OpenCode skill 管理规则中处理

## 验证命令

```bash
opencode debug skill
```

重点确认：

- skill 名称已出现在列表中
- `location` 指向预期的全局路径

## 与项目内 skill 管理规则的关系

- 本说明只补充“本机全局安装”这一路径
- 如果需求转为项目内长期维护，仍应遵守当前仓库既有的 skill 分层与接入规则
