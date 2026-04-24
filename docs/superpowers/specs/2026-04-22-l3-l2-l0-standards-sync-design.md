# L3/L2/L0 规范同步设计

## 摘要

基于本次 `gogogo` / memory / 提交摘要链路的连续修复，对 `L3#Standards`、`L2#Index`、`L0#Execution` 做最小必要同步。

本次只同步已经形成稳定事实的长期规则变化，不补写新的 `L4` 工作日志，不处理代码提交与工作区清理。

## 目标

- 将 `gogogo.sh 7` 的工作日志输出目标明确收敛到 `L4#Changelog`。
- 明确 `L5` 不承载这类持续追加型工作日志。
- 明确 `tmp/` 为本地临时目录，不纳入版本管理。
- 明确 `gogogo` 的 AI provider 在大上下文场景下必须做输入收敛。
- 同步 `L2` 索引与 `L0` 执行说明，使其与现状一致。

## 非目标

- 本次不新增或修改代码实现。
- 本次不重写 `L4` 工作日志。
- 本次不升级到 `L1#Overview` 项目总览层。
- 本次不对现有规范体系做大范围重组。

## 范围

优先更新已有文件，不新建不必要的新文件。

### L3

- `09.tool-01.gogogo.md`
- `10.ai-01.memory-02.usage.md`
- `10.ai-01.memory-03.skills.md`
- `04.quality-03.git.md`

### L2

- `toc.md`

### L0

- `README.md`

## 设计要点

### 1. gogogo 与 memory 规则收敛

在 `L3` 中明确：

- `gogogo.sh 7` 产生的“工作日志”属于 `L4#Changelog`；
- 这类日志应使用时间戳 + 主题命名；
- 保存后当前主流程直接结束，不再默认进入“打开文件” follow-up；
- memory / 提交摘要链路在大 diff 场景下必须先收敛上下文，再喂给 AI provider。

### 2. L5 定位澄清

在 `10.ai-01.memory-02.usage.md` 中明确：

- `L5` 用于系统关系、长期知识与结构认知；
- 不承载 `gogogo.sh 7` 这类持续追加型工作日志。

### 3. skill 源文件路径同步

在 `10.ai-01.memory-03.skills.md` 中确认当前 skill 源文件实际位于：

- `.ai/L0#Execution/skills/global/`
- `.ai/L0#Execution/skills/project/`

如果已有表述不够明确，则补强说明，不改动其总体分层口径。

### 4. Git / 临时目录治理

在 `04.quality-03.git.md` 中补充：

- `tmp/` 属于本地临时目录，不应纳入版本管理；
- `L4#Changelog` 工作日志文件命名采用 `YYYY-MM-DD-HHMM-主题.md`；
- 对大 diff 或大 prompt 的 AI 辅助链路，应优先做上下文收敛，避免 provider / 平台输入上限问题。

### 5. L2 索引入口同步

在 `toc.md` 中确保：

- 相关规则入口与现有文件保持一致；
- 其他层说明里不再暗示 `L5#Knowledge/recent-fix-summary.md` 是当前工作日志主路径。

### 6. L0 执行说明同步

在 `L0#Execution/README.md` 中补一条执行层事实：

- `skills/` 是项目内 skill 源文件目录；
- `gogogo` memory 流程当前以“终端预览 -> 保存 -> 结束”为主路径，而不是“保存后自动打开文件”。

## 风险与边界

- 本次只做规则同步，不保证把所有历史文档口径全部一次性统一完毕。
- 若发现某些 `L3` 规则之间仍有旧口径差异，本次只修与当前主路径直接相关的部分。
- `L4` 已有事实记录，因此本次不再额外追加工作日志，避免重复记述。
