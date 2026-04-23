## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（纯样式微调及DOM结构对齐调整）

## 代码文件行数检查

- `web/src/pages/Home/home.css`：1760 行；**需要关注**；可能影响层：L3（样式规范）、L4（未来重构日志）。
- `web/src/pages/Home/components/LandingHero.jsx`：166 行；状态良好。

## 建议更新层

- L4 工作日志：必须补写，记录对 Landing Hero 网格不对称 (`0.92fr` / `1.08fr`) 导致的居中偏移的根本原因分析及修正，包括恢复 placeholder 中心点，以及将 Robot 从绝对定位的背景层移入标准 grid cell 中的结构变更。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成补充 L4 工作日志 `2026-04-24-hero-alignment-revisit-summary.md`？