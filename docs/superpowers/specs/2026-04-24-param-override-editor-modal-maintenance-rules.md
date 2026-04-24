# ParamOverrideEditorModal 维护规则

## 背景

`web/src/components/table/channels/modals/ParamOverrideEditorModal.jsx` 已从单体大文件逐步拆分为“容器 + 区块组件 + hooks + helpers”的结构。

本规则用于约束后续维护时的落点，避免新改动再次把展示、状态、纯计算、局部 action 重新混写回单文件。

## 当前结构

### 容器文件

- `web/src/components/table/channels/modals/ParamOverrideEditorModal.jsx`

职责：

- 组织主弹层骨架
- 组合 state/effects hooks
- 串联 visual/json 两种编辑模式的主流程
- 组合各 section、辅助弹窗与保存流程

不应再新增：

- 大段表单 JSX
- 纯计算 helper
- 与某一个 section 强绑定的局部 UI 细节
- 可独立测试的 CRUD 纯逻辑

### 区块组件

- `ParamOverrideEditorModalOperationsSidebarSection.jsx`
- `ParamOverrideEditorModalLegacySection.jsx`
- `ParamOverrideEditorModalJsonSection.jsx`
- `ParamOverrideEditorModalOperationHeaderSection.jsx`
- `ParamOverrideEditorModalValueEditorSection.jsx`
- `ParamOverrideEditorModalReturnErrorSection.jsx`
- `ParamOverrideEditorModalPruneObjectsSection.jsx`
- `ParamOverrideEditorModalSyncFieldsSection.jsx`
- `ParamOverrideEditorModalBasicValueSection.jsx`
- `ParamOverrideEditorModalConditionsSection.jsx`
- `ParamOverrideEditorModalHeaderValueExampleModal.jsx`
- `ParamOverrideEditorModalFieldGuideModal.jsx`

职责：

- 只负责某一块展示与局部交互
- 通过 props 接收状态、文案和 handler
- 不直接承载跨区块主流程控制

### hooks

- `useParamOverrideEditorModalState.js`
- `useParamOverrideEditorModalEffects.jsx`

职责：

- `State`：承载 `useState/useMemo`
- `Effects`：承载 `useEffect`

限制：

- `State` 不放远程请求
- `Effects` 不新增复杂业务 handler
- effect 只做初始化、同步、纠偏与 cleanup

### helpers

- `paramOverrideEditorModalConstants.js`
- `paramOverrideEditorModalDerived.js`
- `paramOverrideEditorModalData.js`
- `paramOverrideEditorModalValidation.js`
- `paramOverrideEditorModalActions.js`

职责：

- 静态常量
- 纯计算
- 数据归一化
- parse / serialize / payload 构造
- 纯校验逻辑
- CRUD 类局部 action 的纯结果计算

## 维护落点规则

### 改 UI 时

- 优先落到对应 section 文件
- 如果改动只影响某一个模式分支，不要回写到容器文件

例如：

- 改左侧规则导航：`ParamOverrideEditorModalOperationsSidebarSection.jsx`
- 改规则头部：`ParamOverrideEditorModalOperationHeaderSection.jsx`
- 改 `return_error`：`ParamOverrideEditorModalReturnErrorSection.jsx`
- 改 `prune_objects`：`ParamOverrideEditorModalPruneObjectsSection.jsx`
- 改 `sync_fields`：`ParamOverrideEditorModalSyncFieldsSection.jsx`
- 改普通值编辑：`ParamOverrideEditorModalBasicValueSection.jsx`
- 改条件编辑：`ParamOverrideEditorModalConditionsSection.jsx`

### 改状态与派生值时

- 新增 `useState/useMemo` 优先放 `useParamOverrideEditorModalState.js`
- 不要把派生计算重新塞回主文件

### 改副作用时

- 新增或调整初始化/同步/cleanup 逻辑，优先放 `useParamOverrideEditorModalEffects.jsx`
- effect 内只做 effect 应做的事情，不顺带混入无关 helper

### 改数据 parse / normalize / serialize 时

- 优先改 `paramOverrideEditorModalData.js`
- 如果是 value 文本与 draft 的双向转换，也优先改这里

### 改校验逻辑时

- operations 的纯校验，优先改 `paramOverrideEditorModalValidation.js`

### 改局部 CRUD action 时

- operation / condition 的纯结果计算，优先改 `paramOverrideEditorModalActions.js`
- 不要把这类纯列表变换直接重新写回容器文件

### 改模板与静态示例时

- 优先改 `paramOverrideEditorModalConstants.js`

### 改字段提示、label、placeholder、summary 时

- 优先改 `paramOverrideEditorModalDerived.js`

## 禁止事项

- 不把大段 JSX 重新塞回 `ParamOverrideEditorModal.jsx`
- 不把纯 helper 重新写回组件内部
- 不把状态定义、副作用、纯计算、CRUD 结果计算混到同一新文件
- 不为了“少文件”把已经拆开的 mode section 再合回单文件

## 后续重点观察文件

当前仍需重点关注的文件：

- `ParamOverrideEditorModal.jsx`
- `paramOverrideEditorModalData.js`
- `ParamOverrideEditorModalPruneObjectsSection.jsx`

原因：

- `ParamOverrideEditorModal.jsx` 仍承担主流程串联与部分 action 协调
- `paramOverrideEditorModalData.js` 仍集中了承担较多 parse/serialize 逻辑
- `ParamOverrideEditorModalPruneObjectsSection.jsx` 是当前最复杂的单个 mode section

## 一句话原则

- UI 放 section
- 状态放 state hook
- 副作用放 effects hook
- 纯逻辑放 helper
- 容器只负责串联
