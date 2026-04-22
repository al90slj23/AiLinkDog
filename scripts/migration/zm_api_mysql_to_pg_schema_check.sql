-- zm_api MySQL dump to PostgreSQL schema check
-- Purpose:
-- 1. Confirm the legacy MySQL dump contains the expected 25 source tables.
-- 2. Confirm the current PostgreSQL schema already contains those 25 tables.
-- 3. Confirm referral tables are a new domain and are not expected in zm_api.sql.
--
-- Usage example:
--   psql "$POSTGRES_DSN" -v ON_ERROR_STOP=1 -f scripts/migration/zm_api_mysql_to_pg_schema_check.sql

BEGIN;

CREATE TEMP TABLE migration_expected_legacy_tables (
    table_name text PRIMARY KEY
) ON COMMIT DROP;

INSERT INTO migration_expected_legacy_tables (table_name)
VALUES
    ('abilities'),
    ('channels'),
    ('checkins'),
    ('custom_oauth_providers'),
    ('logs'),
    ('midjourneys'),
    ('models'),
    ('options'),
    ('passkey_credentials'),
    ('prefill_groups'),
    ('quota_data'),
    ('redemptions'),
    ('setups'),
    ('subscription_orders'),
    ('subscription_plans'),
    ('subscription_pre_consume_records'),
    ('tasks'),
    ('tokens'),
    ('top_ups'),
    ('two_fa_backup_codes'),
    ('two_fas'),
    ('user_oauth_bindings'),
    ('user_subscriptions'),
    ('users'),
    ('vendors');

CREATE TEMP TABLE migration_expected_referral_tables (
    table_name text PRIMARY KEY
) ON COMMIT DROP;

INSERT INTO migration_expected_referral_tables (table_name)
VALUES
    ('referral_plans'),
    ('referral_accounts'),
    ('referral_links'),
    ('referral_commissions'),
    ('referral_withdrawals');

-- Summary of the migration boundary.
SELECT
    'legacy_expected_table_count' AS item,
    COUNT(*)::text AS value
FROM migration_expected_legacy_tables
UNION ALL
SELECT
    'referral_expected_table_count' AS item,
    COUNT(*)::text AS value
FROM migration_expected_referral_tables;

-- Legacy 25 tables must already exist in PostgreSQL.
SELECT
    t.table_name AS missing_legacy_table_in_pg
FROM migration_expected_legacy_tables t
LEFT JOIN information_schema.tables i
       ON i.table_schema = 'public'
      AND i.table_name = t.table_name
WHERE i.table_name IS NULL
ORDER BY t.table_name;

DO $$
DECLARE
    missing_count integer;
BEGIN
    SELECT COUNT(*)
    INTO missing_count
    FROM migration_expected_legacy_tables t
    LEFT JOIN information_schema.tables i
           ON i.table_schema = 'public'
          AND i.table_name = t.table_name
    WHERE i.table_name IS NULL;

    IF missing_count > 0 THEN
        RAISE EXCEPTION 'schema check failed: % legacy tables are missing in PostgreSQL', missing_count;
    END IF;
END $$;

-- Referral tables must also exist in PostgreSQL, but they are not part of the old dump.
SELECT
    t.table_name AS missing_referral_table_in_pg
FROM migration_expected_referral_tables t
LEFT JOIN information_schema.tables i
       ON i.table_schema = 'public'
      AND i.table_name = t.table_name
WHERE i.table_name IS NULL
ORDER BY t.table_name;

DO $$
DECLARE
    missing_count integer;
BEGIN
    SELECT COUNT(*)
    INTO missing_count
    FROM migration_expected_referral_tables t
    LEFT JOIN information_schema.tables i
           ON i.table_schema = 'public'
          AND i.table_name = t.table_name
    WHERE i.table_name IS NULL;

    IF missing_count > 0 THEN
        RAISE EXCEPTION 'schema check failed: % referral tables are missing in PostgreSQL', missing_count;
    END IF;
END $$;

-- Important type mapping notes for the manual import process.
SELECT *
FROM (
    VALUES
        ('tinyint(1) -> boolean', 'convert 0/1 to false/true explicitly'),
        ('bigint/int unsigned -> bigint/numeric', 'check upper bound before casting to integer'),
        ('longtext/text/json text -> text/jsonb', 'keep raw text unless the target column is explicitly json/jsonb'),
        ('datetime/timestamp -> timestamp with time zone or timestamp without time zone', 'normalize zero date and local timezone handling before import'),
        ('deleted_at nullable index', 'keep NULL semantics for soft delete composite unique constraints'),
        ('auto_increment -> identity/sequence', 'run sequence reset after COPY/INSERT completes'),
        ('char/varchar unique key', 'trim illegal zero bytes and verify collation-sensitive duplicates manually')
) AS notes(mapping_rule, migration_attention)
ORDER BY mapping_rule;

-- Optional operator checklist output.
SELECT *
FROM (
    VALUES
        ('boundary', 'zm_api.sql contains only the 25 legacy tables'),
        ('boundary', 'referral_* tables are current PostgreSQL domain additions'),
        ('import_mode', 'load legacy data first, then run referral backfill strategy if needed'),
        ('risk', 'historical referral commission/withdrawal records cannot be restored losslessly from zm_api.sql alone')
) AS checklist(section_name, detail)
ORDER BY section_name, detail;

COMMIT;
