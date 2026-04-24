## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（此为前端 UI 工具辅助定位及 CSS 参数写入）

## 代码文件行数检查

- `web/src/pages/Home/home.css`：1788 行左右；**需要关注**；可能影响层：L3（样式规范）、L4（未来重构日志）。
- `web/src/pages/Home/components/HeroRobotScene.jsx`：恢复到 31 行；状态健康。

## 建议更新层

- L4 工作日志：必须补写。主要记录通过制作可视化悬浮控制面板以克服 3D/Spline 盲调困难，并最终固化机器人 transform 参数的调试过程。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成调试归档 L4 工作日志 `2026-04-24-hero-robot-visual-debugging-summary.md`？