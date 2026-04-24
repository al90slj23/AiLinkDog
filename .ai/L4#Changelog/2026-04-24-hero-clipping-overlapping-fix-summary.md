## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（此为首屏渲染动画、布局偏移的 bug 修复与体验打磨）

## 代码文件行数检查

- `web/src/pages/Home/home.css`：1805 行左右；**需要关注**；可能影响层：L3（样式规范）、L4（未来重构日志）。
- `web/src/pages/Home/components/LandingHero.jsx`：205 行左右；状态健康。

## 建议更新层

- L4 工作日志：必须补写。主要记录关于 Spline 机器人由于绝对定位导致在父级网格受限产生遮挡裁剪的问题，以及供应块列重叠和半截渲染问题的 Root Cause Analysis（根因分析）。总结中应涵盖最终采取的将机器人置入 Grid 流并恢复原生弹性宽度布局方案。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成排障 L4 工作日志 `2026-04-24-hero-clipping-overlapping-fix-summary.md`？