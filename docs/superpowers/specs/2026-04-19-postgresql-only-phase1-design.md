# PostgreSQL-Only 第一阶段设计

## 概述

从 `AiLinkDog` 开始，项目数据库方向正式收敛为 PostgreSQL-only。第一阶段不追求一次性删除所有 SQLite/MySQL 遗留兼容代码，而是先完成项目入口、初始化流程、主文档、主规范和默认运行方式的收敛。

这意味着：

- 项目对外认知不再把 SQLite/MySQL 作为未来正式路线
- 初始化向导不再继续作为主入口保留
- Docker 不再作为当前项目主路径或推荐方案
- PostgreSQL 成为当前项目唯一正式数据库方向

## 目标

- 将项目文档、规范与 `.ai` 统一切换到 PostgreSQL-only 认知
- 移除前端初始化向导主路径
- 移除“数据库多选”与“使用模式向导”认知
- 从主路径中去掉 Docker 作为默认开发/部署方案
- 保持仓库仍可启动与继续开发

## 非目标

- 本阶段不承诺删除所有 SQLite/MySQL 兼容代码
- 本阶段不承诺重写所有 model 层数据库分支
- 本阶段不承诺移除所有历史测试中的 SQLite 内存库用法
- 本阶段不承诺立即改造所有底层迁移逻辑

## 范围

### 1. 规则与文档收敛

需要更新：

- `.ai`
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `README.zh_CN.md`

统一表达：

- PostgreSQL 是当前项目唯一正式数据库方向
- SQLite/MySQL 不再是未来演进目标
- Docker 不是当前项目主入口

### 2. 初始化向导收敛

需要调整：

- `web/src/pages/Setup/index.jsx`
- `web/src/components/setup/SetupWizard.jsx`
- `web/src/components/setup/components/steps/*`
- `web/src/components/layout/SetupCheck.js`
- 相关路由入口

方向：

- 不再保留多步初始化向导作为主路径
- 不再保留数据库多选和使用模式选择的认知
- 已初始化场景下，`/setup` 应直接跳首页或显示简单说明页

### 3. 运行入口收敛

需要调整：

- `gogogo.sh`
- `gogogo.5.sh`
- `.ai` 中关于 `gogogo.sh` 的文档

方向：

- Docker 命令不再作为正式主工作流
- 开发入口围绕 Go + Bun + PostgreSQL

## 验证目标

- 前端不再展示旧初始化向导
- 文档与规范统一表达 PostgreSQL-only
- Docker 不再作为当前项目主入口
- 现有开发入口仍可运行

## 边界

即使项目转向 PostgreSQL-only，也必须继续保留 `new-api` / `QuantumNous` 的受保护来源、标识与版权信息。
