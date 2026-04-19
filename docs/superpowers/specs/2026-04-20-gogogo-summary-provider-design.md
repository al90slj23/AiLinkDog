# gogogo 摘要 Provider 选择设计

## 摘要

为 `gogogo.sh` 的 `deploy -> 仅上传到 GitHub 仓库` 流程增加“摘要生成方式”选择能力。

本次设计将提交摘要生成从“单一 DeepSeek API 路径”扩展为“运行时 provider 选择”，支持：

1. `OpenCode`（默认）
2. `DeepSeek API`
3. `Claude Code`（本次先预留）

其中：

- 进入摘要生成阶段时弹出 provider 选择菜单；
- 用户直接回车时，默认选择 `1. OpenCode`；
- 用户本次选定的 provider 将贯穿本轮摘要流程，包括：
  - 初始摘要生成；
  - 基于补充说明重新整理摘要；
- `gogogo.git.sh` 继续负责摘要确认、提交流程、push 与可选 PR；
- `gogogo.ai.sh` 负责 provider 路由与统一输出契约；
- 所有 provider 的输出必须统一为：

```text
TITLE: ...
BODY:
...
```

## 目标

- 在 `gogogo` GitHub 提交流程中增加运行时 provider 选择菜单。
- provider 选择默认回车为 `1. OpenCode`。
- 支持 `OpenCode` 和 `DeepSeek API` 两个真实 provider。
- 为 `Claude Code` 预留 provider 位与提示逻辑。
- 让“补充说明重整摘要”沿用当前 provider，而不是固定走某一个实现。
- 统一不同 provider 的输出格式，供后续确认、改写、提交共用。

## 非目标

- 本次不实现 `Claude Code` 的真实调用能力。
- 本次不调整 Git 提交流程本身的主结构，例如 `git add .`、`git commit`、push、可选 PR。
- 本次不引入新的外部服务端或中间存储。

## 背景

当前 `gogogo.sh` 的提交摘要路径已经接入了 `DeepSeek API`，并能从 `~/.zshrc` 中读取 `DEEPSEEK_APIKEY_GOGOGOSH_GITHUB`，根据以下上下文生成详细中文摘要：

- 当前分支
- `git status --short`
- `git diff --cached`
- `git diff`
- 最近 5 条提交
- 用户补充说明

但新的使用场景提出了两个要求：

1. `gogogo.sh` 在 OpenCode 会话之外也会独立运行，因此不能假定始终能依赖会话内模型；
2. 摘要生成方式需要可切换，未来不仅要支持 `DeepSeek API`，还要支持 `OpenCode`，并为 `Claude Code` 预留扩展位。

根据 OpenCode 官方 CLI 文档与本机实际环境：

- `opencode run [message..]` 是受支持的非交互式调用方式；
- 本机存在可执行命令 `opencode`；
- 因此 `OpenCode` 适合作为脚本内的一个摘要 provider。

## 推荐方案

采用“运行时 provider 菜单 + 统一 provider 路由层”的设计。

### 核心原则

- provider 在本次提交流程开始时选择一次；
- 本次选定的 provider 在整个摘要生命周期内保持一致；
- 用户直接回车默认选 `OpenCode`；
- `DeepSeek API` 保留现有路径；
- `Claude Code` 本次仅作为预留项，不做真实调用；
- 不自动在 provider 之间静默切换，失败时要明确提示。

## 交互设计

### provider 选择菜单

在进入摘要生成前，展示：

```text
请选择摘要生成方式（直接回车默认 1）：
1. OpenCode
2. DeepSeek API
3. Claude Code（预留）
```

规则：

- 用户直接回车 => `1. OpenCode`
- 用户输入 `1` => `OpenCode`
- 用户输入 `2` => `DeepSeek API`
- 用户输入 `3` => `Claude Code（预留）`
- 非法输入 => 重新提示，不继续后续流程

### provider 生命周期

一旦当前流程选定 provider，后续以下阶段都必须使用同一 provider：

- 初始摘要生成
- 用户输入补充说明后的摘要重整

不允许中途自动切换 provider，以保证行为一致且便于排查。

### 摘要确认菜单

provider 选择完成后，摘要确认菜单仍沿用当前已确认的交互：

```text
当前提交摘要：
TITLE: ...
BODY:
...

1. 确认当前摘要，执行下一步
2. 自定义摘要（基于当前摘要改写）
3. 取消

直接输入其他内容，则视为补充说明，我会基于当前摘要重新整理一版
```

其中：

- `1`：接受当前摘要并进入 Git 提交流程
- `2`：基于当前摘要改写标题与正文
- `3`：取消本次提交流程
- 其他非空输入：作为补充说明，调用当前 provider 重新整理一版摘要

## Provider 设计

### 1. OpenCode provider

`OpenCode` provider 使用非交互 CLI：

```bash
opencode run "<prompt>"
```

设计要求：

- 使用脚本可安全拼接的 prompt 文本；
- 明确要求输出固定格式：

```text
TITLE: ...
BODY:
...
```

- 优先使用当前项目目录作为上下文运行目录；
- 若 `opencode` 命令不存在，则明确报错，不静默切换到其他 provider；
- 若 `opencode run` 返回内容格式不合法，则尝试做有限归一化；
- 若仍无法归一化，则明确报错。

### 2. DeepSeek API provider

保留现有 `DeepSeek API` 路径，继续使用：

- `~/.zshrc` 中的 `DEEPSEEK_APIKEY_GOGOGOSH_GITHUB`
- `curl` + `jq` 调用 `https://api.deepseek.com/chat/completions`

设计要求：

- 若当前环境变量不存在，先尝试显式 `source ~/.zshrc`；
- prompt 继续使用详细摘要模式；
- 输出需统一为 `TITLE/BODY`；
- 若 provider 失败，允许退回本地保底摘要，但要明确这是 fallback，不是成功调用 DeepSeek。

### 3. Claude Code provider（预留）

本次只实现 provider 标识与用户提示，例如：

```text
Claude Code provider 暂未接入，后续安排
```

选择该 provider 时，不进入摘要生成，直接返回上一步或重新选择 provider。

## 统一输出契约

不论 provider 是：

- `OpenCode`
- `DeepSeek API`
- 或后续新增 provider

都必须在进入确认逻辑前被规范化为：

```text
TITLE: <一行标题>
BODY:
<多行正文>
```

这意味着 `gogogo.git.sh` 不需要关心 provider 细节，只需要处理：

- 标题解析
- 正文解析
- 用户确认/改写/取消

## Prompt 输入设计

无论 provider 是 `OpenCode` 还是 `DeepSeek API`，摘要生成都应基于同一份上下文：

- 当前分支
- 最近 5 条提交
- `git status --short`
- `git diff --cached`
- `git diff`
- 用户补充说明（若有）

这样可以保持不同 provider 在输入上的一致性，避免出现：

- `OpenCode` 看到了更完整的上下文
- `DeepSeek` 只看到了文件列表

## 错误处理

### OpenCode provider

- `opencode` 不存在 => 明确报错
- `opencode run` 失败 => 明确报错
- 返回内容不符合格式 => 尝试归一化，失败则报错

### DeepSeek provider

- key 缺失 => 尝试从 `~/.zshrc` 显式读取
- `curl` / `jq` 缺失 => 明确报错
- API 调用失败 => 明确提示，并退回本地保底摘要
- 返回格式异常 => 先归一化，仍失败则退回本地保底摘要

### Claude Code provider

- 直接提示“暂未接入”，不进入后续提交流程

## 文件职责

### `gogogo.ai.sh`

调整为“摘要 provider 路由层”，负责：

- provider 常量与选择值
- `OpenCode` 调用
- `DeepSeek API` 调用
- provider 输出归一化
- provider 路由：`generate_commit_summary_text(provider, ...)`

### `gogogo.git.sh`

负责：

- provider 选择菜单
- 保持当前 provider 状态
- 调用 `gogogo.ai.sh` 生成摘要
- 摘要确认/改写/取消
- `git add` / `git commit` / push / 可选 PR

## 验证范围

实现完成后至少验证：

- `bash -n gogogo.sh gogogo.lib.sh gogogo.6.sh gogogo.ai.sh gogogo.git.sh`
- provider 选择菜单：回车默认选 `OpenCode`
- 输入 `2` 时走 `DeepSeek API`
- 输入 `3` 时正确提示 `Claude Code` 预留
- `OpenCode` provider 能返回 `TITLE/BODY`
- `DeepSeek API` provider 能返回 `TITLE/BODY`
- 补充说明重整摘要时，仍使用当前选中的 provider
- provider 失败时错误提示明确
- 取消路径不会触发真实 push / PR

## 设计边界

本次设计只扩展摘要 provider 选择能力，不改变当前仓库的 GitHub 目标关系：

- 默认上传到 `origin(main) -> al90slj23/ailinkdog`
- 可选 PR 到 `upstream -> QuantumNous/new-api`

同时，本次不改变已确认的摘要确认交互，也不改写受保护的 `new-api` / `QuantumNous` 标识。
