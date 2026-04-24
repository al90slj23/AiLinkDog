## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（修复 SplineScene 无法接受内联 style props 的 bug）

## 代码文件行数检查

- `web/src/pages/Home/components/HeroRobotScene.jsx`：未见异常。

## 建议更新层

- L4 工作日志：必须补写。主要记录 `SplineScene` 内部未透传 `style` 属性导致外部传递动态调试参数失效的根本原因及通过 DOM 包装层（Wrapper DIV）应用参数的修复方法。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成调试面板失效 bug 的修复总结日志 `2026-04-24-spline-debugger-style-prop-fix-summary.md`？