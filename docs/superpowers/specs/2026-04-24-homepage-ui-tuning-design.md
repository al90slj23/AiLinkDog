# 首页 UI 轻度调优设计

## 当前状态与目标
当前主页 (`DefaultLandingPage`) 拥有完整的结构，包括 Hero、Providers、Capabilities、模型浏览、Quick Start 和 FAQ 模块。
它采用单独的 `home.css` 文件进行样式控制，支持暗色和亮色模式，并具备一定的滚动交互（`[data-ald-reveal]`）。

用户的需求是对现有主页进行**轻度 UI 调优 (Recommended)**，关注点在于"整个都看看"，包含排版、颜色对比度、间距等，并且倾向于保持现有的**纯 CSS** 方案进行修改。

## 调优策略 (UI Refinements)

由于是轻度调优，我们将重点改善以下几个方面的视觉体验：

### 1. 颜色对比度与层级 (Color & Hierarchy)
- **问题**: 在亮色/暗色模式下，部分次要文本 (muted text) 可能对比度过低，导致阅读困难。部分强调色 (primary orange/yellow) 在不同背景下可能不够鲜明。
- **调整**: 微调 `home.css` 中的全局变量。
  - 增强 `var(--ald-muted)` 在亮色/暗色下的可读性。
  - 优化 `var(--ald-border)` 颜色，使其更加柔和，不显得突兀。
  - 优化阴影效果 (`var(--ald-shadow)`)，使其更有层次感。

### 2. 空间与间距 (Spacing & Rhythm)
- **问题**: 当前使用固定的 `padding-left/right: 72px`，在不同屏幕尺寸下可能显得僵硬。某些区块的上下间距可能过紧或过松。
- **调整**:
  - 在大屏幕和超大屏幕上优化最大宽度 (`max-width`) 和居中。
  - 调整 Section 之间的垂直间距 (`padding-top/bottom`)，增加呼吸感。
  - 优化卡片 (Cards) 内部元素的间距。

### 3. 排版细节 (Typography)
- **问题**: 标题的行高 (line-height) 可能过大，导致多行标题看起来松散。某些字体的字重 (font-weight) 区分不够。
- **调整**:
  - 收紧大标题（如 Hero Section 的 h1）的 `line-height` 和 `letter-spacing`。
  - 确保次要文本和徽章 (badges) 的字体大小和对齐完美居中。

### 4. 交互反馈与动效 (Interaction & Animation)
- **问题**: Hover 状态的反馈可能不够明显或不够平滑。滚动出现的动效可能略显生硬。
- **调整**:
  - 优化 `a`, `button` 和卡片的 `:hover` 状态，添加平滑的 `transition`。
  - 微调 `[data-ald-reveal]` 的贝塞尔曲线 (cubic-bezier) 和持续时间，使滚动动画更柔和。

### 5. 各个区块的具体优化点

*   **导航栏 (Nav)**:
    *   增加轻微的底边阴影或更柔和的边框线。
    *   优化链接的 hover 颜色。
*   **Hero 区域 (Hero)**:
    *   增加主标题与副标题之间的层次感。
    *   优化 "开始接入" 按钮的视觉权重，使其更吸引点击。
*   **Trust 跑马灯 (Ticker & Proof)**:
    *   调整跑马灯的速度和渐隐边缘。
    *   优化供应商名称网格的间距和文字大小。
*   **特性展示卡片 (Capabilities)**:
    *   优化卡片的阴影和边框。
    *   调整卡片内 Icon 和文字的比例。

## 实施计划

1.  **备份**: 先备份当前的 `home.css`（虽然可通过 git 恢复）。
2.  **CSS 变量微调**: 更新 `home.css` 顶部的 `:root` (或 `.ald-home` / `.ald-home-dark`) 颜色、阴影变量。
3.  **排版与间距微调**: 修改排版属性（line-height, letter-spacing, padding, gap）。
4.  **交互增强**: 添加或优化 `:hover` 状态和 `transition`。
5.  **预览与验收**: 运行前端应用查看效果，确保亮色/暗色和移动端适配没有遭到破坏。

## 下一步

请确认此轻度 UI 调优设计是否符合您的期望？
如果符合，我将直接开始修改 `web/src/pages/Home/home.css` 文件来实施这些改进。