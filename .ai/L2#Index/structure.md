# 结构索引

## 仓库主体结构

```text
router/        HTTP 路由层
controller/    请求处理层
service/       业务逻辑层
model/         数据模型与数据库访问
relay/         AI relay 与 provider 适配层
setting/       配置与策略层
common/        通用工具
constant/      全局常量定义
dto/           请求响应 DTO
types/         共享类型定义
web/           React 前端
i18n/          后端国际化
oauth/         OAuth 实现
electron/      Electron 桌面封装
```

## 核心后端路径

### 经典分层

`Router -> Controller -> Service -> Model`

### Relay 体系

`relay/` 是当前项目的重要差异化目录，负责：

- 协议转换
- 上游 provider 适配
- 请求与响应格式互转
- 流式处理

## 前端结构

`web/` 下是独立 React 工程，关键部分包括：

- `web/src/components/`
- `web/src/pages/`
- `web/src/hooks/`
- `web/src/i18n/`

其中 `web/src/i18n/locales/` 是当前前端多语言文案的核心目录。

## 配置与公共层

- `setting/` 负责 ratio、model、operation、system、performance 等配置
- `common/` 负责 JSON、Redis、环境变量、限流等公共工具
- `constant/` 与 `types/` 共同承接共享常量与类型语义

## 扩展入口

- `constant/README.md` 说明了 `constant` 包只能承载全局常量，不应引入业务逻辑
- `electron/README.md` 说明当前仓库还包含 Electron 桌面封装层，用于打包桌面应用

## 构建相关结构

- `web/dist/` 是前端构建输出目录
- `main.go` 使用 `go:embed` 依赖该目录
- 因此 `web/dist` 与后端编译、测试存在直接关系
