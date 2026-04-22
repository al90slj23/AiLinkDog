-- zm_api MySQL dump to PostgreSQL referral backfill skeleton
-- Purpose:
-- 1. Clarify what can be reconstructed from legacy users data.
-- 2. Seed the current referral domain conservatively.
-- 3. Explicitly avoid fake precision for historical referral links, commissions, and withdrawals.

BEGIN;

SET LOCAL client_min_messages = warning;

-- Guardrails and scope notes.
SELECT *
FROM (
    VALUES
        ('source', 'zm_api.sql does not contain referral_plans/referral_accounts/referral_links/referral_commissions/referral_withdrawals'),
        ('recoverable', 'users.inviter_id, users.aff_code, users.aff_count, users.aff_quota, users.aff_history can support only partial reconstruction'),
        ('not_lossless', 'historical referral links, commission records, and withdrawal records cannot be restored losslessly'),
        ('policy', 'prefer preserving current PostgreSQL referral domain semantics over inventing fake historical rows')
) AS scope(section_name, detail)
ORDER BY section_name;

-- 1. Ensure default referral plan rows exist, but do not overwrite current names or parameters.
INSERT INTO public.referral_plans (id, name, description, plan_type, is_active, profit_share_percent, min_channel_profit, level1_percent, level2_percent, created_at, updated_at)
VALUES
    (1, '持续返利', '长期按邀请关系返利，适合稳定推广。', 1, true, 80.00, 20.00, 60.00, 40.00, NOW(), NOW()),
    (2, '一次性买断', '适合短期投放，首阶段返利更集中。', 2, true, 80.00, 20.00, 60.00, 40.00, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Backfill referral_accounts only for users who clearly participate in the invitation system.
-- Strategy:
--   - inviter_id > 0 means the user has an upstream inviter relationship.
--   - aff_count > 0 or aff_history > 0 means the user historically invited others or received commission.
--   - default all recovered accounts to plan_id = 1 unless an operator chooses another policy.
INSERT INTO public.referral_accounts (
    user_id,
    plan_id,
    locked_at,
    created_at,
    updated_at
)
SELECT
    u.id AS user_id,
    1 AS plan_id,
    NOW() AS locked_at,
    NOW() AS created_at,
    NOW() AS updated_at
FROM public.users u
WHERE u.inviter_id > 0
   OR u.aff_count > 0
   OR u.aff_history > 0
ON CONFLICT (user_id) DO NOTHING;

-- 3. Optional referral_links seed.
-- This keeps the script executable but intentionally disabled by default.
-- The old dump does not store real historical link metadata such as code/full_url/channel_note/expired_at.
-- Operators should only enable this section if they accept a synthetic compatibility link.
--
-- INSERT INTO public.referral_links (
--     user_id,
--     plan_id,
--     code,
--     full_url,
--     channel_note,
--     validity_days,
--     expired_at,
--     is_active,
--     created_at,
--     updated_at
-- )
-- SELECT
--     u.id,
--     1,
--     'legacy-' || u.id::text,
--     '/register?aff=' || COALESCE(NULLIF(u.aff_code, ''), 'legacy-' || u.id::text),
--     'synthetic legacy backfill',
--     0,
--     NULL,
--     true,
--     NOW(),
--     NOW()
-- FROM public.users u
-- WHERE u.aff_code IS NOT NULL AND u.aff_code <> ''
-- ON CONFLICT DO NOTHING;

-- 4. Historical commissions and withdrawals are intentionally not auto-generated.
-- The available users.aff_quota and users.aff_history fields are aggregate balances, not event logs.
SELECT *
FROM (
    VALUES
        ('referral_commissions', 'skip auto backfill because aggregate balances cannot reconstruct per-topup commission events'),
        ('referral_withdrawals', 'skip auto backfill because zm_api.sql does not provide withdrawal event records'),
        ('operators', 'if business requires historical ledger restoration, prepare a separate curated source of truth first')
) AS decisions(target_name, reason)
ORDER BY target_name;

-- 5. Quick inspection snapshot after conservative backfill.
SELECT *
FROM (
    SELECT 'referral_plans' AS table_name, COUNT(*) AS row_count FROM public.referral_plans
    UNION ALL SELECT 'referral_accounts', COUNT(*) FROM public.referral_accounts
    UNION ALL SELECT 'referral_links', COUNT(*) FROM public.referral_links
    UNION ALL SELECT 'referral_commissions', COUNT(*) FROM public.referral_commissions
    UNION ALL SELECT 'referral_withdrawals', COUNT(*) FROM public.referral_withdrawals
) AS snapshot
ORDER BY table_name;

COMMIT;
