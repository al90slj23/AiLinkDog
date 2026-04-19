# 技术索引

## 后端技术栈

- Go 1.22+
- Gin
- GORM v2
- Redis
- PostgreSQL

## 前端技术栈

- React 18
- Vite
- Semi Design UI
- Bun
- i18next

## 国际化技术栈

- 后端：`nicksnyder/go-i18n/v2`
- 前端：`i18next` + `react-i18next` + `i18next-browser-languagedetector`
- 前端 Semi UI locale 通过 `SemiLocaleWrapper` 同步

## 认证与安全

- JWT
- WebAuthn / Passkeys
- OAuth（GitHub、Discord、OIDC 等）

## 当前关键工程约束

- JSON 编解码必须走 `common/json.go`
- 数据库方向已收敛为 PostgreSQL-only
- 前端包管理与脚本优先使用 Bun
- relay 请求 DTO 需保留显式零值语义
- 新增 channel 时需要检查 `StreamOptions`
- 受保护项目标识不可随意修改

## 当前工具关系

- Go：后端编译与测试
- Bun：前端依赖、构建、lint
- Vite：前端构建
- `gogogo.sh`：统一入口脚本
