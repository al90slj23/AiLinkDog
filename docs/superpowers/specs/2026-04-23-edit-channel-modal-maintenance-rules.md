# EditChannelModal 维护规则

## 背景

`web/src/components/table/channels/modals/EditChannelModal.jsx` 已从单体大文件逐步拆分为“容器 + 区块组件 + hooks + helpers”的结构。

本规则用于约束后续维护时的落点，避免新改动再次把展示、状态、请求、纯计算重新混写回单文件。

## 当前结构

### 容器文件

- `web/src/components/table/channels/modals/EditChannelModal.jsx`

职责：

- 组织子组件与弹层骨架
- 组合 state/effects hooks
- 持有 refs
- 串联加载、确认、提交的主控制流

不应再新增：

- 大段表单 JSX
- 纯计算 helper
- 与具体区块强绑定的 UI 细节

### 区块组件

- `EditChannelModalCoreSection.jsx`
- `EditChannelModalPrimaryKeyInputSection.jsx`
- `EditChannelModalKeySection.jsx`
- `EditChannelModalModelSection.jsx`
- `EditChannelModalAdvancedSection.jsx`
- `EditChannelModalBehaviorSection.jsx`
- `EditChannelModalExtraSettingsSection.jsx`

职责：

- 只负责某一块表单展示与局部交互
- 通过 props 接收状态、文案和 handler
- 不直接承载跨区块流程控制

### hooks

- `useEditChannelModalState.js`
- `useEditChannelModalEffects.jsx`

职责：

- `State`：承载 `useState/useMemo`
- `Effects`：承载 `useEffect`

限制：

- `State` 不放远程请求
- `Effects` 不新增复杂业务 handler

### helpers

- `editChannelModalConstants.js`
- `editChannelModalDerived.js`
- `editChannelModalData.js`
- `editChannelModalLoadChannel.js`
- `editChannelModalLoadState.js`
- `editChannelModalSubmit.js`
- `editChannelModalSubmitValidation.js`
- `editChannelModalSubmitPreparation.js`
- `editChannelModalSubmitFlow.js`
- `editChannelModalUpstream.js`
- `editChannelModalParamOverride.js`
- `editChannelModalActions.js`

职责：

- 静态常量
- 纯计算
- 数据归一化
- payload 构造
- 提交前校验与准备
- 小型局部 action 的纯逻辑

## 维护落点规则

### 改 UI 时

- 优先落到对应 section 文件
- 如果改动只影响某一块表单，不要回写到容器文件

例如：

- 改主密钥输入：`EditChannelModalPrimaryKeyInputSection.jsx`
- 改模型相关配置：`EditChannelModalModelSection.jsx`
- 改高级请求配置：`EditChannelModalAdvancedSection.jsx`

### 改状态与派生值时

- 新增 `useState/useMemo` 优先放 `useEditChannelModalState.js`
- 不要把派生计算重新塞回主文件

### 改副作用时

- 新增或调整初始化/同步/cleanup 逻辑，优先放 `useEditChannelModalEffects.jsx`
- effect 里只做 effect 该做的事情，不顺带混入无关 helper

### 改接口返回处理时

- `loadChannel` 的响应归一化，优先改：
  - `editChannelModalLoadChannel.js`
  - `editChannelModalLoadState.js`

### 改提交链路时

- 最终 payload 结构：`editChannelModalSubmit.js`
- 提交前纯校验：`editChannelModalSubmitValidation.js`
- 提交前特殊渠道预处理：`editChannelModalSubmitPreparation.js`
- 提交前确认弹窗所需状态计算：`editChannelModalSubmitFlow.js`

### 改上游模型获取与映射选择时

- 优先改 `editChannelModalUpstream.js`

### 改参数覆盖时

- 优先改 `editChannelModalParamOverride.js`

### 改局部小动作时

- 如密钥去重、自定义模型合并，优先改 `editChannelModalActions.js`

## 禁止事项

- 不把大段 JSX 重新塞回 `EditChannelModal.jsx`
- 不把纯 helper 重新写回组件内部
- 不把状态定义、副作用、请求、纯计算混到同一新文件
- 不为了“少文件”把已经拆开的职责再合回单文件

## 后续重点观察文件

当前仍需重点关注的文件：

- `EditChannelModal.jsx`
- `EditChannelModalPrimaryKeyInputSection.jsx`
- `EditChannelModalAdvancedSection.jsx`

原因：

- 这三个文件最容易在后续迭代中再次膨胀

## 一句话原则

- UI 放 section
- 状态放 state hook
- 副作用放 effects hook
- 纯逻辑放 helper
- 容器只负责串联
