## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（此为前端 UI 基于比例进行自适应缩放机制的替代方案落地）

## 代码文件行数检查

- `web/src/pages/Home/components/LandingHeroCopy.jsx`：未见异常，状态健康。

## 建议更新层

- L4 工作日志：必须补写。主要记录首屏左侧文字信息块为追求不同屏幕宽度下的完美显示比例，而移除固定宽高限制，改用监听 `window.innerWidth` 结合 `CSS Transform: scale()` 实现的无感动态等比缩放方案（1536px 基准）的开发事实。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成 UI 等比缩放重构的 L4 工作日志 `2026-04-24-hero-copy-auto-scale-summary.md`？