# gogogo 提交摘要上下文收敛设计

## 摘要

修复 `gogogo.sh` 在 GitHub 上传流程中生成提交摘要时，因 `get_commit_diff_block()` 无上限拼接完整 `git diff --cached` 与 `git diff`，导致 OpenCode provider 输入超过单条文本上限而失败的问题。

本次只收敛“提交摘要链路”使用的 diff 上下文，不调整 memory 同步链路，不改变提交摘要 prompt 模板结构与确认交互。

## 目标

- 限制 `get_commit_diff_block()` 生成的 diff 上下文大小。
- 保留 `git status --short` 与 recent commits 原有行为。
- 对 `git diff --cached` 和 `git diff` 进行可控截断并加显式提示。
- 让 OpenCode / DeepSeek / 本地 fallback 共用收敛后的 diff 上下文。

## 非目标

- 本次不修改 `build_commit_summary_prompt()` 的文案模板。
- 本次不调整 memory 总结流程。
- 本次不改变 commit confirmation 的交互结构。
- 本次不尝试按 token 精确计数，只做稳定的本地文本体积控制。

## 背景

当前提交摘要链路中：

- `get_commit_diff_block()` 会完整拼接：
  - `git diff --cached`
  - `git diff`
- `build_commit_summary_prompt()` 再把它原样放进 `[changes]`

当前实测：

- `diff_bytes` 约为 `12.3MB`
- `prompt_bytes` 约为 `12.3MB`

OpenCode 返回错误：

```text
Invalid 'input[1].content[1].text': string too long.
Expected a string with maximum length 10485760
```

这说明本地参数传递问题虽然已解决，但 provider 侧的输入上限仍然被完整 diff 上下文击穿。

## 方案对比

### 方案 A：只收敛 OpenCode provider 输入

做法：

- 仅在 `call_opencode_for_commit_summary()` 前截断 prompt。

优点：

- 改动范围小。

缺点：

- DeepSeek 与 fallback 仍保留超大 diff 输入；
- 同一份摘要上下文在不同 provider 行为不一致。

### 方案 B：收敛 `get_commit_diff_block()` 输出

做法：

- 在 diff 上下文采集阶段就做固定字节截断；
- 所有 provider 共用收敛后的 diff block。

优点：

- 收敛点集中；
- 所有 provider 行为一致；
- 能同时降低后续 provider 输入风险。

缺点：

- 提交摘要的上下文会从“完整 diff”变成“节选 diff”。

## 推荐方案

采用方案 B。

## 设计细节

1. 在 `gogogo.git.sh` 中为提交摘要链路新增小型 helper，用于收敛 diff block。
2. `get_commit_diff_block()` 中：
   - `git diff --cached` 收敛；
   - `git diff` 收敛；
   - 若发生截断，追加类似 `当前 git diff 已截断` 的提示。
3. `build_commit_summary_prompt()` 不变，仍然吃 `diff_block` 参数。
4. 本地 fallback 摘要继续工作，但其输入规模也会同步下降。

## 默认上限

采用“每段 diff 单独限制”的方式：

- `git diff --cached`：固定字节上限
- `git diff`：固定字节上限

默认上限应显著低于 OpenCode 的 10MB 限制，确保最终 prompt 能稳定通过。

## 测试设计

新增 shell 回归测试，覆盖：

1. 超大 commit diff 输入会被截断并加标记。
2. 小 diff 不应被误截断。
3. 最终 commit summary prompt 大小显著低于修复前的多 MB 量级。

## 风险与边界

- 收敛后提交摘要基于节选 diff，而非完整 diff；但这比 provider 直接失败更可接受。
- 如果未来仍出现 prompt 过大，还需继续收敛 `status_block` 或 recent commits，但这不在本次范围内。
