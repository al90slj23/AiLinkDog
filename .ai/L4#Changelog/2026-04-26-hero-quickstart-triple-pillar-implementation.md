# 2026-04-26 首页 Quickstart 三发光柱设计实现

## 任务背景
之前的任务计划中提到了将 Quick Start 的三个模块（Core Metrics, Quick Start, Enterprise）改为平行排列的三根“发光柱”设计，但在后续验证中发现该改动其实未能在先前的提交中成功落地（可能由于代码被覆盖或由于某些问题未能真正提交 `home.css` 和 `LandingQuickStart.jsx` 的更改）。
本次任务重新并彻底地落实了此项 UI 改进。

## 实际改动内容
1. 修改了 `web/src/pages/Home/components/LandingQuickStart.jsx`:
   - 将原来横排显示 metric/step 的简单设计替换为沿带有 `ald-home-hero__timeline-glow` 的线垂直排列的 `timeline-item`。
   - 三个栏目统一采用了 timeline 布局形式以呈现发光柱风格。
   - `features` 从表情符号改为 SVG 图标，提高科技感。
   - 核心指标添加了闪烁的 dot 以及专属的大字体显示样式 `ald-home-hero__metric-value`。
2. 修改了 `web/src/pages/Home/home.css`:
   - 增加了脉冲圆点效果 `.ald-home-hero__timeline-dot--pulse::after`。
   - 增加了指标数值的特殊渐变大号数字样式 `.ald-home-hero__metric-value` 及其暗色模式。
   - 调整了 Timeline Dot 中的 SVG 颜色。

## 关键判断与边界
- 这是一个纯 UI 调整和完善动作，只修改了具体的首页 React 组件及其配套 CSS，不涉及持久化状态、全局共享规则或其他页面。
- 确认了 `web/src/pages/Home/home.css` 行数已达 2288 行。目前尚可控，如果后续还有大量的独立组件（比如 Quickstart 部分），可考虑按组件拆分 CSS。但当前本次只做少量类名追加，不做大重构。

## 最终结果
UI 的 "Triple Glowing Pillar"（三平行发光柱/时间轴）设计已在代码中被正确地加入并提交到 `main` 分支。

