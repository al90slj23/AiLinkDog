# AiLinkDog 项目概览

## 项目定位

`AiLinkDog` 当前承载的是 `new-api` 项目的真实代码与规范体系。它本质上是一个用 Go 编写的 AI API 网关 / 代理系统，聚合 40+ 上游 AI 提供商，在统一接口下提供模型转发、用户管理、计费、限流、后台管理和多种格式转换能力。

从 2026-04-19 开始，`AiLinkDog` 被明确记录为一个基于 `new-api` 的本地长期独立维护计划与演进代号。它代表的是当前仓库的长期优化、深度重构与持续建设方向，而不是对上游来源的否认或替代。

这意味着：

- 当前仓库会长期维护自己的优化路线
- 未来可能不再能简单一键升级上游版本
- 但仍需持续跟踪上游 `new-api` 的版本、修复与功能变化，并评估是否合并、同步或局部移植

## 当前技术栈

### 后端

- Go 1.22+
- Gin Web 框架
- GORM v2
- PostgreSQL
- Redis + 内存缓存

### 前端

- React 18
- Vite
- Semi Design UI（`@douyinfe/semi-ui`）
- Bun 作为首选前端包管理器与脚本执行器

### 其他能力

- JWT、WebAuthn / Passkeys、OAuth
- 后端 `go-i18n`
- 前端 `i18next`

### 国际化

- 后端语言：`en`、`zh`
- 前端语言：`zh`、`en`、`fr`、`ru`、`ja`、`vi`
- 前端翻译 key 采用中文源字符串

## 核心架构

当前项目主要采用以下后端分层：

`Router -> Controller -> Service -> Model`

同时还有一个很重要的 `relay/` 体系，用于承接不同 AI 提供商的协议适配与格式转换。

## 关键目录

- `router/`：HTTP 路由
- `controller/`：请求处理器
- `service/`：业务逻辑
- `model/`：数据库模型与数据访问
- `relay/`：AI relay / adapter / convert 主体
- `setting/`：系统配置与策略配置
- `common/`：通用工具
- `dto/`：请求响应 DTO
- `types/`：共享类型定义
- `web/`：React 前端
- `i18n/`：后端国际化
- `oauth/`：OAuth 提供商实现

## 当前最重要规则

### 沟通与文档

1. 全程使用中文沟通交流
2. 项目 specs 默认使用中文编写

### 后端

3. JSON 编解码必须使用 `common/json.go` 包装函数
4. 数据库方向从 AiLinkDog 开始统一收敛为 PostgreSQL-only
5. relay 请求中的可选标量字段必须使用指针以保留显式零值
6. 新增 channel 时必须确认 `StreamOptions` 支持情况

### 前端

7. 前端包管理器优先使用 Bun
8. 当前前端真实使用的是 Semi Design，不应继承旧项目与之冲突的 UI 规则
9. 前后端都存在 i18n，且实现方式不同，修改时必须区分上下文
10. 初始化向导不再作为当前项目主路径保留
11. Docker 不再作为当前项目主入口或推荐方案

### 项目保护规则

12. `new-api` 与 `QuantumNous` 相关标识是受保护信息，不得擅自移除、替换或改名

## 上游关系

- 当前本地长期维护代号：`AiLinkDog`
- 上游来源项目：`new-api`
- 当前记录基线日期：`2026-04-19`
- 当前上游基线版本标签：`v0.12.14`
- 当前仓库基线修订：`v0.12.14-5-gf995a868`

后续长期维护中，需要持续跟踪上游发布与修复情况，但必须在遵守上游版权与受保护标识规则的前提下进行。

## 常用命令

### 后端测试

```bash
go test ./...
```

### 前端

```bash
cd web
bun install
bun run dev
bun run build
```

### 统一脚本

```bash
./gogogo.sh test
./gogogo.sh build
./gogogo.sh lint
./gogogo.sh clean
```

## 阅读建议

- 想快速建立认知：继续读 `L2#Index/`
- 想找规则：进入 `L3#Standards/standards/`
- 想看为什么这样设计：查看 `L4#Changelog/`
- 想理解系统关系：查看 `L5#Knowledge/system-map.md`
