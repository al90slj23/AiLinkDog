# 2026-04-19 第一阶段收敛与前端 warning 修复记录

## 本次工作概述

本次工作围绕三个方向完成了一批重要收敛：

1. 项目正式方向切换到 PostgreSQL-only 主路径
2. 移除旧初始化向导与 Docker 主入口认知
3. 清理 React 18 StrictMode 下由第三方 UI 组件链触发的一批前端 warning

## PostgreSQL-only 第一阶段

### 已完成

- 文档、规则与 `.ai` 统一切换到 PostgreSQL-only 方向
- 初始化主路径不再保留旧 Setup Wizard
- Docker 不再作为主入口或推荐工作流
- 本地 PostgreSQL 已切换到：
  - 数据库：`ailindog`
  - 用户：`ald`
  - 地址：`127.0.0.1:5432`
- 已通过 `/api/setup` 初始化：
  - 超级管理员：`ALD`
  - 密码：`ALD20260419`

### 保留的历史债务

- 底层 SQLite / MySQL 兼容代码尚未进入第二阶段系统清理
- `model/setup.go` 仍保留为内部初始化状态记录模型

## 开发脚本 `gogogo.sh`

### 本次修复

- 修复了开发 session 与 worktree 混用导致后端在错误目录启动的问题
- 将 tmux session 名绑定到工作区路径
- `gogogo.sh 1` 发现已有开发 session 时，会列出相关 session，并标记当前工作区 session
- 新增选择项：
  - 进入已有会话
  - 关闭当前工作区会话并重启
  - 关闭所有开发会话并重启
- 新增：
  - `./gogogo.sh attach`
  - `./gogogo.sh stop`
- 开发模式最终收敛为：
  - 同一个 tmux window
  - 左右分屏
  - 左边后端、右边前端
  - 两边持续输出各自日志

## 前端 warning 治理

### 1. StrictMode + Semi UI Dropdown / Tooltip 链路

确认根因：

- 不是业务逻辑错误
- 是 `React.StrictMode` 下，`Semi UI Dropdown / Tooltip / Button` 内部链路持续触发 `findDOMNode` 弃用警告
- 升级 `@douyinfe/semi-ui` 到 `2.95.0` 后，这类 warning 仍然存在

处理策略：

- 保留全局 `React.StrictMode`
- 不再在单点上继续依赖会触发 warning 的 `Semi UI Dropdown` 链路
- 抽出项目级基础组件 `AppDropdownMenu`

### 2. AppDropdownMenu

新增：

- `web/src/components/common/menu/AppDropdownMenu.jsx`

用途：

- 统一承接按钮触发 + 浮层菜单场景
- 替代会在 StrictMode 下触发 `findDOMNode` warning 的 `Semi UI Dropdown`

第一批替换场景：

- `LanguageSelector`
- `UserArea`
- `ThemeToggle`
- `NewYearButton`

### 3. 其他前端 warning 修复

已修复：

- `icononly={false}` 导致的非布尔 DOM 属性 warning
- dashboard 常量中 `Card shadows=''` 导致的非法 prop warning
- playground 中 `showError is not defined` 运行时错误
- playground Chat 缺少 `uploadProps.action` 导致的 Upload prop warning
- `MessageActions` 中 `Tooltip + Button` 链路导致的 StrictMode warning

## 新增调试规则

本次已将以下规则写入 `.ai`、`AGENTS.md`、`CLAUDE.md`：

- 出现报错或 warning 时，先看当前仓库对应文件；
- 再对照上游 `new-api` 官方仓库的同文件；
- 判断是上游已修复、当前仓库落后，还是本地改动引入的问题；
- 不允许在未对照当前文件和上游文件前，拍脑袋假设问题来源。

## 当前结论

截至本次记录，AiLinkDog 已完成一轮重要的主路径收敛：

- 数据库主路径：PostgreSQL-only
- 启动主路径：Go + Bun + `gogogo.sh`
- 初始化主路径：不再使用旧向导
- 前端兼容性策略：保留 StrictMode，使用项目级基础组件替代已知有问题的第三方菜单链路
