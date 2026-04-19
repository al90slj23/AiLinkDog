# AppDropdownMenu 设计

## 概述

当前项目在 `React.StrictMode` 下使用 `Semi UI Dropdown` 时，会通过内部 `Tooltip / Trigger / Button` 链路持续触发 `findDOMNode` 弃用警告。语言切换和用户菜单已经证明，这不是单个业务组件写法问题，而是第三方组件链在当前技术栈下的兼容性问题。

为避免继续在每个业务文件中手写替代逻辑，本次设计引入一个项目级基础组件 `AppDropdownMenu`，用于统一承接这类“按钮触发 + 浮层菜单”交互。

## 目标

- 提供一个项目内可复用的基础下拉菜单组件。
- 保留当前用户可见样式和交互习惯尽量不变。
- 避免 `Semi UI Dropdown` 在 `React.StrictMode` 下触发 `findDOMNode` 警告。
- 先覆盖头部栏典型场景，再为后续全站替换提供基础设施。

## 非目标

- 不重构全站所有弹层组件。
- 不替代 `Semi UI` 的全部弹出层能力。
- 不在这一轮引入复杂的键盘导航系统或无关动画系统。

## 组件定位

新增基础组件：

- `web/src/components/common/menu/AppDropdownMenu.jsx`

它不是一个通用布局容器，而是一个“轻量、可复用、面向当前项目菜单交互”的基础组件。

## 交互要求

- 支持受控的展开/收起。
- 点击触发器展开。
- 点击菜单项后关闭。
- 点击外部关闭。
- 按 `Esc` 关闭。
- 支持基础定位：`bottomRight` / `bottomLeft`。
- 支持当前活跃项高亮。

## API 方向

建议采用配置数组驱动，而不是继续在每个业务组件里硬编码菜单结构。

示意：

```jsx
<AppDropdownMenu
  position='bottomRight'
  trigger={<Button ... />}
  items={[
    { key: 'zh-CN', label: '简体中文', active: true, onClick: ... },
    { key: 'en', label: 'English', onClick: ... },
  ]}
/>
```

## 第一批替换范围

第一批先替换头部栏中最典型、最容易触发 warning 的场景：

- `web/src/components/layout/headerbar/LanguageSelector.jsx`
- `web/src/components/layout/headerbar/UserArea.jsx`
- `web/src/components/layout/headerbar/ThemeToggle.jsx`
- `web/src/components/layout/headerbar/NewYearButton.jsx`

## 注释要求

在基础组件实现中必须明确写注释，说明：

- 项目为什么不直接使用 `Semi UI Dropdown`；
- 根因是 `React 18 StrictMode` 下的 `findDOMNode` 警告；
- 这是一个兼容性替代方案，而不是视觉重构。

## 规范落地

该原则需要写入 `.ai` 开发规范文档：

- 当前项目保留 `React.StrictMode`；
- 当第三方 UI 组件链在 `StrictMode` 下持续触发已知弃用警告，且升级后仍未解决时，应优先抽象项目内基础组件替代，而不是在业务文件里零散手写。

## 验证目标

- `AppDropdownMenu` 新增完成。
- 头部栏四个菜单场景完成迁移。
- `bun run build` 通过。
- 与这些头部栏菜单相关的 `findDOMNode` warning 消失。
- `.ai` 规范文档已记录该策略。
