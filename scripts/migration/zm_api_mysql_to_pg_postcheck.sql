-- zm_api MySQL dump to PostgreSQL postcheck
-- Purpose:
-- 1. Verify critical row counts and null/id health after import.
-- 2. Run duplicate checks aligned with current PostgreSQL unique constraints.
-- 3. Reconfirm referral tables remain a separately handled domain.

BEGIN;

-- Basic row-count snapshot for the 25 legacy tables.
SELECT 'abilities' AS table_name, COUNT(*) AS row_count FROM public.abilities
UNION ALL SELECT 'channels', COUNT(*) FROM public.channels
UNION ALL SELECT 'checkins', COUNT(*) FROM public.checkins
UNION ALL SELECT 'custom_oauth_providers', COUNT(*) FROM public.custom_oauth_providers
UNION ALL SELECT 'logs', COUNT(*) FROM public.logs
UNION ALL SELECT 'midjourneys', COUNT(*) FROM public.midjourneys
UNION ALL SELECT 'models', COUNT(*) FROM public.models
UNION ALL SELECT 'options', COUNT(*) FROM public.options
UNION ALL SELECT 'passkey_credentials', COUNT(*) FROM public.passkey_credentials
UNION ALL SELECT 'prefill_groups', COUNT(*) FROM public.prefill_groups
UNION ALL SELECT 'quota_data', COUNT(*) FROM public.quota_data
UNION ALL SELECT 'redemptions', COUNT(*) FROM public.redemptions
UNION ALL SELECT 'setups', COUNT(*) FROM public.setups
UNION ALL SELECT 'subscription_orders', COUNT(*) FROM public.subscription_orders
UNION ALL SELECT 'subscription_plans', COUNT(*) FROM public.subscription_plans
UNION ALL SELECT 'subscription_pre_consume_records', COUNT(*) FROM public.subscription_pre_consume_records
UNION ALL SELECT 'tasks', COUNT(*) FROM public.tasks
UNION ALL SELECT 'tokens', COUNT(*) FROM public.tokens
UNION ALL SELECT 'top_ups', COUNT(*) FROM public.top_ups
UNION ALL SELECT 'two_fa_backup_codes', COUNT(*) FROM public.two_fa_backup_codes
UNION ALL SELECT 'two_fas', COUNT(*) FROM public.two_fas
UNION ALL SELECT 'user_oauth_bindings', COUNT(*) FROM public.user_oauth_bindings
UNION ALL SELECT 'user_subscriptions', COUNT(*) FROM public.user_subscriptions
UNION ALL SELECT 'users', COUNT(*) FROM public.users
UNION ALL SELECT 'vendors', COUNT(*) FROM public.vendors
ORDER BY table_name;

-- Primary-key null and non-positive checks for sequence-backed tables.
SELECT *
FROM (
    SELECT 'channels' AS table_name, COUNT(*) AS bad_id_count FROM public.channels WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'checkins', COUNT(*) FROM public.checkins WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'custom_oauth_providers', COUNT(*) FROM public.custom_oauth_providers WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'logs', COUNT(*) FROM public.logs WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'midjourneys', COUNT(*) FROM public.midjourneys WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'models', COUNT(*) FROM public.models WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'passkey_credentials', COUNT(*) FROM public.passkey_credentials WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'prefill_groups', COUNT(*) FROM public.prefill_groups WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'quota_data', COUNT(*) FROM public.quota_data WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'redemptions', COUNT(*) FROM public.redemptions WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'setups', COUNT(*) FROM public.setups WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'subscription_orders', COUNT(*) FROM public.subscription_orders WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'subscription_plans', COUNT(*) FROM public.subscription_plans WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'subscription_pre_consume_records', COUNT(*) FROM public.subscription_pre_consume_records WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'tasks', COUNT(*) FROM public.tasks WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'tokens', COUNT(*) FROM public.tokens WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'top_ups', COUNT(*) FROM public.top_ups WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'two_fa_backup_codes', COUNT(*) FROM public.two_fa_backup_codes WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'two_fas', COUNT(*) FROM public.two_fas WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'user_oauth_bindings', COUNT(*) FROM public.user_oauth_bindings WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'user_subscriptions', COUNT(*) FROM public.user_subscriptions WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'users', COUNT(*) FROM public.users WHERE id IS NULL OR id <= 0
    UNION ALL SELECT 'vendors', COUNT(*) FROM public.vendors WHERE id IS NULL OR id <= 0
) AS pk_health
ORDER BY table_name;

-- Unique constraint post-checks.
-- Each query should return zero rows after a valid import.

SELECT slug, COUNT(*) AS duplicate_count
FROM public.custom_oauth_providers
GROUP BY slug
HAVING COUNT(*) > 1;

SELECT model_name, deleted_at, COUNT(*) AS duplicate_count
FROM public.models
GROUP BY model_name, deleted_at
HAVING COUNT(*) > 1;

SELECT user_id, checkin_date, COUNT(*) AS duplicate_count
FROM public.checkins
GROUP BY user_id, checkin_date
HAVING COUNT(*) > 1;

SELECT user_id, COUNT(*) AS duplicate_count
FROM public.passkey_credentials
GROUP BY user_id
HAVING COUNT(*) > 1;

SELECT credential_id, COUNT(*) AS duplicate_count
FROM public.passkey_credentials
GROUP BY credential_id
HAVING COUNT(*) > 1;

SELECT name, COUNT(*) AS duplicate_count
FROM public.prefill_groups
WHERE deleted_at IS NULL
GROUP BY name
HAVING COUNT(*) > 1;

SELECT key, COUNT(*) AS duplicate_count
FROM public.redemptions
GROUP BY key
HAVING COUNT(*) > 1;

SELECT trade_no, COUNT(*) AS duplicate_count
FROM public.subscription_orders
GROUP BY trade_no
HAVING COUNT(*) > 1;

SELECT request_id, COUNT(*) AS duplicate_count
FROM public.subscription_pre_consume_records
GROUP BY request_id
HAVING COUNT(*) > 1;

SELECT key, COUNT(*) AS duplicate_count
FROM public.tokens
GROUP BY key
HAVING COUNT(*) > 1;

SELECT trade_no, COUNT(*) AS duplicate_count
FROM public.top_ups
GROUP BY trade_no
HAVING COUNT(*) > 1;

SELECT user_id, COUNT(*) AS duplicate_count
FROM public.two_fas
GROUP BY user_id
HAVING COUNT(*) > 1;

SELECT user_id, provider_id, COUNT(*) AS duplicate_count
FROM public.user_oauth_bindings
GROUP BY user_id, provider_id
HAVING COUNT(*) > 1;

SELECT provider_id, provider_user_id, COUNT(*) AS duplicate_count
FROM public.user_oauth_bindings
GROUP BY provider_id, provider_user_id
HAVING COUNT(*) > 1;

SELECT access_token, COUNT(*) AS duplicate_count
FROM public.users
WHERE access_token IS NOT NULL
GROUP BY access_token
HAVING COUNT(*) > 1;

SELECT aff_code, COUNT(*) AS duplicate_count
FROM public.users
WHERE aff_code IS NOT NULL AND aff_code <> ''
GROUP BY aff_code
HAVING COUNT(*) > 1;

SELECT name, deleted_at, COUNT(*) AS duplicate_count
FROM public.vendors
GROUP BY name, deleted_at
HAVING COUNT(*) > 1;

-- Referral boundary checks.
SELECT *
FROM (
    SELECT 'referral_plans' AS table_name, COUNT(*) AS row_count FROM public.referral_plans
    UNION ALL SELECT 'referral_accounts', COUNT(*) FROM public.referral_accounts
    UNION ALL SELECT 'referral_links', COUNT(*) FROM public.referral_links
    UNION ALL SELECT 'referral_commissions', COUNT(*) FROM public.referral_commissions
    UNION ALL SELECT 'referral_withdrawals', COUNT(*) FROM public.referral_withdrawals
) AS referral_snapshot
ORDER BY table_name;

SELECT *
FROM (
    VALUES
        ('referral_history_boundary', 'users.inviter_id and users.aff_* may provide partial business history'),
        ('referral_history_boundary', 'referral_links/referral_commissions/referral_withdrawals cannot be losslessly rebuilt from zm_api.sql only')
) AS notes(section_name, detail);

COMMIT;
