## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（此为前端 UI 内容扩充与基于 `ResizeObserver` 的响应式动态布局实现）

## 代码文件行数检查

- `web/src/pages/Home/components/LandingHeroCodeBlock.jsx`：未见异常，代码质量健康。
- `web/src/pages/Home/components/LandingHero.jsx`：略微增加，处于健康范围内。

## 建议更新层

- L4 工作日志：必须补写。主要记录首屏代码块 (`Hero Code Block`) 的展示逻辑升级：从 4 种语言扩充至 7 种，并基于 `ResizeObserver` 动态计算可用容器宽度，依据设定的优先级安全地截断显示菜单项（并在当前高亮项被隐藏时自动回退降级）的过程。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成响应式代码块重构的 L4 工作日志 `2026-04-24-hero-code-block-responsive-tabs.md`？