# Vendor Animation Size Refinement

## 背景
用户在上次的修改（瀑布流动画和列数自适应扩展）后，提出了新的视觉调整需求：
> "背后的供应块现在做如下调整，块本身长宽都 x2，这样数量会少很多，不管是行列还是数量都少，减少浏览器 GPU 占用，另外所有块的左右也是居中，就是在右半边屏幕居中。当然机器人不管是针对是右半屏幕还是背后的供应块列，也都是居中的。"

**核心需求：**
1. **块尺寸翻倍 (x2)**：之前大约是 `min-height: 56px`，宽度依据列数自适应（大约 130px）。如果长宽翻倍，块会变得非常大（比如高度 ~112px，宽度更大），这会自动导致在相同的屏幕宽度下，能渲染的列数大幅减少，从而减少总数量和 GPU 开销。
2. **整体区域在右半屏幕绝对居中**：在右边网格列 (`.ald-home-hero__primary-robot`) 内，背景块（Vendor Tracks）和机器人都要完全居中。因为之前我们将 vendor container 的宽度设置为了 100% 并且使用了 flex 布局，我们要确保调整后依然稳定在中心。

## 分析与方案

### 1. 块尺寸翻倍 (x2)
我们需要修改 `.ald-home-hero__robot-vendors .ald-home-proof__item`：
- 原来是 `min-height: 56px; padding: 12px 16px; font-size: 13px; border-radius: 14px;`。
- 修改后（近似翻倍，或根据美观度稍微放大以避免畸形）：
  - `min-height: 112px;`
  - `padding: 24px 32px;`
  - `font-size: 24px;` (原为 13px)
  - `border-radius: 24px;` (原为 14px)
- 在 `LandingHero.jsx` 中的列宽计算：原来预估一个块宽 + gap 是 146px，翻倍的话，预估宽度需要更新为 `292px` (大约 300px)。
- `gap: 16px;` 可以放大到 `gap: 32px;`。
- `padding-bottom: 16px;` (用于动画补偿) 也需要同步放大到 `padding-bottom: 32px;`。

### 2. GPU 开销与数量控制
因为块的宽度变成了原来的两倍，`Math.floor(width / colWidth)` 算出来的列数会自动减半。
例如原来右边 600px 可以放 4 列，现在 600px 只能放 2 列。
每列需要展示的项目：之前是 12 个，为了确保能填满屏幕高度，可以保留或者稍微减少（比如 8-10 个）。因为高度也翻倍了，8个项目（每个 112px + 32px = 144px）总高超过 1100px，足够覆盖 700px 的区域。

### 3. 右半屏幕绝对居中
目前 `.ald-home-hero__robot-vendors` 设置了 `width: 100%; display: flex; justify-content: center;`。
为了确保在任何情况下（无论奇数偶数列表）都完美居中：
- 只要父容器 `.ald-home-hero__robot-layer` 完美覆盖右半格，并且 `.ald-home-hero__robot-vendors` 设置为 `width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;`，那么跑马灯就会在右半部分居中。
- 机器人 `.ald-home-robot-bg__scene` 也是 `justify-content: center; align-items: stretch;`，这保证了机器人在右半部分绝对居中。

## 实施计划

**1. 修改 `LandingHero.jsx` (调整宽度预估)**
```javascript
    const updateColumns = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      // Assume each column is roughly 260px wide + 32px gap = 292px (was 146)
      const colWidth = 292;
      const numCols = Math.max(1, Math.floor(width / colWidth));
      
      const newCols = Array.from({ length: numCols }, (_, colIndex) => {
        const shuffled = [...providerItems].sort(() => Math.random() - 0.5);
        const subset = shuffled.slice(0, 10); // Take 10 items (enough for 2x height)
        return subset.map(item => ({
          name: item,
          colorIndex: Math.floor(Math.random() * 3)
        }));
      });
      setColumns(newCols);
    };
```

**2. 修改 `home.css` (尺寸翻倍)**
```css
.ald-home-hero__robot-vendors {
  /* ... */
  display: flex;
  justify-content: center;
  align-items: center; /* Add this to ensure vertical centering if content doesn't fill */
  gap: 32px; /* Was 16px */
  /* ... */
}

.ald-home-vendor-col__track {
  display: flex;
  flex-direction: column;
  gap: 32px; /* Was 16px */
  padding-bottom: 32px; /* Was 16px */
  /* ... */
}

.ald-home-hero__robot-vendors .ald-home-proof__item {
  position: relative;
  min-height: 112px; /* Was 56px */
  min-width: 220px; /* Force a reasonable min width to look balanced */
  flex-shrink: 0;
  padding: 24px 32px; /* Was 12px 16px */
  /* ... */
  font-size: 24px; /* Was 13px */
  /* ... */
  border-radius: 24px; /* Was 14px */
  /* ... */
}
```