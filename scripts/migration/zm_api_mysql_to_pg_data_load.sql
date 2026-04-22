-- zm_api MySQL dump to PostgreSQL data load skeleton
-- Purpose:
-- 1. Provide a realistic import skeleton for loading legacy data into PostgreSQL.
-- 2. Keep the workflow executable after the operator replaces staging source paths.
-- 3. Exclude referral_* tables because they do not exist in the old dump.
--
-- Usage pattern:
--   1. Convert MySQL dump rows into per-table TSV/CSV files under a staging directory.
--   2. Set psql variables such as :staging_dir before running this script.
--   3. Run sequence reset and postcheck after data load.

BEGIN;

SET LOCAL client_min_messages = warning;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '0';

CREATE SCHEMA IF NOT EXISTS migration_tmp;

-- Import order is roughly parent-first to reduce FK and semantic risks.
CREATE TEMP TABLE migration_load_order (
    load_order integer PRIMARY KEY,
    table_name text NOT NULL,
    source_in_dump boolean NOT NULL,
    notes text NOT NULL
) ON COMMIT DROP;

INSERT INTO migration_load_order (load_order, table_name, source_in_dump, notes)
VALUES
    (10,  'options', true,  'key-value base configuration'),
    (20,  'setups', true,  'initial setup state'),
    (30,  'users', true,  'core user data including inviter_id and aff_* fields'),
    (40,  'abilities', true,  'composite key table without auto sequence'),
    (50,  'models', true,  'model metadata'),
    (60,  'vendors', true,  'vendor metadata'),
    (70,  'channels', true,  'channel definitions'),
    (80,  'tokens', true,  'user tokens'),
    (90,  'checkins', true,  'user checkin history'),
    (100, 'custom_oauth_providers', true,  'oauth provider definitions'),
    (110, 'user_oauth_bindings', true,  'oauth bindings'),
    (120, 'two_fas', true,  '2fa configuration'),
    (130, 'two_fa_backup_codes', true,  '2fa backup codes'),
    (140, 'passkey_credentials', true,  'passkey credentials'),
    (150, 'prefill_groups', true,  'prefill groups'),
    (160, 'quota_data', true,  'quota snapshots'),
    (170, 'redemptions', true,  'redeem codes'),
    (180, 'top_ups', true,  'payment top up records'),
    (190, 'subscription_plans', true,  'subscription plan definitions'),
    (200, 'subscription_orders', true,  'subscription order records'),
    (210, 'user_subscriptions', true,  'subscription ownership'),
    (220, 'subscription_pre_consume_records', true,  'idempotent subscription consume records'),
    (230, 'tasks', true,  'async task records'),
    (240, 'midjourneys', true,  'midjourney request records'),
    (250, 'logs', true,  'system and request logs'),
    (260, 'referral_plans', false, 'new PostgreSQL domain table, keep existing seeded/default rows'),
    (270, 'referral_accounts', false, 'backfill from users.inviter_id and current strategy only if approved'),
    (280, 'referral_links', false, 'cannot be losslessly restored from old dump alone'),
    (290, 'referral_commissions', false, 'cannot be losslessly restored from old dump alone'),
    (300, 'referral_withdrawals', false, 'cannot be losslessly restored from old dump alone');

SELECT *
FROM migration_load_order
ORDER BY load_order;

-- Safety note: disable triggers only when the operator has a trusted, clean dataset.
-- Uncomment if a bulk import tool requires it.
-- SET LOCAL session_replication_role = replica;

-- ---------------------------------------------------------------------------
-- Example pattern for a single table import.
-- Replace :staging_dir with a psql variable such as:
--   psql ... -v staging_dir='"/absolute/path/to/staging"'
-- ---------------------------------------------------------------------------

-- users
-- TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;
-- \copy public.users (
--     id,
--     username,
--     password,
--     display_name,
--     role,
--     status,
--     email,
--     github_id,
--     wechat_id,
--     access_token,
--     quota,
--     used_quota,
--     request_count,
--     group,
--     aff_code,
--     aff_count,
--     aff_quota,
--     aff_history,
--     inviter_id,
--     deleted_at,
--     setting,
--     remark,
--     stripe_customer,
--     discord_id,
--     linux_do_id,
--     oidc_id,
--     telegram_id
-- ) FROM :'staging_dir'/users.tsv WITH (FORMAT csv, DELIMITER E'\t', QUOTE E'\b', NULL '\\N');

-- tokens
-- \copy public.tokens (
--     id,
--     user_id,
--     key,
--     status,
--     name,
--     created_time,
--     accessed_time,
--     expired_time,
--     remain_quota,
--     unlimited_quota,
--     used_quota,
--     group,
--     billing_enabled,
--     models,
--     model_limits,
--     allow_ips
-- ) FROM :'staging_dir'/tokens.tsv WITH (FORMAT csv, DELIMITER E'\t', QUOTE E'\b', NULL '\\N');

-- abilities
-- \copy public.abilities (
--     "group",
--     model,
--     enabled,
--     channel_id,
--     priority,
--     weight
-- ) FROM :'staging_dir'/abilities.tsv WITH (FORMAT csv, DELIMITER E'\t', QUOTE E'\b', NULL '\\N');

-- Repeat the same \copy pattern for the remaining 22 legacy tables.
-- Keep the source column order aligned with the PostgreSQL target columns.
-- Do not load referral_* tables from zm_api.sql because the source dump does not contain them.

-- Post-load normalization examples.
-- UPDATE public.users SET access_token = NULL WHERE access_token = '';
-- UPDATE public.users SET deleted_at = NULL WHERE deleted_at::text IN ('0000-00-00 00:00:00', '');
-- UPDATE public.passkey_credentials SET transports = '' WHERE transports IS NULL;

-- Re-enable triggers if they were disabled.
-- SET LOCAL session_replication_role = origin;

COMMIT;
