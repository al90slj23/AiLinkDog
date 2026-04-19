# 补充知识来源

以下文档虽然不是项目的第一层核心规范来源，但值得纳入长期知识库视野，因为它们补充了当前仓库的一些重要边界信息。

## `.cursor/rules/project.mdc`

价值：

- 说明当前仓库除了 `AGENTS.md`、`CLAUDE.md` 之外，还有 Cursor 平台规则文件
- 可用于判断多平台规则是否一致

当前结论：

- 内容与 `AGENTS.md` / `CLAUDE.md` 基本同源
- 更适合作为“规则分发目标”，而不是独立知识源

## `constant/README.md`

价值：

- 明确 `constant` 包的职责边界
- 强调常量层禁止承载业务逻辑

适合归档到：

- L2 结构索引
- L3 后端规范

## `docs/channel/other_setting.md`

价值：

- 解释渠道额外设置项 `force_format`、`proxy`、`thinking_to_content`
- 补充 relay / channel 语义

适合归档到：

- L3 relay / channel 规范

## `.github/SECURITY.md`

价值：

- 定义安全漏洞披露流程
- 区分普通 issue 与安全通道

适合归档到：

- L2 规范索引
- L3 Git / 流程规范

## `docs/installation/BT.md`

价值：

- 提供宝塔面板部署方式
- 补充部署时环境变量与容器配置要求

当前处理建议：

- 适合作为后续部署知识扩展来源
- 当前首版 `.ai` 只需记录其存在，不必把整篇部署教程搬进主规范正文

## `README.zh_CN.md`

价值：

- 提供当前项目最完整的中文对外产品叙述
- 补充核心能力、接口支持、部署方式和产品表达

适合归档到：

- L2 产品索引
- L1 项目概览的补充来源

## `electron/README.md`

价值：

- 说明仓库还包含 Electron 桌面封装层
- 补充桌面端数据路径与构建方式认知

适合归档到：

- L2 结构索引
- L5 系统关系补充

## `docs/ionet-client.md`

当前结论：

- 内容过短，更像临时记录而不是稳定知识源
- 当前不值得单独提升为长期规范，但可作为未来清理或归档候选

## `docs/translation-glossary.md`

价值：

- 提供项目术语的中英对照和翻译一致性基线
- 对前端 i18n、多语言文案和术语统一有直接帮助

适合归档到：

- L3 前端 i18n 规范
- L5 术语知识补充

## `.github/PULL_REQUEST_TEMPLATE.md` 与 `ISSUE_TEMPLATE/*`

价值：

- 反映当前仓库对协作质量、描述质量和本地验证的真实要求
- 明确区分 bug、feature、重复提交和低质量模板填写

适合归档到：

- L3 质量规范
- L2 规范索引
