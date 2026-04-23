# Homepage UI Tuning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore and refine the visual styling of the Homepage, focusing specifically on the Hero Code Block (terminal style) and overall CSS variables for a polished UI.

**Architecture:** Pure CSS updates within `web/src/pages/Home/home.css`.

**Tech Stack:** CSS, React

---

### Task 1: Restore Hero Code Block Terminal Styles

**Files:**
- Modify: `web/src/pages/Home/home.css`

- [ ] **Step 1: Add/Update CSS for `ald-home-code` and `ald-home-code--hero`**

```css
/* Update these styles in home.css */
.ald-home-code {
  background: var(--ald-code-bg);
  color: var(--ald-code-text);
  border-radius: 1.4rem;
  overflow: hidden;
  border: 1px solid var(--ald-border);
  box-shadow: 0 30px 60px -30px rgba(245, 179, 1, 0.35);
  font-family: 'IBM Plex Mono', ui-monospace, Menlo, monospace;
}

.ald-home-code__tabs {
  padding: 12px 16px;
  border-bottom: 1px solid var(--ald-code-line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ald-muted);
}

.ald-home-code__tab-buttons {
  display: flex;
  gap: 4px;
}

.ald-home-code__tab-buttons button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  color: var(--ald-muted);
  font-family: inherit;
  font-size: 12px;
  border-bottom: 1.5px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.ald-home-code__tab-buttons button.is-active {
  color: var(--ald-primary);
  border-bottom: 1.5px solid var(--ald-primary);
}

.ald-home-code pre {
  margin: 0;
  padding: 22px;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-wrap;
  min-height: 196px;
}
```

- [ ] **Step 2: Add CSS for Routing Log Section**

```css
/* Add to home.css */
.ald-home-code__log {
  border-top: 1px solid var(--ald-code-line);
  padding: 16px 22px;
  font-size: 12px;
  color: var(--ald-muted);
}

.ald-home-code__log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ald-home-code__ok {
  color: var(--ald-green);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ald-pulse {
  animation: aldPulse 1.6s ease-in-out infinite;
}

@keyframes aldPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.ald-home-code__log > div:nth-child(2) {
  color: var(--ald-orange); /* 429 rate-limited */
}

.ald-home-code__log > div:nth-child(3) {
  color: var(--ald-green); /* 200 ok fallback */
}

.ald-home-code__reroute {
  color: var(--ald-primary);
  margin-top: 4px;
}
```

- [ ] **Step 3: Update `LandingHeroCodeBlock.jsx` to include pulse animation**

Modify `web/src/pages/Home/components/LandingHeroCodeBlock.jsx` to add the pulse dot for the "200 · 1.12s" text, matching V1_TechMinimal.

```javascript
// In LandingHeroCodeBlock.jsx, update the log-header span:
<span className='ald-home-code__ok'>
  <span className="ald-pulse" style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--ald-green)' }}/>
  200 · 1.12s
</span>
```

- [ ] **Step 4: Verify UI locally**
Run `bun run build` or use dev server to visually confirm the code block looks like the old tech minimal design.

- [ ] **Step 5: Commit changes**
```bash
git add web/src/pages/Home/home.css web/src/pages/Home/components/LandingHeroCodeBlock.jsx
git commit -m "style: restore tech minimal styling for hero code block"
```

### Task 2: General UI Refinements (Variables & Interactions)

**Files:**
- Modify: `web/src/pages/Home/home.css`

- [ ] **Step 1: Refine CSS Variables and Base Styles**

```css
/* Update at the top of home.css */
.ald-home {
  /* ... keep existing ... */
  --ald-muted: #6b7280; /* Slightly lighter for better contrast in light mode */
  --ald-border: #e5e7eb; /* Softer border */
}

.ald-home-dark {
  /* ... keep existing ... */
  --ald-muted: #9ca3af; /* Better contrast in dark mode */
  --ald-border: #374151;
}

/* Add generic interactive classes */
.ald-lift {
  transition: transform .25s cubic-bezier(.2,.7,.3,1), box-shadow .25s, border-color .25s;
}
.ald-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px -18px rgba(245,179,1,0.35);
  border-color: var(--ald-primary) !important;
}
```

- [ ] **Step 2: Apply hover effects to standard interactive elements**

```css
/* Add to home.css */
.ald-home-nav__links a,
.ald-home-nav__login {
  transition: color 0.2s;
}
.ald-home-nav__links a:hover,
.ald-home-nav__login:hover {
  color: var(--ald-primary);
}

.ald-home-models__row {
  transition: background 0.15s;
}
.ald-home-models__row:hover {
  background: rgba(245, 179, 1, 0.06);
}
```

- [ ] **Step 3: Commit changes**
```bash
git add web/src/pages/Home/home.css
git commit -m "style: refine global css variables and add hover interactions"
```
