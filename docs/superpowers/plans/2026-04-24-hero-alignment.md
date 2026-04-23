# Hero Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center-align both the left copy column and the right robot column in the hero section, creating a balanced dual-column layout.

**Architecture:** Pure CSS updates targeting grid alignment and flexbox properties within `web/src/pages/Home/home.css`.

**Tech Stack:** CSS, React

---

### Task 1: Fix Left Column (Copy) Centering

**Files:**
- Modify: `web/src/pages/Home/home.css`

- [ ] **Step 1: Update Grid alignment and Left Column alignment**
We need to ensure `.ald-home-hero__row--primary` centers items vertically, and that `.ald-home-hero__primary-copy` centers its text horizontally and its content vertically.

```css
/* Find .ald-home-hero__row--primary and add align-items */
.ald-home-hero__row--primary {
  grid-template-columns: minmax(520px, 0.92fr) minmax(620px, 1.08fr);
  position: relative;
  overflow: visible;
  padding-top: 110px;
  gap: 64px;
  z-index: 1;
  /* Add this: */
  align-items: center; 
}

/* Find .ald-home-hero__primary-copy and add alignment */
.ald-home-hero__primary-copy {
  /* ... existing styles ... */
  position: relative;
  z-index: 2;
  
  /* Add these: */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Ensure the actions container is also centered */
.ald-home-hero__actions {
  display: flex;
  align-items: center;
  /* Add this: */
  justify-content: center;
}
```

- [ ] **Step 2: Commit**

```bash
git add web/src/pages/Home/home.css
git commit -m "style: center align hero copy column"
```

### Task 2: Fix Right Column (Robot) Centering

**Files:**
- Modify: `web/src/pages/Home/home.css`

- [ ] **Step 1: Update Robot Container alignment**
The robot and vendors are currently positioned absolute across the background. We need to constrain them to the right grid column. Since the background spans full width, we'll keep the background absolute, but we need to ensure the grid column `.ald-home-hero__primary-robot` or the robot layer centers correctly.
Wait, let's look at the current structure from `LandingHero.jsx`:
```jsx
<div className='ald-home-hero__primary-background' ref={robotRef}>
  <div className='ald-home-hero__robot-layer' ref={robotRef}>
    {/* robot and vendors */}
  </div>
</div>
```
And the right column is empty: `<div className='ald-home-hero__primary-robot'></div>`

To make it truly centered in the right column, we should ideally move the robot *into* the right column in the JSX, or adjust the CSS of the background to perfectly align with the right column. Since we agreed on pure CSS, we will adjust the CSS of `.ald-home-hero__robot-layer`.

```css
/* In home.css, adjust the robot layer to span the right half */
.ald-home-hero__robot-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  /* Adjust left to start roughly where the right column starts (e.g. 50% or 45%) */
  left: 45%; 
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0; /* Keep it behind the copy */
}

/* Adjust vendors layer if needed so they center within the robot layer */
.ald-home-hero__robot-vendors {
  position: absolute;
  /* Remove top/left/right/bottom absolute stretching if they exist, let flex center it */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px; /* Adjust to fit */
  /* Keep existing grid */
}
```

Wait, let's check the current CSS for `.ald-home-hero__robot-vendors`:
```css
.ald-home-hero__robot-vendors {
  position: absolute;
  top: 120px;
  left: 52%;
  right: 64px;
  bottom: 120px;
  /* ... */
}
```
We will update it to be perfectly centered.

```css
/* Update in home.css */
.ald-home-hero__robot-vendors {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  max-width: 700px;
  max-height: 700px;
  /* keep grid properties */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: center;
  justify-items: center;
  pointer-events: none;
}
```

- [ ] **Step 2: Commit**

```bash
git add web/src/pages/Home/home.css
git commit -m "style: center align hero robot and vendors in right column"
```