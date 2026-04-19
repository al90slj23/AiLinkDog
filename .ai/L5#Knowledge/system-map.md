# 系统关系图

## 后端主链路

最常见的业务链路是：

`Router -> Controller -> Service -> Model`

这条链路负责传统的请求处理、业务逻辑与数据库访问。

## Relay 链路

当前项目的重要特殊链路是：

`客户端请求 -> DTO -> relay/channel -> 上游 provider -> 响应转换 -> 返回客户端`

这条链路承载多模型协议兼容、provider 适配、流式响应与格式回转。

## i18n 关系

- 后端：`i18n/` + `go-i18n`
- 前端：`web/src/i18n/` + `i18next`

二者职责不同，修改国际化时必须区分上下文。

## 构建关系

- `web/` 负责前端构建
- 构建输出到 `web/dist`
- `main.go` 对 `web/dist` 有 embed 依赖

因此前端构建状态会直接影响后端测试和编译。

## 工具关系

- Go：后端开发、测试、编译
- Bun：前端依赖、构建、lint
- Docker Compose：部署与运行堆栈
- `gogogo.sh`：统一入口，串联开发、构建、测试、lint、Docker、清理
