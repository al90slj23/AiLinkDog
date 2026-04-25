# UpstreamTracking 产品化重构与工作树收口

## 背景

本次任务围绕 `web/src/components/upstreamtracking/UpstreamTrackingPage.jsx` 与对应后端 `upstreamtracking` 资源，目标是将原本偏技术治理台表达的页面，重构为更贴近维护决策的“上游更新评估页”，并在完成后将相关工作树与本地分支收口清理。

## 本次实际改动

### 页面与信息架构

- 将 `upstreamtracking` 页面稳定收敛为 3 个标签页：
  - `分析概览`
  - `分析历史`
  - `分析配置`
- `分析概览` 改为围绕“当前跟随基线 / 本次更新摘要 / 合并建议”组织。
- `分析历史` 改为围绕“执行记录列表 + 执行记录详情 + 从属事项 + 证据链”组织。
- `分析配置` 保留“当前使用中配置 + 编辑配置”双段结构，并将业务字段前置、高级分析配置后置。

### 后端聚合与分析输出

- 新增页面聚合接口：`GET /api/upstreamtracking/page`
- 新增历史详情聚合接口：`GET /api/upstreamtracking/cycles/:id/detail`
- 服务层分析结果收敛为产品化字段，包括：
  - `updateSummary`
  - `hasSimilarLocalWork`
  - `localWorkSummary`
  - `shouldMerge`
  - `mergeReason`
  - `mergeStrategy`
  - `mergePlanSummary`
  - `targetFiles`
  - `targetAreas`
  - `riskSummary`
- controller 聚合层改为消费 `analysis_response` 中的产品字段，而不是只靠 `cycle` 表基础字段。

### 降级与失败场景

- compare 缺失时允许降级继续分析，并把降级信息写入 `riskSummary`。
- 远程 `.ai` 记忆读取失败时优先回退本地 `.ai`。
- 模型输出缺字段时在服务层做默认值归一化。
- 分析失败时保留失败记录，不再误导为“后端接口未加载”。

### 正确性修复

- 修复了时间戳毫秒/秒展示口径问题。
- 修复了历史周期详情无法恢复产品化字段的问题。
- 修复了同一周期重复执行分析时，旧 `analysis_response` 与旧证据链会污染新结果的问题；现在同周期重跑前会替换旧的同类上下文，再写入新上下文。

### 体验打磨

- 执行记录详情拆分为更清晰的结论摘要、合并建议、决策与操作、从属事项、证据链分区。
- 证据链增加了类型优先级、中文标签、阅读建议与分组展示。
- 执行记录列表增加了当前选中态提示。
- 配置页补充了 Base URL、Token、分析范围、启用开关的用途说明。

## 验证

本次收口过程中，重复执行并通过了以下关键验证：

```bash
go test ./service ./router ./controller -run 'TestUpstreamTrackingRoutesExist|TestGetUpstreamTrackingPageData|TestGetUpstreamTrackingCycleDetailReturnsProductFields|TestRunUpstreamTrackingAnalysisBuildsProductResult|TestRunUpstreamTrackingAnalysisFallsBackWhenMemoryFetchFails|TestRunUpstreamTrackingAnalysisNormalizesMissingFields|TestRunUpstreamTrackingAnalysisReplacesExistingContextsOnRerun' -count=1
```

```bash
cd web && bun run build
```

同时，首页 Hero 相关残留改动单独补充测试并提交，包括：

- `feat(home): expand hero snippets and align component tests`
- `test: cover upstreamtracking sidebar visibility`

## 工作树与分支收口

- 已删除 worktree：`.worktrees/upstreamtracking`
- 已删除本地分支：`feature/upstreamtracking`
- 当前主工作区已确认不存在 `upstreamtracking` 业务源码残留脏状态

## 边界与未做事项

- 本次没有继续扩展新的调度系统或自动合并逻辑。
- 本次没有将所有 UI 进一步拆成更多子组件文件，而是在现有页面文件中做了产品化重构与局部整理。
- 当前仍存在前端构建级别的非阻断 warning，例如：
  - `Browserslist` 数据过旧
  - `lottie-web` 的 `eval` warning
  - chunk size 过大 warning
  这些未在本次任务中处理。

## 结论

本次 `upstreamtracking` 已完成一轮可交付的产品化重构，并完成主工作区收口与 worktree 清理。后续若继续演进，更适合进入新的独立任务，而不是继续沿用本次收尾上下文追加大改。
