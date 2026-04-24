# L5 Knowledge 定位修正设计

## 摘要

对 `L5#Knowledge` 做最小定位修正，解决其与当前 `L4#Changelog` 工作日志主路径之间的口径冲突。

本次只更新：

- `.ai/L5#Knowledge/README.md`
- `.ai/L5#Knowledge/recent-fix-summary.md`

不清洗历史正文，不迁移旧内容，只补充“当前定位说明”。

## 目标

- 明确 `L5` 不再承载 `gogogo.sh 7` 的持续追加型工作日志。
- 明确 `recent-fix-summary.md` 属于历史遗留总结文件，而不是当前主路径。
- 保留历史内容，避免为了一致性而破坏事实记录。

## 非目标

- 本次不重写 `recent-fix-summary.md` 的历史正文。
- 本次不把其中旧内容迁移到 `L4#Changelog`。
- 本次不新增 `L5` 文件。
- 本次不修改 `L3/L2/L0` 已完成的同步结果。

## 背景

当前正式规则已经收敛为：

- `gogogo.sh 7` 产生的持续追加型工作日志主路径是 `L4#Changelog`
- `L5` 负责系统关系、知识结构与长期认知，不负责持续追加型工作日志

但 `L5#Knowledge/README.md` 和 `recent-fix-summary.md` 仍保留旧口径，容易让读者误以为：

- `recent-fix-summary.md` 仍是当前主路径
- `gogogo.sh 7` 还会继续把工作日志追加到 `L5`

因此需要做最小定位修正。

## 推荐方案

采用最小修正方案：

1. 在 `README.md` 中把 `recent-fix-summary.md` 改写为“历史遗留总结文件”定位。
2. 在 `recent-fix-summary.md` 文件开头增加醒目的定位说明：
   - 当前 `gogogo.sh 7` 工作日志主路径已迁移到 `L4#Changelog`
   - 本文件不再作为持续追加型日志主入口
3. 不改动其后续历史内容。

## 风险与边界

- 本次不会消除 `recent-fix-summary.md` 内部所有历史阶段性说法，只会阻止它继续被误读为当前规则。
- 如果未来需要进一步做 `L5` 结构纯化，可在单独任务中处理，但不应在本次最小同步中扩大范围。
