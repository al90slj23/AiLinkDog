# AiLinkDog Agent Notes

本仓库协作默认使用中文。只记录未来 agent 容易猜错的事实；更完整背景看 `README.md`、`CLAUDE.md` 和 `.ai/`。

## 项目身份

- 当前代码仍是 `new-api` 体系，Go module 是 `github.com/QuantumNous/new-api`；`AiLinkDog` 是本地长期维护路线名，不是替代上游身份。
- `new-api`、`QuantumNous` 相关名称、版权、module/import path、镜像名、README 署名等受保护；不要擅自删除、改名或替换。
- `.cursor/rules/project.mdc` 是历史 Cursor 规则，里面“三库兼容”等内容已过时；冲突时以 `AGENTS.md`、`CLAUDE.md`、`.ai/L3#Standards/` 和可执行配置为准。

## 运行环境与入口

- 后端入口是根目录 `main.go`，当前 `go.mod` 要求 `go 1.25.1`；CI/release 使用 `go-version: >=1.25.1`。
- 正式数据库方向是 PostgreSQL-only。`SQL_DSN` 是主流程必需项；`model/main.go` 的 `chooseDB` 缺少 DSN 会直接报错。
- 前端在 `web/`，React 18 + Vite + Semi Design，优先用 Bun，不要改成 npm/yarn/pnpm 工作流。
- `main.go` 使用 `//go:embed web/dist` 嵌入前端产物；生产构建或 Go 二进制发布前必须先完成 `web` 构建。

## 常用命令

- 本地开发推荐：`./gogogo.sh 1`，会用 `tmux` 启动后端 `air -c .air.toml`、前端 `bun install && bun run dev`、监控窗格；依赖 `tmux`、`go`、`bun`、`air`。
- 进入/停止当前开发会话：`./gogogo.sh attach`、`./gogogo.sh stop`。
- 完整构建：`./gogogo.sh build`，实际执行 `cd web && bun install && bun run build`，然后根目录 `go build ./...`。
- 后端测试：`./gogogo.sh test` 或 `go test ./...`；单测示例：`go test -run TestName ./router/...`。
- 前端检查：`./gogogo.sh lint`，会先清理 `web/dist` 中除 `index.html` 外的产物，再跑 `bun run lint` 和 `bun run eslint`。
- 前端单独命令都在 `web/` 下：`bun install`、`bun run dev`、`bun run build`、`bun run lint`、`bun run eslint`、`bun run i18n:extract|sync|lint|status`。
- `make` 只构建前端并后台 `go run main.go`，不等同于推荐开发流；日常优先 `gogogo.sh`。

## 架构边界

- 主分层是 `router -> controller -> service -> model`；AI provider 协议适配和格式转换主要在 `relay/` 和 `relay/channel/`。
- 配置与策略在 `setting/`，请求/响应结构在 `dto/`，共享工具在 `common/`，后端 i18n 在 `i18n/`，前端 i18n 在 `web/src/i18n/`。
- `.ai/L3#Standards/standards/` 是细规则来源；先看 `.ai/L2#Index/toc.md` 找具体规范，历史决策看 `.ai/L4#Changelog/`。

## 代码规则

- 业务 JSON marshal/unmarshal 应走 `common/json.go` 的 `common.Marshal`、`common.Unmarshal`、`common.UnmarshalJsonStr`、`common.DecodeJson`；引用 `json.RawMessage` 等类型可以保留 `encoding/json` 类型导入。
- 新数据库设计和文档按 PostgreSQL-only 写；原生 SQL 中遇到保留字列或布尔字面量，优先复用 `model/main.go` 的 `commonGroupCol`、`commonKeyCol`、`commonTrueVal`、`commonFalseVal` 模式。
- relay 请求 DTO 中从客户端 JSON 解析后再发往上游的可选标量字段必须用指针加 `omitempty`，避免显式 `0`、`false` 被丢掉。
- 新增 channel 时必须确认提供商是否支持 `StreamOptions`；支持时更新 `relay/common/relay_info.go` 的 `streamSupportedChannels` 或相关能力标记。
- 前后端都有 i18n：后端是 `go-i18n` YAML，前端是 `i18next` 扁平 JSON；前端翻译 key 使用中文源字符串并通过 `t('中文key')` 调用。
- 旧初始化向导和 Docker 不是当前本地维护主路径；不要把它们写成推荐入口。

## 质量与工作流

- 修改前优先读可执行配置和实际入口；文档与脚本冲突时相信脚本、`go.mod`、CI 和代码。
- 调试本地错误时先看当前文件，再对比上游 `new-api` 对应文件，判断是本地改动、上游已修复还是本地落后。
- PR 检查会拒绝明显纯 AI 内容；不要在提交说明或 PR 正文加入 `Generated with Claude Code` 之类标记。
- 任务完成总结或 work-log wrap-up 时，本仓库有项目 skill `standards-sync-on-complete`：需要同步对应 L4 changelog 时先加载该 skill。
