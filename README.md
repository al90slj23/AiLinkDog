<div align="center">

![new-api](/web/public/logo.png)

# New API

🍥 **新一代大模型网关与 AI 资产管理系统**

<p align="center">
  <strong>中文主文档</strong>
</p>

<p align="center">
  <a href="#-快速开始">快速开始</a> •
  <a href="#-主要特性">主要特性</a> •
  <a href="#-部署与运行">部署与运行</a> •
  <a href="#-文档与规范">文档与规范</a> •
  <a href="#-帮助支持">帮助支持</a>
</p>

</div>

## 📝 项目说明

> [!IMPORTANT]
> - 本项目仅供个人学习使用，不保证稳定性，且不提供任何技术支持。
> - 使用者必须在遵循 OpenAI [使用条款](https://openai.com/policies/terms-of-use) 与适用法律法规的前提下使用，不得用于非法用途。
> - 根据《生成式人工智能服务管理暂行办法》，请勿向中国地区公众提供未经备案的生成式人工智能服务。

## 🔀 本地长期维护路线

从 `2026-04-19` 开始，当前仓库额外记录 `AiLinkDog` 作为一个基于 `new-api` 的本地长期维护路线名称。

这表示：

- 当前仓库已经进入长期独立维护、持续优化与逐步深度改造阶段；
- 随着本地维护逐步深入，未来升级可能不再适合采用简单的一键式上游同步方式；
- 但仍必须持续跟踪上游 `new-api` 的版本、bug 修复与新功能变化，再决定是否合并、同步、移植或暂不跟进。

当前记录的上游基线为：

- 日期：`2026-04-19`
- 最新标签：`v0.12.14`
- 当前仓库修订：`v0.12.14-5-gf995a868`

重要边界：

- `AiLinkDog` 是本地长期维护路线名称，不是对上游身份的替代；
- 所有 `new-api` / `QuantumNous` 相关受保护标识、来源关系与版权信息都必须保留。

## 🧭 当前项目方向

从 `AiLinkDog` 路线开始：

- PostgreSQL 是当前项目唯一正式数据库方向；
- 旧的初始化向导不再作为主产品路径保留；
- Docker 不再作为当前路线的主入口或推荐工作流；
- 前端包管理与脚本执行优先使用 Bun；
- 项目协作与 specs 默认使用中文。

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/QuantumNous/new-api.git
cd new-api

# 配置 PostgreSQL 连接
export SQL_DSN="postgres://user:password@127.0.0.1:5432/newapi?sslmode=disable"

# 启动本地开发环境
./gogogo.sh 1
```

启动完成后，访问 `http://localhost:3000` 即可使用。

### 常用命令

```bash
 ./gogogo.sh 1      # 本地开发（tmux 分屏）
 ./gogogo.sh build  # 前端构建 + 后端编译
 ./gogogo.sh deploy # 打开部署菜单（GitHub 上传 / 预留服务器部署入口）
 ./gogogo.sh test   # 后端测试
 ./gogogo.sh lint   # 前端格式/规范检查
 ./gogogo.sh clean  # 清理构建产物
```

`deploy -> 仅上传到 GitHub 仓库` 会先弹出摘要生成方式菜单，直接回车默认使用 `OpenCode`，也可以显式选择 `DeepSeek API`。生成摘要后仍支持确认、基于当前摘要改写，或直接输入补充说明让系统重新整理一版摘要。

## 🏗️ 技术栈

### 后端

- Go 1.22+
- Gin
- GORM v2
- PostgreSQL
- Redis + 内存缓存

### 前端

- React 18
- Vite
- Semi Design UI
- Bun
- i18next

### 认证与安全

- JWT
- WebAuthn / Passkeys
- OAuth（GitHub、Discord、OIDC 等）

## 🧱 核心架构

后端主分层：

`Router -> Controller -> Service -> Model`

关键目录：

```text
router/        HTTP 路由层
controller/    请求处理层
service/       业务逻辑层
model/         数据模型与数据库访问
relay/         AI relay 与 provider 适配层
setting/       配置与策略层
common/        通用工具
dto/           请求响应 DTO
types/         共享类型定义
web/           React 前端
i18n/          后端国际化
oauth/         OAuth 实现
```

## ✨ 主要特性

### 核心能力

- 多上游模型提供商接入
- OpenAI / Claude / Gemini 等格式兼容与转换
- OpenAI Responses / Realtime 等接口支持
- 渠道加权、失败重试、用户级模型限流
- 用户、Token、Channel、Model、计费与管理后台
- 多语言界面与文案

### 格式转换

- OpenAI Compatible ⇄ Claude Messages
- OpenAI Compatible → Google Gemini
- Google Gemini → OpenAI Compatible
- Thinking-to-content 相关能力

### 认证与管理

- 管理员后台
- 用户管理
- Token 与渠道管理
- OIDC / Discord / Telegram / LinuxDO 等登录能力
- Passkeys / WebAuthn

## 🗄️ 部署与运行

当前主路径要求：

- 数据库：PostgreSQL
- 前端：Bun + Vite
- 后端：Go

常用环境变量：

| 变量名 | 说明 |
|------|------|
| `SQL_DSN` | PostgreSQL 连接字符串 |
| `SESSION_SECRET` | 会话密钥 |
| `CRYPTO_SECRET` | 加密密钥 |
| `REDIS_CONN_STRING` | Redis 连接字符串 |
| `STREAMING_TIMEOUT` | 流式超时时间 |
| `AZURE_DEFAULT_API_VERSION` | Azure API 版本 |

## 📚 文档与规范

当前仓库主要规范入口：

- `AGENTS.md`
- `CLAUDE.md`
- `./.ai/` 六层记忆体系

推荐阅读顺序：

1. `./.ai/L1#Overview/guide.md`
2. `./.ai/L2#Index/toc.md`
3. `./.ai/L3#Standards/standards/`

## 🤝 开发规范摘要

- 全程使用中文沟通交流
- specs 默认使用中文编写
- JSON 编解码必须使用 `common/json.go`
- 数据库方向统一收敛为 PostgreSQL-only
- 新增 channel 时要确认 `StreamOptions` 支持情况
- `new-api` / `QuantumNous` 的受保护标识与版权信息不得删除或替换

## 🔗 相关项目

### 上游项目

- [new-api / QuantumNous](https://github.com/QuantumNous/new-api)
- [One API](https://github.com/songquanpeng/one-api)

### 配套工具

- [neko-api-key-tool](https://github.com/Calcium-Ion/neko-api-key-tool)

## 💬 帮助支持

- 项目文档：<https://docs.newapi.pro/zh/docs>
- 问题反馈：<https://github.com/Calcium-Ion/new-api/issues>
- 社区交流：<https://docs.newapi.pro/zh/docs/support/community-interaction>

## 📜 许可证

本项目采用 [GNU Affero 通用公共许可证 v3.0 (AGPLv3)](./LICENSE) 授权。

本项目是在 [One API](https://github.com/songquanpeng/one-api) 基础上持续演进的上游分支项目生态的一部分，当前仓库同时严格保留 `new-api` / `QuantumNous` 的来源与版权边界。

---

<div align="center">

### 💖 感谢使用 New API / AiLinkDog 本地长期维护路线

如果这个项目对你有帮助，欢迎给上游项目一个 ⭐️ Star。

<sub>Built with ❤️ by QuantumNous, locally maintained as AiLinkDog</sub>

</div>
