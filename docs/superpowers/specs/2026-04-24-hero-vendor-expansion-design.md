# Hero Vendor Expansion & Animation Design

## 背景与目标
用户希望在首屏机器人背后的提供商展示区（Vendor Layer）展示足够多的 AI 提供商，以突显平台（AiLinkDog）“无忧中转”、“接入所有模型”的核心价值。
当前的展示逻辑：
- 使用硬编码的数组 `providerItems`，共 20 个项目（包含一个 "128+"）。
- 使用 4 列网格（`grid-template-columns: repeat(4, 1fr)`）。
- 静态展示。

## 用户需求
1. **取消 "128+"**：不再将其作为一个卡片显示。
2. **大幅扩充供应商数量**：准备“现在两倍的量”（约 40 个甚至更多）的知名或长尾模型供应商名称。
3. **差异化与动态显示**：不应该仅仅是静态的一大块死板网格，应“根据浏览器的大小给到显示和补充”，也就是说可以在大屏幕上展示更多，或者通过动画实现无限滚动/轮播展示更多的内容，让各家视觉上不太一样。

## 方案设计 (Approaches)

### 方案 A：扩展静态网格 + 响应式隐藏
直接将 `providerItems` 扩充到 40 个。在 CSS 中使用媒体查询（Media Queries），大屏幕显示全部 40 个，中小屏幕通过 `nth-child` 隐藏超出部分的卡片，保持网格整洁。
- **优点**：实现极其简单。
- **缺点**：死板。40 个卡片铺在画面上可能过于密集，抢夺了主角（机器人）和文案的注意力。

### 方案 B：无限上下滚动（跑马灯 Columns）
将扩充后的 40 个供应商分成 3-4 列。每列使用 CSS 动画进行无限的垂直循环滚动（像老虎机一样）。每一列的速度或方向稍微错开，营造出一种庞大数据流（Data Stream）的感觉。背景部分加上遮罩（mask-image）实现上下边缘渐隐。
- **优点**：动态感强，极具科技感，完美契合“Aggregation Platform”的海量接入感。不会因为数量多而导致页面拥挤，因为可见区域是固定的。
- **缺点**：稍微复杂一点，需要写动画和调整 mask。

### 方案 C：随机气泡/粒子飘动
让 40 个供应商名称像粒子一样在机器人的背景层中随机飘动、放大缩小。
- **优点**：视觉非常独特。
- **缺点**：计算和渲染成本可能较高，容易与当前的 3D 机器人产生视觉冲突，显得凌乱。

## 推荐方案
强烈推荐 **方案 B (无限垂直滚动/Data Stream)**。
- 这不仅能无缝容纳 40+ 的提供商名单。
- 还能让这块“背景墙”活起来，与中间静静旋转的机器人形成动静结合的科技氛围。
- 我们可以在不同列应用不同的滚动速度，从而“让各家不太一样”，打破静态网格的死板。

## 方案 B 的具体设计

1. **数据扩充**：
   准备丰富的列表：
   `OpenAI`, `Claude`, `Gemini`, `DeepSeek`, `Qwen`, `Moonshot`, `GLM`, `Llama`, `Mistral`, `Cohere`, `Anthropic`, `Azure AI`, `Hunyuan`, `Minimax`, `Zhipu`, `Wenxin`, `Spark`, `Xinference`, `Grok`, `Perplexity`, `01.AI`, `Baichuan`, `SenseTime`, `StepFun`, `Ollama`, `vLLM`, `LocalAI`, `Together`, `AWS`, `Google Bedrock`, `HuggingFace`, `Replicate`, `Novita`, `Deep Infra`, `SiliconFlow`, `Lepton`, `Fireworks`, `Groq`, `SambaNova`, `xAI`. (共40个)

2. **DOM 结构调整**：
   在 `RobotVendorLayer` 中，将 40 个数据分为 4 组（每组 10 个）。
   渲染 4 个列容器（columns）。
   为了无限滚动无缝衔接，每组数据在内部渲染两遍（`[...group, ...group]`）。

3. **CSS 动画与样式**：
   - 容器加上 `mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);`，让上下边缘渐隐。
   - 定义 `@keyframes vendor-scroll` 实现从 `transform: translateY(0)` 到 `transform: translateY(-50%)` 的无缝循环。
   - 4 个列设置不同的 `animation-duration` (例如 25s, 35s, 30s, 40s) 以及不同的方向（有向上、有向下，或者全向下但错开速度）。
   - 保留现有的卡片样式（毛玻璃、边框发光等），它们在这个滚动流中依然会很好看。

## 总结
这个方案将把原本死板的 20 格背景网格，升级为一个极具动感的海量模型数据流背景，完美回应了你“足够多”、“不太一样”的需求。