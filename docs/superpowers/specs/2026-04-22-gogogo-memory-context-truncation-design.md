# gogogo 记忆同步上下文收敛设计

## 摘要

修复 `gogogo.sh` 在部署前执行记忆同步时，因 `collect_memory_git_context()` 无上限拼接 `git diff --cached` 与 `git diff`，导致发送给 DeepSeek 的 prompt 超出模型上下文上限并返回 `400 invalid_request_error` 的问题。

本次只调整 `gogogo.memory.sh` 中 Git 上下文的收敛方式，不改变记忆同步主流程、DeepSeek 调用接口、prompt 结构和后续知识库纯化步骤。

## 目标

- 限制记忆同步链路中 `git_context` 的总体体积。
- 保留 `git status --short` 的完整信息。
- 对 `git diff --cached` 和 `git diff` 进行可控截断。
- 在输出中明确标记 diff 已截断，避免 AI 将其当作完整上下文。
- 为该行为补充可重复执行的 shell 回归测试。

## 非目标

- 本次不调整 `run_memory_sync_flow()` 的整体顺序。
- 本次不修改 `call_deepseek_text()` 的接口或 provider 选择逻辑。
- 本次不改变 `build_memory_pre_summary_prompt()`、`build_memory_file_selection_prompt()`、`build_purification_plan_prompt()` 的整体模板结构。
- 本次不尝试精确按 token 计数，仅做稳定的本地文本体积控制。

## 背景

当前 `collect_memory_git_context()` 的实现会原样拼接：

- `git status --short`
- `git diff --cached`
- `git diff`

在大工作区场景下，`git diff` 内容可达数 MB 甚至十余 MB。此前已修复本地脚本层面的“命令行参数过长”问题，但请求真正发往 DeepSeek 后，服务端仍会因为模型上下文超限返回：

```text
This model's maximum context length is 131072 tokens ...
```

因此，本次根因已经从“本地进程无法承载大参数”转变为“上游模型无法接受无上限上下文”。

## 方案对比

### 方案 A：按行截断 diff

做法：

- 对 `git diff --cached` 和 `git diff` 只保留前 N 行。

优点：

- 输出更自然；
- 对人类阅读友好。

缺点：

- 行长度差异很大，无法稳定约束总体积；
- 遇到极长单行时效果不可靠。

### 方案 B：按字节截断 diff

做法：

- 对每段 diff 只保留前 N 字节。

优点：

- 能稳定限制最终 prompt 规模；
- 实现最直接。

缺点：

- 可能从 patch 中间截断，可读性略差。

### 方案 C：混合方案，按字节硬截断并追加提示

做法：

- 对每段 diff 先做固定字节上限截断；
- 若发生截断，追加统一提示，例如“以下 diff 已截断，仅保留前 N 字节”。

优点：

- 能稳定控制大小；
- 明确告知 AI 当前上下文不完整；
- 改动最小且行为清晰。

缺点：

- 仍不保证保留的恰好是最重要片段，但相比当前无上限更可控。

## 推荐方案

采用方案 C。

### 设计细节

1. 在 `gogogo.memory.sh` 中新增一个小型 helper，用于按固定字节上限收敛文本块。
2. `collect_memory_git_context()` 中：
   - `git status --short` 保持原样；
   - `git diff --cached` 先收敛；
   - `git diff` 先收敛。
3. 当 diff 被截断时，输出格式中追加明确说明，示例：

```text
[git diff]
<保留的前 N 字节>

[提示]
当前 diff 已截断，仅保留前 N 字节用于 AI 总结。
```

4. 其余 prompt 拼装逻辑保持不变，这样后续 `pre_summary`、文件选择、纯化计划都会自动吃到收敛后的 `git_context`。

## 默认上限

默认采用“每段 diff 单独限制”的方式：

- `git diff --cached`：固定字节上限
- `git diff`：固定字节上限

建议起点使用中等上限，使整体 prompt 控制在远低于当前 12MB 的量级。具体数值在实现时固定为常量，并通过测试保证超大 diff 时会被截断。

## 测试设计

新增 shell 回归测试，覆盖以下行为：

1. 构造一个非常大的工作区 diff 文本。
2. 调用 `collect_memory_git_context()`。
3. 断言输出中仍然包含：
   - `[git status --short]`
   - `[git diff --cached]`
   - `[git diff]`
4. 断言超大 diff 不会被完整原样带出，而是出现截断提示。
5. 断言最终上下文字节数显著低于原始超大输入，证明收敛生效。

## 风险与边界

- 截断后 AI 拿到的是节选上下文，而非完整 diff；这会降低细节完备度，但能换取流程可执行性。
- 若后续仍出现上下文过大，应继续收敛导航上下文、候选文件列表或选中文件内容，但这不在本次范围内。
- 本次不尝试按 token 精确估算，因为 shell 层维护 token 计数成本高且不稳定。
