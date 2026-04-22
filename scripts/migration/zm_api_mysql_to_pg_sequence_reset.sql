-- zm_api MySQL dump to PostgreSQL sequence reset
-- Purpose:
-- 1. Reset all sequence-backed primary keys after bulk import.
-- 2. Cover both the 25 legacy tables and the 5 referral tables that exist in current PostgreSQL.

BEGIN;

DO $$
DECLARE
    target record;
    max_id bigint;
BEGIN
    FOR target IN
        SELECT *
        FROM (
            VALUES
                ('channels', 'id'),
                ('checkins', 'id'),
                ('custom_oauth_providers', 'id'),
                ('logs', 'id'),
                ('midjourneys', 'id'),
                ('models', 'id'),
                ('passkey_credentials', 'id'),
                ('prefill_groups', 'id'),
                ('quota_data', 'id'),
                ('redemptions', 'id'),
                ('setups', 'id'),
                ('subscription_orders', 'id'),
                ('subscription_plans', 'id'),
                ('subscription_pre_consume_records', 'id'),
                ('tasks', 'id'),
                ('tokens', 'id'),
                ('top_ups', 'id'),
                ('two_fa_backup_codes', 'id'),
                ('two_fas', 'id'),
                ('user_oauth_bindings', 'id'),
                ('user_subscriptions', 'id'),
                ('users', 'id'),
                ('vendors', 'id'),
                ('referral_plans', 'id'),
                ('referral_accounts', 'id'),
                ('referral_links', 'id'),
                ('referral_commissions', 'id'),
                ('referral_withdrawals', 'id')
        ) AS seq_targets(table_name, column_name)
    LOOP
        EXECUTE format('SELECT COALESCE(MAX(%I), 0) FROM public.%I', target.column_name, target.table_name)
        INTO max_id;

        PERFORM setval(
            pg_get_serial_sequence(format('public.%I', target.table_name), target.column_name),
            GREATEST(max_id, 1),
            max_id > 0
        );
    END LOOP;
END $$;

-- Report the reset coverage list for operator audit.
SELECT *
FROM (
    VALUES
        ('legacy', 'channels.id'),
        ('legacy', 'checkins.id'),
        ('legacy', 'custom_oauth_providers.id'),
        ('legacy', 'logs.id'),
        ('legacy', 'midjourneys.id'),
        ('legacy', 'models.id'),
        ('legacy', 'passkey_credentials.id'),
        ('legacy', 'prefill_groups.id'),
        ('legacy', 'quota_data.id'),
        ('legacy', 'redemptions.id'),
        ('legacy', 'setups.id'),
        ('legacy', 'subscription_orders.id'),
        ('legacy', 'subscription_plans.id'),
        ('legacy', 'subscription_pre_consume_records.id'),
        ('legacy', 'tasks.id'),
        ('legacy', 'tokens.id'),
        ('legacy', 'top_ups.id'),
        ('legacy', 'two_fa_backup_codes.id'),
        ('legacy', 'two_fas.id'),
        ('legacy', 'user_oauth_bindings.id'),
        ('legacy', 'user_subscriptions.id'),
        ('legacy', 'users.id'),
        ('legacy', 'vendors.id'),
        ('referral', 'referral_plans.id'),
        ('referral', 'referral_accounts.id'),
        ('referral', 'referral_links.id'),
        ('referral', 'referral_commissions.id'),
        ('referral', 'referral_withdrawals.id')
) AS reset_list(domain_name, sequence_target)
ORDER BY domain_name, sequence_target;

COMMIT;
