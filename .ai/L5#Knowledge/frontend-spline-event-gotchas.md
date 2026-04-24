# Frontend Event Gotchas：Spline 合成事件与 window 监听冲突

## 场景

当页面同时存在以下两者时会出现冲突：

1. **Spline 3D 场景**（`spline-scene.jsx`）：为了让 Spline canvas 的头部跟随交互在鼠标不直接悬停在 canvas 上时也能响应，组件在 `window` 上监听 `pointermove`，将真实鼠标坐标 **clamp 到 canvas 的 BoundingClientRect 范围内**，然后合成 `new MouseEvent('mousemove', { bubbles: true, clientX: clamp 后的坐标 })` 派发给 canvas。

2. **其他使用 `window.addEventListener('mousemove')` 的组件**（如 `spotlight.jsx`）：从 `window` 接收 mousemove 事件，根据鼠标坐标更新 UI 位置。

## 冲突机制

合成 `MouseEvent` 设置了 `bubbles: true`，因此会从 canvas 元素向上冒泡，最终到达 `window`。其他在 `window` 上监听 `mousemove` 的组件会接收到这个合成事件，使用的是 **clamp 后的坐标**（≈ robot canvas 区域左边界）而不是真实鼠标坐标。

**表现**：无论真实鼠标在页面哪个位置，依赖 window mousemove 的组件的位置都会被"拉回"到 Spline canvas 所在区域。用户感知为"功能只在 3D 场景区域有效"。

## 修复模式

在接收 window mousemove 的处理函数中，**过滤非可信事件**：

```js
const handleMouseMove = useCallback((event) => {
  if (!event.isTrusted) return;  // 忽略 dispatchEvent() 产生的合成事件
  // ... 正常处理
}, [...]);
```

`event.isTrusted`：
- `true` = 浏览器响应用户真实操作生成的事件
- `false` = JavaScript `dispatchEvent()` 合成的事件

这是 Web 标准属性（[MDN: Event.isTrusted](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted)），安全可用。

## 适用范围

任何需要在 `window` 层监听 `mousemove` / `pointermove` 并根据坐标做位置计算的组件，只要页面上同时存在 `spline-scene.jsx`，就应加上 `isTrusted` 过滤。

## 注意事项

- **不要修改 `spline-scene.jsx` 的合成事件逻辑**：那段 clamp + dispatchEvent 是 Spline 头部跟随的关键——在 canvas 范围外移动时，Spline 没有原生方法接收鼠标事件，必须靠合成转发。移除它会导致机器人头部不跟随鼠标。
- **解决方式应在消费侧（接收方）过滤**，而不是在发送侧（spline-scene）禁止合成。

## 发现路径

2026-04-24，在修复首页 Spotlight 光晕范围问题时通过 Playwright 逐步诊断发现。完整排障过程见：`L4#Changelog/2026-04-24-0253-spotlight-全行跟踪修复与重复声明清理.md`。
