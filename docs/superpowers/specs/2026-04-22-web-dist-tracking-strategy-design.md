# web/dist 跟踪策略调整设计

## 摘要

对当前仓库的 `web/dist` 跟踪策略做最小决策梳理，目标是解决工作区中持续出现的大量 `web/dist/assets/*` 删除/新增噪音。

本次只讨论跟踪策略，不直接修改 `.gitignore` 或执行 `git rm --cached`。

## 背景

当前根 `.gitignore` 对 `web/dist` 的规则是：

```gitignore
web/dist/
!web/dist/
!web/dist/index.html
```

这意味着：

- `web/dist/index.html` 被保留在版本管理内；
- `web/dist/assets/*` 默认忽略；
- 但 `index.html` 又会引用带哈希的 assets 文件。

结果就是：

- 每次前端构建后，`index.html` 中的哈希引用变化；
- 已跟踪的旧 `assets/*` 出现大量删除；
- 新的 `assets/*` 又以未跟踪文件形式出现；
- 工作区长期充满 `web/dist` 噪音。

## 问题本质

当前策略处于两种模式之间，但没有闭环：

1. 想忽略构建产物；
2. 又想保留其中的 `index.html`。

由于 `index.html` 与哈希资源文件强耦合，只保留一个入口文件而不保留资源文件，会导致策略长期不自洽。

## 方案对比

### 方案 A：彻底不跟踪 `web/dist`

做法：

- `web/dist/` 整体忽略；
- 不再特判 `web/dist/index.html`；
- 将当前已跟踪的 `web/dist` 文件全部从 Git 跟踪中移除。

优点：

- 工作区最干净；
- 与前端构建产物的常见处理方式一致；
- 不再出现哈希资源引发的大量噪音。

缺点：

- 如果仓库当前依赖 `web/dist/index.html` 作为某种提交态工件，需要重新确认该假设是否仍成立。

### 方案 B：正式跟踪完整 `web/dist`

做法：

- `index.html` 和 `assets/*` 一起纳入版本管理；
- 每次构建后允许整体更新 `dist`。

优点：

- 策略自洽；
- 不会出现“入口文件引用了未跟踪哈希资源”的半跟踪状态。

缺点：

- 仓库会持续包含大量构建产物；
- 提交噪音与 diff 体积会显著增加。

## 推荐方案

采用方案 A：彻底不跟踪 `web/dist`。

## 实施边界

如果用户确认采用方案 A，后续实现应只包括：

1. 调整根 `.gitignore`，移除对 `web/dist/index.html` 的特判；
2. 将当前已跟踪的 `web/dist` 文件从 Git 索引中移除，但保留本地文件；
3. 不修改前端源码本身。

## 风险与待确认项

- 需要确认当前仓库是否仍然依赖 `web/dist/index.html` 作为必须纳入 Git 的发布工件。
- 如果该假设已经失效，则应直接采用“彻底不跟踪 `web/dist`”的策略。
