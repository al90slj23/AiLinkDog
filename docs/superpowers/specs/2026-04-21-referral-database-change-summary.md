# 邀请返利数据库变更总结

## 文档目的

本文件专门总结本次“邀请返利中心 / 邀请返利管理”增强改造中，涉及数据库的新增、接入、真实读写和兼容关系。

这份文档只关注数据库层，不展开页面 UI 和交互细节，便于：

1. 后续排查数据问题。
2. 后续编写数据库迁移或导入程序。
3. 明确哪些表已经进入真实业务链，哪些仍是协同阶段。

## 变更范围概览

本次数据库改动主要围绕邀请返利新域展开，核心变化是：

1. 新增并接入 5 张 referral 域表。
2. 将部分邀请返利业务从旧 `users.aff_*` 纯字段模式，扩展为 referral 专用表 + 旧字段协同模式。
3. 打通了方案管理、账号锁定、邀请链接、充值后返利记录、提现申请与审核等真实数据库链路。

## 新增并接入迁移的表

### 1. `referral_plans`

用途：

1. 存储返利方案。
2. 支持管理员新增、编辑、启用、停用。

主要字段：

1. `id`
2. `name`
3. `description`
4. `plan_type`
5. `is_active`
6. `profit_share_percent`
7. `min_channel_profit`
8. `level1_percent`
9. `level2_percent`
10. `created_at`
11. `updated_at`

### 2. `referral_accounts`

用途：

1. 存储账号级返利方案锁定关系。
2. 明确“方案跟随账号，不跟随链接”的规则落点。

主要字段：

1. `id`
2. `user_id`
3. `plan_id`
4. `locked_at`
5. `created_at`
6. `updated_at`

### 3. `referral_links`

用途：

1. 存储邀请链接。
2. 支持渠道备注、有效期等信息。
3. 作为后续链接维度统计与归因的基础表。

主要字段：

1. `id`
2. `user_id`
3. `plan_id`
4. `code`
5. `full_url`
6. `channel_note`
7. `validity_days`
8. `expired_at`
9. `is_active`
10. `created_at`
11. `updated_at`

### 4. `referral_commissions`

用途：

1. 存储一级 / 二级返利流水。
2. 作为佣金记录页、管理页概览统计、总返利计算的基础表。

主要字段：

1. `id`
2. `user_id`
3. `invitee_user_id`
4. `referral_link_id`
5. `plan_id`
6. `level`
7. `top_up_amount`
8. `commission_quota`
9. `plan_snapshot`
10. `status`
11. `created_at`
12. `updated_at`

### 5. `referral_withdrawals`

用途：

1. 存储用户提现申请。
2. 支撑用户侧提现记录和管理侧提现审核。

主要字段：

1. `id`
2. `user_id`
3. `amount`
4. `fee`
5. `actual_amount`
6. `payment_method`
7. `payment_account`
8. `payment_name`
9. `remark`
10. `admin_remark`
11. `status`
12. `created_at`
13. `updated_at`

## 迁移入口变更

本次新增表已接入正式迁移入口：

1. `model/main.go -> migrateDB()`
2. `model/main.go -> migrateDBFast()`

这意味着：

1. 后端启动时会自动尝试迁移上述 referral 表。
2. 当前这些表不再只是模型定义，而是正式进入数据库结构管理链路。

## 真实读写已启用的数据库行为

### `referral_plans`

已启用真实读写：

1. 初始化默认方案。
2. 查询方案列表。
3. 新增方案。
4. 编辑方案。
5. 启用 / 停用方案。
6. 方案概览统计聚合。

当前规则：

1. 默认方案固定存在两条：
   - `持续返利`
   - `一次性买断`
2. 默认方案初始化现在只负责“确保默认方案存在”，不再删除管理员新增的自定义方案。
3. 默认方案也不再强行覆盖管理员手工修改过的状态。

### `referral_accounts`

已启用真实读写：

1. 用户首次选择返利方案后写入账号锁定关系。
2. 用户页读取当前账号已锁定方案。
3. 管理页统计按方案聚合锁定账号数量。

当前规则：

1. 一个账号只允许锁定一个返利方案。
2. 锁定后不能重复修改。

### `referral_links`

已启用真实读写：

1. 用户创建邀请链接。
2. 用户读取自己的邀请链接列表。

当前规则：

1. 链接跟随账号方案。
2. 不是“每条链接独立选方案”。

### `referral_commissions`

已启用真实读写：

1. 充值成功后，按邀请关系生成一级返利。
2. 存在上上级时，继续生成二级返利。
3. 用户页读取佣金记录。
4. 管理页概览按方案聚合一级 / 二级 / 总返利。

当前分佣口径：

1. 利润基数 = `充值金额 * 最低利润率`
2. 返利池 = `利润基数 * 利润分配比例`
3. 一级返利 = `返利池 * 一级返利占比`
4. 二级返利 = `返利池 * 二级返利占比`

当前金额处理方式：

1. 使用浮点计算后直接转整数。
2. 实际表现为向下截断，例如：
   - `9.6 -> 9`
   - `6.4 -> 6`

当前状态字段规则：

1. 当前实现里，生成的佣金记录状态可为：
   - `pending`
   - `settled`
2. 具体和方案类型的更细差异，后续仍建议继续验收和收口。

### `referral_withdrawals`

已启用真实读写：

1. 用户发起提现申请写入数据库。
2. 用户读取自己的提现记录。
3. 管理员读取提现审核列表。
4. 管理员审核通过 / 拒绝后更新状态。

当前状态：

1. 用户申请提现时会校验可提现余额。
2. 用户端与管理端都直接基于 `referral_withdrawals` 读取数据。

## 与旧 `users` 表字段的协同关系

当前邀请返利增强版仍与旧用户字段协同工作，没有完全切断：

### 继续使用的旧字段

1. `users.aff_quota`
2. `users.aff_history`
3. `users.aff_count`
4. `users.inviter_id`

### 当前作用

1. `aff_quota`
   - 仍作为当前可提现返利余额的重要来源之一。
2. `aff_history`
   - 仍作为返利历史总额的重要来源之一。
3. `aff_count`
   - 仍参与部分邀请数量统计。
4. `inviter_id`
   - 仍作为邀请关系主链的重要数据来源。

### 当前判断

系统仍处于：

1. 新 referral 域表已启用。
2. 旧 `users.aff_*` 字段仍参与读写和统计。
3. 属于“协同阶段”，而不是完全切断旧字段依赖的最终态。

## 已验证通过的数据库链路

### 1. 账号锁定方案

已验证：

1. 用户选择方案后，`referral_accounts` 真实写入。

### 2. 邀请链接创建

已验证：

1. 用户创建邀请链接后，`referral_links` 真实写入。

### 3. 方案管理

已验证：

1. 管理员新增方案后，`referral_plans` 真实写入。
2. 管理员编辑方案后，数据库字段真实更新。
3. 启用 / 停用方案后，`is_active` 真实变化。

### 4. 充值后自动分佣

已验证：

1. A -> B -> C 两级邀请关系下，C 充值 `100` 后：
   - B 生成一级返利记录
   - A 生成二级返利记录
2. `referral_commissions` 真实写入。
3. `users.aff_quota / aff_history` 真实更新。

样本结果：

1. 一级返利：`9`
2. 二级返利：`6`

### 5. 提现申请与审核基础链路

已验证：

1. 用户提现申请可真实写入 `referral_withdrawals`。
2. 管理端可读取提现记录。
3. 管理端可更新提现状态。

## 已修复的数据库相关问题

### 1. 默认方案重复初始化

问题：

1. 默认方案会重复写入，出现两条以上“持续返利”或“一次性买断”。

当前处理：

1. 默认方案初始化逻辑已改为“确保默认方案存在”，不再继续重复插入。

### 2. 默认方案误删管理员新增方案

问题：

1. 旧逻辑会在初始化默认方案时删除非默认方案。

当前处理：

1. 已修正为不再删除管理员新增方案。

### 3. 管理页顶部统计卡口径错误

问题：

1. `plan_count`
2. `active_plan_count`
3. `pending_withdrawals`
4. `total_referral_payout`

曾出现返回值和数据库真实状态不一致。

当前处理：

1. 聚合逻辑已调整。
2. 对应测试已收平。

## 当前仍需特别关注的数据库口径

### 1. 金额取整规则

当前实现为：

1. 浮点结果直接转整数。
2. 表现为向下截断。

是否继续采用这一口径，需要最终拍板。

### 2. `active_referrers` 字段定义

当前实现口径已经和测试对齐，但业务定义仍建议在最终上线说明中明确。

### 3. 旧字段与新 referral 域并行

当前不是纯 referral 域单轨模型，仍有旧 `users.aff_*` 协同逻辑。
后续如要做“官方数据库导入”或独立迁移程序，必须以此为前提。

## 后续数据库导入 / 迁移建议

如果后续还需要处理外部或官方数据库导入，建议按以下层次进行：

### 1. 结构层

确认并保留：

1. `referral_plans`
2. `referral_accounts`
3. `referral_links`
4. `referral_commissions`
5. `referral_withdrawals`

### 2. 关系层

确保：

1. `users.inviter_id` 可用于恢复邀请关系。
2. `referral_accounts` 能恢复账号级锁定方案。
3. `referral_links` 能恢复渠道维度数据。

### 3. 金额层

导入时必须明确：

1. 历史返利是否已经在 `users.aff_quota / aff_history` 中体现。
2. 是否还要补写 `referral_commissions`。
3. 提现记录是否需要补到 `referral_withdrawals`。

## 当前文档关系

本文件是“数据库专项总结”。

配套文档：

1. 高强度验证计划：
   - `docs/superpowers/plans/2026-04-21-referral-hardening-verification-plan.md`
2. 功能收口说明：
   - `docs/superpowers/specs/2026-04-21-referral-enhancement-closure.md`

## 当前阶段结论

这次邀请返利增强版在数据库层面已经完成核心链路接通。

准确说法是：

1. referral 五张表已进入正式迁移。
2. 真实读写已覆盖方案、账号锁定、邀请链接、分佣、提现。
3. 充值后自动分佣已经真实落库。
4. 旧 `users.aff_*` 字段仍在协同阶段使用。
5. 当前数据库层已经支持核心功能上线，但仍建议继续做口径和体验层的收尾。 
