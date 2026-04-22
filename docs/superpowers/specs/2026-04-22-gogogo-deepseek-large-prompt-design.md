# gogogo DeepSeek 超长 Prompt 修复设计

## 摘要

修复 `gogogo.sh` 在部署前执行知识库总结时，因 `call_deepseek_text()` 使用 `jq --arg` 传递超长 prompt 而触发 `Argument list too long` 的问题。

本次仅调整 `gogogo.ai.sh` 中 DeepSeek 文本调用的 payload 构造方式，不改变现有调用方、prompt 内容、provider 选择逻辑和返回格式。

## 目标

- 避免超长 `prompt` 通过命令行参数传给 `jq`。
- 保持 DeepSeek 请求 JSON 结构不变。
- 保持 `call_deepseek_text()` 的输入输出契约不变。
- 为该场景补一条可重复执行的 shell 回归测试。

## 非目标

- 本次不裁剪 `git diff` 或缩短知识库总结 prompt。
- 本次不调整 `run_memory_sync_flow()` 的调用顺序。
- 本次不修改提交摘要 provider 流程。
- 本次不处理 DeepSeek API 的 token 或请求体大小限制。

## 背景

当前实现中，`call_deepseek_text()` 使用如下模式构造请求体：

```bash
jq -n --arg system_prompt "$system_prompt" --arg prompt "$prompt" '{...}'
```

当 `prompt` 包含大体积 `git diff` 时，shell 会在调用 `jq` 前就把整段文本展开为命令行参数。macOS 的参数长度有限，超过上限后会直接报：

```text
jq: Argument list too long
```

这属于本地进程启动阶段失败，不是 `jq` JSON 处理错误，也不是 DeepSeek API 远端返回错误。

## 方案对比

### 方案 A：改为从临时文件读取大文本并由 `jq` 组装 JSON

做法：

- 将 `system_prompt` 和 `prompt` 写入临时文件；
- 使用 `jq -Rs` 或 `--rawfile` 从文件读取文本；
- 由 `jq` 在进程内部生成原有 JSON 结构。

优点：

- 改动最小；
- 不影响现有调用方；
- 直接消除命令行参数过长问题；
- 返回值和请求格式可保持不变。

缺点：

- 引入临时文件清理逻辑。

### 方案 B：限制 prompt 大小

做法：

- 对 `git diff` 或最终 prompt 做截断；
- 只把部分上下文传给 DeepSeek。

优点：

- 可以顺带降低 token 消耗。

缺点：

- 会改变现有输入语义；
- 可能丢失关键信息；
- 不是这次用户选定的修法。

## 推荐方案

采用方案 A。

具体设计：

1. 在 `call_deepseek_text()` 内创建两个临时文件，分别保存 `system_prompt` 和 `prompt`。
2. 使用 `jq` 从文件读取原始文本并构造与现状一致的 JSON payload。
3. 为临时文件增加统一清理逻辑，确保函数成功或失败都不会遗留垃圾文件。
4. 其余网络请求、响应解析、空结果判定逻辑保持不变。

## 测试设计

新增一条 shell 测试，覆盖以下行为：

1. 构造一个远超命令行参数上限的大 `prompt`。
2. 通过覆盖 `curl` 命令，避免真实访问网络。
3. 调用 `call_deepseek_text()`。
4. 断言函数能成功返回解析结果，而不是在 `jq` 阶段报 `Argument list too long`。

该测试重点验证“超长 prompt 不再通过命令行参数传递”，不验证真实 DeepSeek 联通性。

## 风险与边界

- 修复后，如果请求体本身过大，仍可能被远端 API 或中间网络层拒绝；这不在本次修复范围内。
- 本次只修 `call_deepseek_text()`；`call_deepseek_for_commit_summary()` 仍保留现有实现，因为当前故障发生点不在该路径。
