# zm_api MySQL Dump -> PostgreSQL Migration Acceptance

## 背景

当前仓库已经收敛为 PostgreSQL-only。

仓库根目录中的 `zm_api.sql` 是旧 MySQL dump。根据该 dump 的结构统计，旧库包含 25 张业务表：

1. `abilities`
2. `channels`
3. `checkins`
4. `custom_oauth_providers`
5. `logs`
6. `midjourneys`
7. `models`
8. `options`
9. `passkey_credentials`
10. `prefill_groups`
11. `quota_data`
12. `redemptions`
13. `setups`
14. `subscription_orders`
15. `subscription_plans`
16. `subscription_pre_consume_records`
17. `tasks`
18. `tokens`
19. `top_ups`
20. `two_fa_backup_codes`
21. `two_fas`
22. `user_oauth_bindings`
23. `user_subscriptions`
24. `users`
25. `vendors`

当前 PostgreSQL 侧除以上 25 张表外，还已经引入 referral 新域 5 张表：

1. `referral_plans`
2. `referral_accounts`
3. `referral_links`
4. `referral_commissions`
5. `referral_withdrawals`

这 5 张 referral 表不在旧 `zm_api.sql` 中，不能被当成旧库原样导入对象。

## 迁移边界

本次迁移工件的边界是：

1. 旧 MySQL 25 张表的数据迁入当前 PostgreSQL 结构。
2. referral 五张表作为当前系统新增域单独处理。
3. `users.inviter_id`、`users.aff_code`、`users.aff_count`、`users.aff_quota`、`users.aff_history` 只能提供 referral 历史的部分线索。
4. `referral_links`、`referral_commissions`、`referral_withdrawals` 无法从 `zm_api.sql` 直接无损恢复。

## 类型映射注意项

MySQL -> PostgreSQL 迁移时至少需要注意以下映射点：

1. `tinyint(1)` -> `boolean`
   必须显式把 `0/1` 转换为 `false/true`，不要依赖隐式转换。
2. `bigint unsigned` / `int unsigned` -> `bigint` 或更大数值类型
   导入前要确认是否存在超出 PostgreSQL `integer` 上限的数据。
3. `longtext` / `text` / JSON 字符串 -> `text` 或 `jsonb`
   只有当前列明确是 JSON 语义时才转为 `jsonb`，否则保持原始文本。
4. `datetime` / `timestamp` -> PostgreSQL timestamp
   需要统一时区口径，并处理 MySQL 常见的零时间或空串问题。
5. `AUTO_INCREMENT` -> PostgreSQL sequence / identity
   批量导入后必须执行序列重置。
6. 软删除复合唯一键
   如 `models(model_name, deleted_at)`、`vendors(name, deleted_at)`、`prefill_groups(name) WHERE deleted_at IS NULL`，要保留 `NULL` 语义。
7. 字符串唯一键
   如 `users.access_token`、`users.aff_code`、`tokens.key`、`redemptions.key`、`subscription_orders.trade_no` 等，导入前后都要做重复检查。

## referral 历史恢复原则

referral 历史数据恢复采用保守原则：

1. 可以从 `users.inviter_id` 推导用户之间存在邀请关系。
2. 可以从 `users.aff_count`、`users.aff_quota`、`users.aff_history` 看出邀请相关聚合结果。
3. 不能从旧 dump 还原真实历史邀请链接参数，如 `code`、`full_url`、`channel_note`、`expired_at`。
4. 不能从旧 dump 还原逐笔分佣流水，因为缺少每次 top up 对应的事件记录和方案快照。
5. 不能从旧 dump 还原逐笔提现历史，因为缺少提现事件源表。
6. 因此 `referral_commissions` 和 `referral_withdrawals` 默认不做自动伪造补数。
7. `referral_accounts` 允许基于 `users` 聚合字段做保守回填，但必须明确这是“兼容性回填”，不是“无损恢复”。

## 工件清单

本次提供的迁移工件如下：

1. `scripts/migration/zm_api_mysql_to_pg_schema_check.sql`
2. `scripts/migration/zm_api_mysql_to_pg_data_load.sql`
3. `scripts/migration/zm_api_mysql_to_pg_postcheck.sql`
4. `scripts/migration/zm_api_mysql_to_pg_referral_backfill.sql`
5. `scripts/migration/zm_api_mysql_to_pg_sequence_reset.sql`

## 验收标准

迁移完成后，至少应满足以下验收标准：

1. PostgreSQL 中可以确认 25 张旧表全部存在。
2. PostgreSQL 中可以确认 5 张 referral 表全部存在。
3. 导入脚本没有尝试从 `zm_api.sql` 直接装载 `referral_*` 源表。
4. 导入后 25 张旧表能够完成基础行数快照检查。
5. 所有自增主键表不存在 `id IS NULL` 或 `id <= 0` 的脏数据。
6. 所有相关 sequence 在导入后已执行重置。
7. 以下唯一性检查返回 0 行冲突：
   `custom_oauth_providers.slug`
   `models(model_name, deleted_at)`
   `checkins(user_id, checkin_date)`
   `passkey_credentials.user_id`
   `passkey_credentials.credential_id`
   `prefill_groups(name) WHERE deleted_at IS NULL`
   `redemptions.key`
   `subscription_orders.trade_no`
   `subscription_pre_consume_records.request_id`
   `tokens.key`
   `top_ups.trade_no`
   `two_fas.user_id`
   `user_oauth_bindings(user_id, provider_id)`
   `user_oauth_bindings(provider_id, provider_user_id)`
   `users.access_token`
   `users.aff_code`
   `vendors(name, deleted_at)`
8. referral 域验收时，必须明确记录以下结论：
   `referral_plans` 已存在并可保留默认方案。
   `referral_accounts` 如有回填，应基于保守规则完成。
   `referral_links`、`referral_commissions`、`referral_withdrawals` 若为空，不视为迁移失败。
9. 若业务要求“历史 referral 流水完整恢复”，必须另行准备外部权威数据源，不得声称 `zm_api.sql` 本身即可无损恢复。

## 推荐执行顺序

1. 先运行 `zm_api_mysql_to_pg_schema_check.sql`。
2. 再执行 `zm_api_mysql_to_pg_data_load.sql` 对 25 张旧表导入。
3. 导入完成后运行 `zm_api_mysql_to_pg_sequence_reset.sql`。
4. 根据业务决策决定是否运行 `zm_api_mysql_to_pg_referral_backfill.sql`。
5. 最后运行 `zm_api_mysql_to_pg_postcheck.sql` 作为验收后检查。

## 不应误判为失败的情况

以下情况不应被误判为迁移失败：

1. `referral_links` 没有历史记录。
2. `referral_commissions` 没有历史记录。
3. `referral_withdrawals` 没有历史记录。

前提是迁移报告已经明确说明：这些表不在旧 dump 中，且旧 dump 无法支持无损恢复。
