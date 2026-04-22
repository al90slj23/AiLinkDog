# 最近修复总结

> 说明：本文件是历史遗留的阶段性修复与调试总结文件。
> 当前 `gogogo.sh 7` 产生的持续追加型工作日志主路径已迁移到 `L4#Changelog/`，本文件不再作为该流程的主入口。

## 2026-04-20-0155 工作总结

## 本次工作总结
基于最近工作总结和当前改动，本次工作确立了 **AiLinkDog 本地长期维护路线**，核心变更包括：
1. **项目方向调整**：明确 PostgreSQL-only 数据库方向，移除 SQLite/MySQL 作为未来目标
2. **功能清理**：移除初始化向导和 Docker 主路径，删除多语言 README
3. **规范更新**：新增中文协作规范、错误排查规则（对比上游）
4. **代码调整**：数据库代码收敛、前端组件重构、Claude 文件处理增强
5. **工具新增**：引入 gogogo.*.sh 脚本体系

### 来源

- 本条由 `gogogo.sh 7` 更新。


## 2026-04-20-0053 工作总结

### 涉及范围

- 文档 / 规范 / 知识库
- 后端 / API / 数据模型 / relay
- 前端 / UI / 交互
- 本地开发脚本 / 工具链

### 变更文件

- .gitignore
- AGENTS.md
- CLAUDE.md
- README.fr.md
- README.ja.md
- README.md
- README.zh_CN.md
- README.zh_TW.md
- common/database.go
- common/init.go
- controller/setup.go
- dto/openai_request.go
- model/main.go
- relay/channel/claude/relay-claude.go
- relay/channel/claude/relay_claude_test.go
- relay/common/stream_status.go
- relay/helper/stream_scanner.go
- relay/helper/stream_scanner_test.go
- router/api-router.go
- types/file_source.go
- web/bun.lock
- web/package.json
- web/public/favicon.ico
- web/public/logo.png
- web/src/App.jsx
- web/src/components/common/ui/CardPro.jsx
- web/src/components/layout/SetupCheck.js
- web/src/components/layout/SiderBar.jsx
- web/src/components/layout/headerbar/LanguageSelector.jsx
- web/src/components/layout/headerbar/NewYearButton.jsx
- web/src/components/layout/headerbar/ThemeToggle.jsx
- web/src/components/layout/headerbar/UserArea.jsx
- web/src/components/playground/ChatArea.jsx
- web/src/components/playground/MessageActions.jsx
- web/src/components/setup/SetupWizard.jsx
- web/src/components/setup/components/StepNavigation.jsx
- web/src/components/setup/components/steps/AdminStep.jsx
- web/src/components/setup/components/steps/CompleteStep.jsx
- web/src/components/setup/components/steps/DatabaseStep.jsx
- web/src/components/setup/components/steps/UsageModeStep.jsx
- web/src/components/setup/index.jsx
- web/src/constants/dashboard.constants.js
- web/src/hooks/playground/useDataLoader.js
- web/src/index.jsx
- web/src/pages/Setup/index.jsx
- .ai/
- docs/superpowers/
- gogogo.1.sh
- gogogo.2.sh
- gogogo.3.sh
- gogogo.4.sh
- gogogo.5.sh
- gogogo.6.sh
- gogogo.7.sh
- gogogo.ai.sh
- gogogo.git.sh
- gogogo.lib.sh
- gogogo.memory.sh
- gogogo.sh
- hello
- tests/
- web/.prettierignore
- web/dist/
- web/src/components/common/menu/
- web/vite.config.js.timestamp-1776585888682-3610427c96bb1.mjs

### 来源

- 本条由 `gogogo.sh 7` 更新。


## 2026-04-20-0047 工作总结

### 涉及范围

- 文档 / 规范 / 知识库
- 后端 / API / 数据模型 / relay
- 前端 / UI / 交互
- 本地开发脚本 / 工具链

### 变更文件

- .gitignore
- AGENTS.md
- CLAUDE.md
- README.fr.md
- README.ja.md
- README.md
- README.zh_CN.md
- README.zh_TW.md
- common/database.go
- common/init.go
- controller/setup.go
- dto/openai_request.go
- model/main.go
- relay/channel/claude/relay-claude.go
- relay/channel/claude/relay_claude_test.go
- relay/common/stream_status.go
- relay/helper/stream_scanner.go
- relay/helper/stream_scanner_test.go
- router/api-router.go
- types/file_source.go
- web/bun.lock
- web/package.json
- web/public/favicon.ico
- web/public/logo.png
- web/src/App.jsx
- web/src/components/common/ui/CardPro.jsx
- web/src/components/layout/SetupCheck.js
- web/src/components/layout/SiderBar.jsx
- web/src/components/layout/headerbar/LanguageSelector.jsx
- web/src/components/layout/headerbar/NewYearButton.jsx
- web/src/components/layout/headerbar/ThemeToggle.jsx
- web/src/components/layout/headerbar/UserArea.jsx
- web/src/components/playground/ChatArea.jsx
- web/src/components/playground/MessageActions.jsx
- web/src/components/setup/SetupWizard.jsx
- web/src/components/setup/components/StepNavigation.jsx
- web/src/components/setup/components/steps/AdminStep.jsx
- web/src/components/setup/components/steps/CompleteStep.jsx
- web/src/components/setup/components/steps/DatabaseStep.jsx
- web/src/components/setup/components/steps/UsageModeStep.jsx
- web/src/components/setup/index.jsx
- web/src/constants/dashboard.constants.js
- web/src/hooks/playground/useDataLoader.js
- web/src/index.jsx
- web/src/pages/Setup/index.jsx
- .ai/
- docs/superpowers/
- gogogo.1.sh
- gogogo.2.sh
- gogogo.3.sh
- gogogo.4.sh
- gogogo.5.sh
- gogogo.6.sh
- gogogo.7.sh
- gogogo.ai.sh
- gogogo.git.sh
- gogogo.lib.sh
- gogogo.memory.sh
- gogogo.sh
- hello
- tests/
- web/.prettierignore
- web/dist/
- web/src/components/common/menu/
- web/vite.config.js.timestamp-1776585888682-3610427c96bb1.mjs

### 来源

- 本条由 `gogogo.sh 7` 更新。


## 1. 主路径收敛

AiLinkDog 当前主路径已经收敛为：

- PostgreSQL-only
- Bun + Vite 前端
- Go 后端
- `gogogo.sh` 作为本地开发统一入口

## 2. 初始化逻辑调整

- 前端旧 Setup Wizard 主路径已删除
- `/api/setup` 旧安装接口已移除
- `model/setup.go` 暂时保留为内部初始化记录模型

## 3. 本地 PostgreSQL 初始化现状

- 数据库：`ailindog`
- 用户：`ald`
- 地址：`127.0.0.1:5432`
- 超级管理员：`ALD`

## 4. 开发脚本现状

`gogogo.sh 1` 当前行为：

- 检测已有开发 session
- 可进入已有 session 或重启当前/全部开发 session
- 最终开发界面为 tmux 同窗口左右分屏

附加命令：

- `./gogogo.sh attach`
- `./gogogo.sh stop`

## 5. 前端 warning 治理模式

当前已经验证出一个稳定模式：

- 对于第三方 UI 组件在 StrictMode 下的已知兼容性 warning，优先在根因处替换组件链路，而不是关闭 StrictMode
- 如果同类问题重复出现，应抽成项目级基础组件，而不是每个业务点各自手写

当前基础组件：

- `AppDropdownMenu`

## 6. 调试方法学

当前项目新增正式调试规则：

1. 先看当前仓库对应文件
2. 再对照上游 `new-api` 同文件
3. 判断是上游问题、本地问题、还是落后于上游

这条规则适用于：

- 报错
- warning
- 行为异常
- 兼容性问题
