# 规范索引

## 当前项目附加规则

1. 全程使用中文沟通交流
2. 项目 specs 默认使用中文编写

## 当前并行规范来源

以下文件在当前仓库中表达的是同一组高优先级项目约束，应尽量保持认知一致：

- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/project.mdc`

如果三者与当前代码现实冲突，应优先以当前代码和已确认的现行规则为准，再回写到 `.ai`。

## 当前高优先级约束

### 后端

- JSON 相关操作必须使用 `common/json.go`
- 数据库方向统一收敛为 PostgreSQL-only
- relay 请求中可选标量字段应使用指针保留显式零值
- 新增 channel 时要确认 `StreamOptions` 支持情况
- `constant` 包只放全局常量，不承载业务逻辑

### 前端

- Bun 是前端首选包管理器与脚本执行器
- 当前项目真实使用 Semi Design UI
- 前端 i18n 使用 `i18next`
- 前端翻译 key 使用中文源字符串

### 项目保护

- `new-api` 与 `QuantumNous` 标识不可擅自移除或替换
- 允许在本地记忆体系中记录 `AiLinkDog` 作为长期维护计划名称，但不得借此删除或覆盖上游来源与版权信息

### 质量与流程

- 声称完成前必须先验证
- 不得无依据地说“已通过”
- 优先小改动、边界清晰的改动
- specs 默认中文，便于项目维护
- 安全漏洞不得在公开 issue 中披露，应遵守安全披露流程
- PR / Issue 描述应由提交者人工整理，不应直接粘贴未经处理的 AI 输出
- 提交前应查重、聚焦范围，并提供本地验证证据
- 初始化向导不再作为当前项目主路径保留
- Docker 不再作为当前项目主入口或推荐方案

### 长期维护

- 当前仓库从 2026-04-19 起记录为 `AiLinkDog` 长期维护计划的起点
- 需要持续跟踪上游 `new-api` 版本、修复与新功能
- 后续是否合并、同步或手工移植，应按具体变更价值决策

## 去哪里看详细规则

- 架构与层次：`../L3#Standards/standards/01.arch-*.md`
- 后端规范：`../L3#Standards/standards/02.backend-*.md`
- 前端规范：`../L3#Standards/standards/03.frontend-*.md`
- 质量规范：`../L3#Standards/standards/04.quality-*.md`
- 工具规范：`../L3#Standards/standards/09.tool-*.md`
- AI 记忆规范：`../L3#Standards/standards/10.ai-memory-*.md`
