## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（此为前端 UI 代码块 Tab 的自适应缩放计算 bug 修复）

## 代码文件行数检查

- `web/src/pages/Home/components/LandingHeroCodeBlock.jsx`：未见异常，状态健康。

## 建议更新层

- L4 工作日志：必须补写。主要记录 `LandingHeroCodeBlock` 在响应式缩放计算过程中，由于预设的按钮宽度数组越界产生 `NaN`，导致右侧固定的文案 Span 被无限追加的 Tab 项挤出的排障分析与修复动作。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成响应式 Tab 挤压排障的 L4 工作日志 `2026-04-24-hero-code-block-tab-resize-fix.md`？