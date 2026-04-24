# ParamOverrideEditorModal 大文件拆分与维护规则落地

## 背景

本次任务起点是 `web/src/components/table/channels/modals/ParamOverrideEditorModal.jsx` 单文件规模达到 `3511` 行，已经明显超出日常维护可读性边界。

用户的目标不是只做口头分析，而是先确认当前仓库里关于大文件拆分与命名的既有规范，再按该规范实际落地拆分，并最终形成可长期维护的结构。

在拆分前，先对齐了仓库内已有的 `EditChannelModal` 维护规则与当前 `modals/` 目录命名风格，确定后续应统一遵循：

- 容器文件保留主组件名
- Section 组件使用 `PascalCase + Section.jsx`
- hooks 使用 `useXxx...`
- helpers 使用 `camelCase` 前缀收口纯逻辑

## 实际改动

本轮对 `ParamOverrideEditorModal` 做了多轮渐进式拆分，而不是一次性粗暴切文件。

### 1. 先抽离纯逻辑与独立弹窗

优先抽出了最稳定、最适合独立测试的部分：

- `paramOverrideEditorModalConstants.js`
- `paramOverrideEditorModalDerived.js`
- `paramOverrideEditorModalData.js`
- `paramOverrideEditorModalValidation.js`
- `ParamOverrideEditorModalHeaderValueExampleModal.jsx`
- `ParamOverrideEditorModalFieldGuideModal.jsx`

这一步的目标是先让主文件摆脱：

- 静态模板与 options 常量
- label / placeholder / summary 这类纯派生逻辑
- parse / normalize / serialize 数据逻辑
- operation 校验逻辑
- 两个完全独立的辅助弹窗

同时新增了 `paramOverrideEditorModalHelpers.test.js`，用于锁定 helper 层行为。

### 2. 再把明显独立的 UI 区块抽成 section

随后继续把结构边界最清楚的 UI 区块抽离为：

- `ParamOverrideEditorModalOperationsSidebarSection.jsx`
- `ParamOverrideEditorModalLegacySection.jsx`
- `ParamOverrideEditorModalJsonSection.jsx`
- `ParamOverrideEditorModalOperationHeaderSection.jsx`
- `ParamOverrideEditorModalConditionsSection.jsx`

这一步重点让主文件不再承载：

- 左侧规则导航与拖拽列表展示
- legacy JSON 编辑区
- JSON 文本编辑区
- 规则头部信息编辑区
- conditions 折叠与编辑区

### 3. 把右侧值编辑区按 mode 分支继续拆细

`ParamOverrideEditorModalValueEditorSection.jsx` 原本仍然承担大量模式分支逻辑，因此继续拆成：

- `ParamOverrideEditorModalReturnErrorSection.jsx`
- `ParamOverrideEditorModalPruneObjectsSection.jsx`
- `ParamOverrideEditorModalSyncFieldsSection.jsx`
- `ParamOverrideEditorModalBasicValueSection.jsx`

拆完后，`ParamOverrideEditorModalValueEditorSection.jsx` 不再承担大段模式分支 JSX，而是变成纯组合器。

### 4. 把 state / effects hook 收口

为对齐仓库里 `EditChannelModal` 的维护模式，又继续拆出：

- `useParamOverrideEditorModalState.js`
- `useParamOverrideEditorModalEffects.jsx`

其中：

- `State` 负责 `useState/useMemo`
- `Effects` 负责初始化、同步与纠偏型 `useEffect`

这样主文件进一步从“巨型组件”转向“容器 + 编排器”。

### 5. 把 CRUD 类 action 下沉成 helper

在前面结构稳定后，又抽出了：

- `paramOverrideEditorModalActions.js`

并把以下最清晰的 CRUD 类 action 从容器中下沉：

- operation patch
- operation add/remove
- condition add/update/remove

同时补了：

- `paramOverrideEditorModalActions.test.js`
- `paramOverrideEditorModalSections.test.js`

用于覆盖这轮拆分新增的 section / hook / action 文件边界。

### 6. 补了一份模块级维护规则文档

本次改动不只停留在实现层，还新增了一份模块级维护规则：

- `docs/superpowers/specs/2026-04-24-param-override-editor-modal-maintenance-rules.md`

其目的不是再做一次泛泛总结，而是明确以后：

- 改 UI 应该落在哪些 section
- 改状态与副作用应该落到哪两个 hook
- 改纯逻辑 / 校验 / CRUD 纯动作时应该落到哪个 helper

## 验证与排障

本轮拆分过程中没有只靠静态判断结束，而是每一轮都做了最小测试和构建验证。

实际执行过的验证包括：

- `bun test ./src/components/table/channels/modals/paramOverrideEditorModalHelpers.test.js`
- `bun test ./src/components/table/channels/modals/paramOverrideEditorModalSections.test.js`
- `bun test ./src/components/table/channels/modals/paramOverrideEditorModalActions.test.js`
- `bunx eslint "src/components/table/channels/modals/ParamOverrideEditorModal*.{js,jsx}" "src/components/table/channels/modals/useParamOverrideEditorModal*.{js,jsx}" "src/components/table/channels/modals/paramOverrideEditorModal*.js"`
- `bun run build`

过程中还定位并修复了两个真实问题：

1. 新拆 helper 如果直接依赖聚合 helper 入口，会在 Bun 测试里间接拉入浏览器环境依赖；因此改为只保留当前模块真正需要的最小 JSON 校验能力。
2. action 测试在补写过程中出现了测试自身参数遗漏与重复声明问题，均已修正并复跑通过。

最终结果是：

- helper / section / action 测试通过
- ESLint 通过
- 前端构建通过

## 当前结构结果

当前 `ParamOverrideEditorModal` 相关结构已经收敛为：

- 容器：`ParamOverrideEditorModal.jsx`
- hooks：`useParamOverrideEditorModalState.js`、`useParamOverrideEditorModalEffects.jsx`
- sections / modal：多文件分块
- helpers：constants / derived / data / validation / actions
- tests：helpers / sections / actions

主文件行数从最初的 `3511` 行收敛到 `918` 行。

最新主要文件规模大致为：

- `ParamOverrideEditorModal.jsx`：918 行
- `paramOverrideEditorModalData.js`：463 行
- `paramOverrideEditorModalConstants.js`：381 行
- `ParamOverrideEditorModalPruneObjectsSection.jsx`：224 行

这意味着当前剩余较大的文件，已经不再是“单体混杂 UI 文件”，而是：

- 容器流程控制文件
- 数据转换逻辑文件
- 个别复杂 mode section

## 关键判断与边界

本次拆分过程中，有几个明确判断：

1. 当前阶段不再继续为了“更小”而机械拆分所有文件。
2. 继续往下做的收益已经明显下降，后续如果还要继续优化，应该优先考虑：
   - `paramOverrideEditorModalData.js` 的 parse / normalize / serialize 再拆分
   - `ParamOverrideEditorModal.jsx` 中剩余流程 action 的继续下沉
3. 这些后续动作已经属于“进一步重构”，不再是当前任务的必要范围。

## 最终结果

本次任务已经完成以下目标：

- 确认仓库内大文件拆分与命名的既有规范
- 按该规范实际拆分 `ParamOverrideEditorModal`
- 完成多轮渐进式结构收敛
- 保证测试、lint、build 全部通过
- 补充模块级维护规则文档
- 补写本次 `L4` 工作日志，形成完成态记录

当前可以把 `ParamOverrideEditorModal` 视为已从“不可持续维护的大单体文件”收敛为“可长期维护的容器 + hooks + sections + helpers”结构。
