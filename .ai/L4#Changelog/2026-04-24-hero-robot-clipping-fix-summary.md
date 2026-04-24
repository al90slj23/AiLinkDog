## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（此为首屏渲染动画、布局裁切的二次 bug 修复）

## 代码文件行数检查

- `web/src/pages/Home/home.css`：1805 行左右；**需要关注**；可能影响层：L3（样式规范）、L4（未来重构日志）。
- `web/src/pages/Home/components/LandingHero.jsx`：205 行左右；状态健康。

## 建议更新层

- L4 工作日志：必须补写。主要记录第二次排障中发现 `.ald-home-hero` 和 `.ald-home-robot-bg` 存在的 `overflow: hidden` 设置导致 3D 机器人被截断的问题，以及为何解除该约束是安全的（因为最外层的 page wrapper 已设有横向滚动保护）。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成排障 L4 工作日志 `2026-04-24-hero-robot-clipping-fix-summary.md`？