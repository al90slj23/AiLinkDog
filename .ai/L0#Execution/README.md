# L0#Execution

`L0#Execution` 是执行层，用于存放动态执行工件，而不是项目事实本体。

## 本层职责

- 存放后续协作中的 `specs/`
- 存放执行计划 `plans/`
- 存放 `skills/`、`hooks/`、`templates/`、`workflows/` 等执行相关目录
- 为后续自动化或规范落地提供结构化落点

## 本层不负责

- 不保存项目长期规范正文
- 不保存项目首读概览
- 不替代项目代码与现有根级规范文件

## 当前目录说明

- `specs/`：项目内 specs 的长期存放目录
- `plans/`：项目内执行计划目录
- `hooks/`：预留给本地或 IDE 侧自动化钩子
- `skills/`：项目内 skill 源文件目录，按 `global/` 与 `project/` 分层
- `templates/`：预留给模板
- `workflows/`：预留给执行流程说明

## 使用原则

- 动态执行内容进 L0
- 稳定知识内容进 L1/L2/L3
- 决策历史进 L4
- 概念关系进 L5
- `skills/` 是项目内 skill 源文件目录，当前按 `global/` 与 `project/` 分层
- `gogogo` 的 memory 主流程当前以“终端预览 -> 保存 -> 结束”为主路径，不再默认在保存后自动打开总结报告和纯化目标文件
