# Vendor Animation Width Expansion

## 背景
之前我们实现了瀑布流供应商展示（4 列，每列滚动），但是用户反馈希望这个墙更宽：
> "我希望他更宽，如果从我的屏幕上看至少要右边可以再加一列，左边可以加两列。"

这意味着目前居中的 4 列在视觉上不够宽（被 `max-width: 700px;` 或 `repeat(4, 1fr)` 限制了）。
用户希望能扩展到 7 列（左加两列，右加一列，共 4 + 3 = 7 列），让“数据流”覆盖更宽的背景区域。

## 方案设计
目前的 4 列由 `providerItems` (40 个项目，分为 4 组，每组 10 个) 驱动。
要将其扩展为 7 列：
1. **数据分组调整**：将 `providerItems` (40项) 增加到 42 项或更多以被 7 整除（例如 42 项 / 7 列 = 每列 6 项，或者 49 项 / 7 列 = 每列 7 项）。
2. **React 结构更新** (`LandingHero.jsx`)：将数组切割为 7 个 columns。
3. **CSS 网格更新** (`home.css`)：
   - 将 `.ald-home-hero__robot-vendors` 的 `grid-template-columns` 从 `repeat(4, 1fr)` 改为 `repeat(7, 1fr)`。
   - 移除或增加 `max-width` 限制（当前是 `max-width: 700px;`），将其改为更大的值如 `max-width: 1100px;`，或者设置宽度比例（`width: 140%;`），并让左侧多偏移一点。
   - 补充 `.ald-home-vendor-col--[4-6]` 的动画时长与方向。

### 数据扩充建议 (49 项)
在原有 40 项基础上补充 9 项知名/开源厂商（例如：`Meta`, `Google`, `Stability AI`, `xAI`, `Kimi`, `Baichuan`, `Qwen`, `01.AI`, `DeepSeek` 等，允许部分复用或引入更多以满足视觉）。

### 实施细节
**1. LandingHero.jsx 修改：**
```javascript
const providerItems = [
  'OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Qwen', 'Moonshot', 'GLM', 'Llama',
  'Mistral', 'Cohere', 'Anthropic', 'Azure AI', 'Hunyuan', 'Minimax', 'Zhipu',
  'Wenxin', 'Spark', 'Xinference', 'Grok', 'Perplexity', '01.AI', 'Baichuan',
  'SenseTime', 'StepFun', 'Ollama', 'vLLM', 'LocalAI', 'Together', 'AWS',
  'Bedrock', 'HuggingFace', 'Replicate', 'Novita', 'Deep Infra', 'SiliconFlow',
  'Lepton', 'Fireworks', 'Groq', 'SambaNova', 'xAI', 'Stability AI', 'Baidu',
  'Alibaba', 'Tencent', 'ByteDance', 'NVIDIA', 'Meta', 'Google', 'Apple'
]; // 49 items
// ...
  const columns = [
    providerItems.slice(0, 7),
    providerItems.slice(7, 14),
    providerItems.slice(14, 21),
    providerItems.slice(21, 28),
    providerItems.slice(28, 35),
    providerItems.slice(35, 42),
    providerItems.slice(42, 49)
  ];
```

**2. home.css 修改：**
```css
.ald-home-hero__robot-vendors {
  /* ... */
  max-width: 1200px; /* Expand max width */
  width: 160%; /* Allow it to span wider than the grid cell */
  left: 40%; /* Shift slightly left to accommodate the "add two on left, one on right" feeling */
  grid-template-columns: repeat(7, 1fr);
  /* ... */
}

/* Add missing animation timings */
.ald-home-vendor-col--4 .ald-home-vendor-col__track {
  animation-duration: 42s;
  animation-direction: reverse;
}

.ald-home-vendor-col--5 .ald-home-vendor-col__track {
  animation-duration: 32s;
}

.ald-home-vendor-col--6 .ald-home-vendor-col__track {
  animation-duration: 48s;
}
```

这将会使瀑布流大幅变宽，成为真正的全屏背景墙。