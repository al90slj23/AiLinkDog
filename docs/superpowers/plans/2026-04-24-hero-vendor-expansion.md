# Hero Vendor Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the static 20-item provider grid into a dynamic 40-item infinite vertical scrolling waterfall behind the robot.

**Architecture:** 
- Update `RobotVendorLayer` in `LandingHero.jsx` to group 40 providers into 4 columns.
- Use CSS `@keyframes` in `home.css` to continuously translate each column vertically, with different animation durations to create a varied "data stream" effect.
- Apply a `mask-image` to fade out the top and bottom of the vendor container.

**Tech Stack:** CSS (Animations, Flexbox), React

---

### Task 1: Update React Component for Waterfall Columns

**Files:**
- Modify: `web/src/pages/Home/components/LandingHero.jsx`

- [ ] **Step 1: Replace `providerItems` with a 40-item array**
Replace the existing `providerItems` array with this expanded list:

```javascript
const providerItems = [
  'OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Qwen', 'Moonshot', 'GLM', 'Llama',
  'Mistral', 'Cohere', 'Anthropic', 'Azure AI', 'Hunyuan', 'Minimax', 'Zhipu',
  'Wenxin', 'Spark', 'Xinference', 'Grok', 'Perplexity', '01.AI', 'Baichuan',
  'SenseTime', 'StepFun', 'Ollama', 'vLLM', 'LocalAI', 'Together', 'AWS',
  'Bedrock', 'HuggingFace', 'Replicate', 'Novita', 'Deep Infra', 'SiliconFlow',
  'Lepton', 'Fireworks', 'Groq', 'SambaNova', 'xAI'
];
```

- [ ] **Step 2: Update `RobotVendorLayer` structure**
We need to split `providerItems` into 4 arrays of 10 items each, and render 4 columns. For seamless infinite scrolling, each column must duplicate its content.

```javascript
function RobotVendorLayer() {
  const columns = [
    providerItems.slice(0, 10),
    providerItems.slice(10, 20),
    providerItems.slice(20, 30),
    providerItems.slice(30, 40)
  ];

  return (
    <div className='ald-home-hero__robot-vendors'>
      {columns.map((col, colIndex) => (
        <div key={colIndex} className={`ald-home-vendor-col ald-home-vendor-col--${colIndex}`}>
          <div className='ald-home-vendor-col__track'>
            {[...col, ...col].map((item, index) => (
              <span key={`${item}-${index}`} className={`ald-home-proof__item ald-home-proof__item--${index % 3}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add web/src/pages/Home/components/LandingHero.jsx
git commit -m "feat: expand provider items and structure for waterfall animation"
```

### Task 2: Implement CSS Waterfall Animation

**Files:**
- Modify: `web/src/pages/Home/home.css`

- [ ] **Step 1: Update `.ald-home-hero__robot-vendors` container**
Change the grid layout to accommodate 4 distinct columns, and add a fade mask so items disappear cleanly at the top and bottom.

Find `.ald-home-hero__robot-vendors` (around line 351 or 1184) and update it:
```css
.ald-home-hero__robot-vendors {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  max-width: 700px;
  max-height: 700px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  pointer-events: none;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
  mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
}
```
*(Make sure to remove `align-items: center; justify-items: center;` from it, as the columns will handle their own alignment)*

- [ ] **Step 2: Add CSS for the columns and tracks**
Add the new styles required for the continuous vertical scroll:

```css
.ald-home-vendor-col {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.ald-home-vendor-col__track {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* We duplicate 10 items, so we scroll 50% of the track height to loop perfectly */
  animation: aldVendorScroll linear infinite;
  will-change: transform;
}

@keyframes aldVendorScroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

/* Stagger the animation speeds to make it look organic */
.ald-home-vendor-col--0 .ald-home-vendor-col__track {
  animation-duration: 35s;
}

.ald-home-vendor-col--1 .ald-home-vendor-col__track {
  animation-duration: 45s;
  animation-direction: reverse; /* One going up */
}

.ald-home-vendor-col--2 .ald-home-vendor-col__track {
  animation-duration: 30s;
}

.ald-home-vendor-col--3 .ald-home-vendor-col__track {
  animation-duration: 50s;
}
```

- [ ] **Step 3: Fix existing `.ald-home-proof__item` styles to ensure they don't break flex layout**
Currently `.ald-home-hero__robot-vendors .ald-home-proof__item` has `min-height: 56px;`. We need to make sure they maintain their size during scrolling. Add `flex-shrink: 0;` to it.

Find `.ald-home-hero__robot-vendors .ald-home-proof__item` and add:
```css
  flex-shrink: 0;
```

- [ ] **Step 4: Commit**

```bash
git add web/src/pages/Home/home.css
git commit -m "style: implement infinite vertical waterfall animation for vendors"
```