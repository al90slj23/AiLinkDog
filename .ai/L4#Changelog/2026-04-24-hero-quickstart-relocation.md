## 规范同步判断

- L4 工作日志：必须补写
- 是否涉及长期规则变化：否（此为前端 UI 的组件替换与重构）

## 代码文件行数检查

- `web/src/pages/Home/components/LandingQuickStart.jsx`：由于提取出了 `LandingAudiences`，当前行数减少至 62 行左右；状态非常健康。
- `web/src/pages/Home/components/LandingHero.jsx`：略有增加，引入了新组件，行数 200 左右；状态健康。

## 建议更新层

- L4 工作日志：必须补写。主要记录首屏二级左侧布局从冗杂的 `LandingHeroInfoCards` 信息块重构替换为提取出的 `LandingQuickStart` 快速接入步骤的操作，以及老组件被替换但保留在历史树的决策。
- 其它层（L0-L3, L5）：无需同步。

## 需要用户确认的事项

- [ ] 是否同意直接生成 UI 模块替换的 L4 工作日志 `2026-04-24-hero-quickstart-relocation.md`？