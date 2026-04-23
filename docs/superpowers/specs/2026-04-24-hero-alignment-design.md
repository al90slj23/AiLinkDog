# Landing Hero 居中对齐设计

## 背景与目标
用户反馈当前首页首屏（Landing Hero）的第一行（包含左侧文案 `LandingHeroCopy` 和右侧 3D 机器人及供应块 `RobotVendorLayer`）的对齐方式不够平衡。
目标是实现**双列分别居中**的布局效果：
1. **左侧文案列 (`LandingHeroCopy`)**：在其占据的左侧栅格容器内实现水平和垂直居中。
2. **右侧机器列 (`HeroRobotScene / RobotVendorLayer`)**：在其占据的右侧栅格容器内实现水平和垂直居中。

## 当前架构与问题分析
当前首屏第一行的 DOM 结构主要由 `LandingHero.jsx` 中的 `.ald-home-hero__row--primary` 驱动：
```css
.ald-home-hero__row--primary {
  grid-template-columns: minmax(520px, 0.92fr) minmax(620px, 1.08fr);
  /* 默认为 stretch 或顶部对齐，未强制居中 */
}
```
左侧文案是在 `div.ald-home-hero__primary-copy` 中，由于没有 `display: flex` 和 `align-items: center`，内容默认偏上对齐，且文本默认为左对齐（或未强制水平居中）。
右侧机器人在 `div.ald-home-hero__primary-robot` 或通过背景层定位（目前机器人在 `div.ald-home-hero__primary-background` 中脱离了标准网格流）。

**修复重点：**
我们需要调整 `.ald-home-hero__row--primary` 的网格对齐，并让左右子容器内的内容也居中。

## 设计方案 (CSS 调整)

### 1. 结构与对齐 (Grid Alignment)
修改 `home.css` 中的网格属性：
- 确保 `.ald-home-hero__row--primary` 使用 `align-items: center`，让左右两列在垂直方向上居中。

### 2. 左侧文案列居中 (Left Column - Copy)
- 修改 `.ald-home-hero__primary-copy` 或其内部元素的样式，使其内容水平居中。
- 这包括调整文字对齐 (`text-align: center`)，以及按钮组 (`.ald-home-hero__actions`) 的水平居中 (`justify-content: center`)。

### 3. 右侧机器人居中 (Right Column - Robot & Vendors)
- 机器人和供应块目前是通过 `.ald-home-hero__robot-vendors` 绝对定位 (`absolute`) 实现的。
- 我们需要检查并调整 `home.css` 中关于 `.ald-home-hero__robot-vendors` 和 `.ald-home-hero__primary-background` 的定位逻辑，确保其中心点与右列的中心点对齐。
- 由于之前机器人是在背景层，我们可能需要微调 `top`, `bottom` 的间距，或者将其改为 Flex/Grid 的居中布局，确保它视觉上稳定居于右侧。

## 方案权衡
- **方案 A（推荐）：纯 CSS 调整。** 不修改 JSX 结构，只通过 `home.css` 调整 `align-items`, `justify-content` 和 `text-align`。这符合之前“轻度 UI 调优”的原则。
- **方案 B：重构 DOM 结构。** 把绝对定位的机器人移入标准网格布局中。这会导致改动较大，风险较高。

因此，建议采用**方案 A**。

## 实施范围
主要修改 `web/src/pages/Home/home.css`，针对桌面端 (`@media (min-width: 1024px)`) 的 `.ald-home-hero__row--primary` 及相关子元素进行居中调优。