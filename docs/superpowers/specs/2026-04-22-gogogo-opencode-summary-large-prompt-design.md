# gogogo OpenCode 摘要大 Prompt 修复设计

## 摘要

修复 `gogogo.sh` 在 GitHub 提交流程中使用 `OpenCode` 生成提交摘要时，因 `call_opencode_for_commit_summary()` 直接通过命令行参数传递超长 prompt 而触发 `Argument list too long`，并导致后续出现空白“当前提交摘要”的问题。

本次只调整提交摘要生成链路中的 OpenCode provider 调用方式与失败兜底，不改变 memory 同步流程、提交流程主结构、摘要确认交互样式和本地 fallback 摘要逻辑。

## 目标

- 避免 `OpenCode` provider 通过命令行参数接收超长 prompt。
- 当摘要生成失败时，不再进入空白的摘要确认菜单。
- 保持 OpenCode provider 的正常输出契约仍为：

```text
TITLE: ...
BODY:
...
```

## 非目标

- 本次不调整 `DeepSeek` provider。
- 本次不修改 `git add`、`git commit`、push、PR 逻辑。
- 本次不改变摘要确认菜单的交互结构。
- 本次不收敛提交摘要 prompt 的内容规模，只修正传递方式与失败兜底。

## 背景

当前 OpenCode 摘要 provider 的实现是：

```bash
prompt="$(build_commit_summary_prompt ...)"
content="$(opencode run "$prompt" </dev/null)"
```

这意味着完整 prompt 会作为命令行参数传递给 `opencode`。在当前工作区 diff 很大时，会再次触发本地系统参数上限，报：

```text
opencode: Argument list too long
```

之后 `get_confirmed_commit_summary()` 仍继续把空的 `initial_summary` 传给 `confirm_or_edit_commit_summary()`，于是用户会看到一个空白的：

```text
当前提交摘要：
```

因此这是两个串联问题：

1. provider 输入方式错误；
2. provider 失败后的空值保护缺失。

## 方案对比

### 方案 A：通过 stdin 向 `opencode run` 提供 prompt

做法：

- 生成 prompt 后写入临时文件或直接通过 stdin 传入；
- 不再把完整 prompt 作为命令行参数；
- 继续读取 `opencode run` 的标准输出。

优点：

- 改动最小；
- 直接解决本地参数长度问题；
- 不改变 prompt 内容和输出格式要求。

缺点：

- 需要补充临时文件或管道处理逻辑。

### 方案 B：缩短提交摘要 prompt

做法：

- 对 commit summary 的 diff 上下文做截断。

优点：

- 进一步降低 provider 输入规模。

缺点：

- 改变摘要输入语义；
- 不是本次最小修复路径。

## 推荐方案

采用方案 A，并同时补上空摘要保护。

## 设计细节

1. `call_opencode_for_commit_summary()`：
   - 生成 prompt 后，不再使用 `opencode run "$prompt"`；
   - 改为将 prompt 写入临时文件，再通过 stdin 喂给 `opencode run`。
2. `get_confirmed_commit_summary()`：
   - 若 `initial_summary` 为空，则直接报错并返回；
   - 不进入 `confirm_or_edit_commit_summary()`。
3. 其余 provider 路由和摘要归一化逻辑不变。

## 测试设计

新增或补充 shell 回归测试，覆盖：

1. 超长 prompt 传给 OpenCode provider 时，不再因命令行参数过长失败。
2. 当 provider 失败或返回空摘要时，不会进入空白确认菜单。

## 风险与边界

- 修复后如果 `opencode` 自身不支持从 stdin 正常读取输入，还需根据实际 CLI 能力微调调用方式；本次先按最小假设设计。
- 本次不处理 `call_deepseek_text()` 在 `zsh` 下的 `trap RETURN` 兼容性提示，那是另一条独立问题。
