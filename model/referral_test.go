package model

import (
	"fmt"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func setupReferralModelTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	db, err := gorm.Open(sqlite.Open("file:referral_model?mode=memory&cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open sqlite db: %v", err)
	}
	previousDB := DB
	DB = db
	t.Cleanup(func() {
		DB = previousDB
		sqlDB, sqlErr := db.DB()
		if sqlErr == nil {
			_ = sqlDB.Close()
		}
	})

	if err := db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY,
		username TEXT,
		password TEXT,
		display_name TEXT,
		role INTEGER,
		status INTEGER,
		email TEXT,
		github_id TEXT,
		discord_id TEXT,
		oidc_id TEXT,
		wechat_id TEXT,
		telegram_id TEXT,
		access_token TEXT,
		quota INTEGER,
		used_quota INTEGER,
		request_count INTEGER,
		"group" TEXT,
		aff_code TEXT,
		aff_count INTEGER,
		aff_quota INTEGER,
		aff_history INTEGER,
		inviter_id INTEGER,
		setting TEXT,
		remark TEXT,
		stripe_customer TEXT,
		linux_do_id TEXT,
		created_at DATETIME,
		updated_at DATETIME,
		deleted_at DATETIME
	)`).Error; err != nil {
		t.Fatalf("failed to create users table: %v", err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_commissions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		invitee_user_id INTEGER NOT NULL,
		referral_link_id INTEGER NOT NULL,
		plan_id INTEGER NOT NULL,
		level INTEGER NOT NULL,
		top_up_amount INTEGER NOT NULL,
		commission_quota INTEGER NOT NULL,
		plan_snapshot TEXT NOT NULL,
		status TEXT NOT NULL,
		created_at DATETIME,
		updated_at DATETIME
	)`).Error; err != nil {
		t.Fatalf("failed to create referral_commissions table: %v", err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_withdrawals (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		amount INTEGER NOT NULL,
		fee INTEGER NOT NULL,
		actual_amount INTEGER NOT NULL,
		payment_method TEXT NOT NULL,
		payment_account TEXT NOT NULL,
		payment_name TEXT DEFAULT '',
		remark TEXT DEFAULT '',
		admin_remark TEXT DEFAULT '',
		status TEXT NOT NULL,
		created_at DATETIME,
		updated_at DATETIME
	)`).Error; err != nil {
		t.Fatalf("failed to create referral_withdrawals table: %v", err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_plans (
		id INTEGER PRIMARY KEY,
		name TEXT,
		description TEXT,
		plan_type INTEGER,
		is_active BOOLEAN,
		profit_share_percent REAL,
		min_channel_profit REAL,
		level1_percent REAL,
		level2_percent REAL,
		created_at DATETIME,
		updated_at DATETIME
	)`).Error; err != nil {
		t.Fatalf("failed to create referral_plans table: %v", err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		plan_id INTEGER NOT NULL,
		locked_at DATETIME,
		created_at DATETIME,
		updated_at DATETIME
	)`).Error; err != nil {
		t.Fatalf("failed to create referral_accounts table: %v", err)
	}

	_ = db.Exec("DELETE FROM users").Error
	_ = db.Exec("DELETE FROM referral_commissions").Error
	_ = db.Exec("DELETE FROM referral_withdrawals").Error
	_ = db.Exec("DELETE FROM referral_plans").Error
	_ = db.Exec("DELETE FROM referral_accounts").Error

	return db
}

func TestReferralAccountLockedAtDefaultsToNil(t *testing.T) {
	account := ReferralAccount{}

	if account.LockedAt != nil {
		t.Fatalf("expected unlocked account to have nil locked_at")
	}
}

func TestReferralAccountLocksPlanAtAccountLevel(t *testing.T) {
	account := ReferralAccount{UserID: 1, PlanID: 2}
	linkA := ReferralLink{UserID: 1, PlanID: 2, ChannelNote: "xiaohongshu"}
	linkB := ReferralLink{UserID: 1, PlanID: 2, ChannelNote: "douyin"}

	if account.PlanID != linkA.PlanID || account.PlanID != linkB.PlanID {
		t.Fatalf("expected all links to follow account plan")
	}
}

func TestReferralCommissionUsesUnifiedPlanID(t *testing.T) {
	commission := ReferralCommission{PlanID: 3}

	if commission.PlanID != 3 {
		t.Fatalf("expected commission to store plan id on unified field")
	}
}

func TestReferralLinkCarriesChannelNote(t *testing.T) {
	link := ReferralLink{ChannelNote: "wechat-group"}
	if link.ChannelNote == "" {
		t.Fatalf("expected channel note to be stored")
	}
}

func TestReferralOptionKeysExist(t *testing.T) {
	previousOptionMap := common.OptionMap
	t.Cleanup(func() {
		common.OptionMap = previousOptionMap
	})

	initOptionMapDefaults()

	keys := []string{
		"ReferralEnabled",
		"ReferralDefaultLinkValidityDays",
		"ReferralAllowCustomLinkValidity",
		"ReferralMinWithdrawalAmount",
		"ReferralWithdrawalFeePercent",
		"ReferralWithdrawalFeeFixed",
		"ReferralAutoApproveWithdrawal",
		"ReferralCommissionCapEnabled",
		"ReferralMonthlyCommissionCap",
	}

	for _, key := range keys {
		if _, ok := common.OptionMap[key]; !ok {
			t.Fatalf("missing option key %s", key)
		}
	}
}

func TestReferralAllowCustomLinkValidityDefaultsToTrue(t *testing.T) {
	if !common.ReferralAllowCustomLinkValidity {
		t.Fatalf("expected custom referral link validity to be enabled by default")
	}
}

func TestReferralOptionParseErrors(t *testing.T) {
	previousOptionMap := common.OptionMap
	common.OptionMap = map[string]string{}
	t.Cleanup(func() {
		common.OptionMap = previousOptionMap
	})

	tests := []struct {
		key string
	}{
		{key: "ReferralDefaultLinkValidityDays"},
		{key: "ReferralMinWithdrawalAmount"},
		{key: "ReferralWithdrawalFeePercent"},
		{key: "ReferralWithdrawalFeeFixed"},
		{key: "ReferralMonthlyCommissionCap"},
	}

	for _, tt := range tests {
		if err := updateOptionMap(tt.key, "not-a-number"); err == nil {
			t.Fatalf("expected parse error for %s", tt.key)
		}
	}
}

func TestProcessReferralCommissionsForTopUpCreatesLevelOneAndLevelTwo(t *testing.T) {
	db, cleanup := setupReferralUnitTestDB(t)
	defer cleanup()

	seedReferralUser(t, db, &User{Id: 1, Username: "a", Password: "p", DisplayName: "a", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Group: "default", AffCode: "a001"})
	seedReferralUser(t, db, &User{Id: 2, Username: "b", Password: "p", DisplayName: "b", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Group: "default", AffCode: "b001", InviterId: 1})
	seedReferralUser(t, db, &User{Id: 3, Username: "c", Password: "p", DisplayName: "c", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Group: "default", AffCode: "c001", InviterId: 2})

	plan := &ReferralPlan{ID: 1, Name: "持续返利", PlanType: 1, IsActive: true, ProfitSharePercent: 80, MinChannelProfit: 20, Level1Percent: 60, Level2Percent: 40}
	if err := db.Create(plan).Error; err != nil {
		t.Fatalf("failed to create plan: %v", err)
	}
	if err := db.Create(&ReferralAccount{UserID: 2, PlanID: 1}).Error; err != nil {
		t.Fatalf("failed to create level1 referral account: %v", err)
	}
	if err := db.Create(&ReferralAccount{UserID: 1, PlanID: 1}).Error; err != nil {
		t.Fatalf("failed to create level2 referral account: %v", err)
	}
	if err := db.Create(&ReferralLink{ID: 1, UserID: 2, PlanID: 1, Code: "code-b", FullURL: "http://x/b"}).Error; err != nil {
		t.Fatalf("failed to create level1 link: %v", err)
	}
	if err := db.Create(&ReferralLink{ID: 2, UserID: 1, PlanID: 1, Code: "code-a", FullURL: "http://x/a"}).Error; err != nil {
		t.Fatalf("failed to create level2 link: %v", err)
	}

	if err := ProcessReferralCommissionsForTopUp(3, 100); err != nil {
		t.Fatalf("expected commission processing to succeed, got %v", err)
	}

	commissions, err := ListReferralCommissionsByUserID(2)
	if err != nil {
		t.Fatalf("failed to list level1 commissions: %v", err)
	}
	if len(commissions) != 1 {
		t.Fatalf("expected 1 level1 commission, got %d", len(commissions))
	}
	if commissions[0].CommissionQuota != 9 {
		t.Fatalf("expected level1 quota 9, got %d", commissions[0].CommissionQuota)
	}
	if commissions[0].Status != "pending" {
		t.Fatalf("expected level1 status pending, got %s", commissions[0].Status)
	}

	level2Commissions, err := ListReferralCommissionsByUserID(1)
	if err != nil {
		t.Fatalf("failed to list level2 commissions: %v", err)
	}
	if len(level2Commissions) != 1 {
		t.Fatalf("expected 1 level2 commission, got %d", len(level2Commissions))
	}
	if level2Commissions[0].CommissionQuota != 6 {
		t.Fatalf("expected level2 quota 6, got %d", level2Commissions[0].CommissionQuota)
	}
}

func setupReferralUnitTestDB(t *testing.T) (*gorm.DB, func()) {
	t.Helper()
	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open sqlite db: %v", err)
	}
	previousDB := DB
	DB = db
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, display_name TEXT, role INTEGER, status INTEGER, email TEXT, github_id TEXT, discord_id TEXT, oidc_id TEXT, wechat_id TEXT, telegram_id TEXT, access_token TEXT, quota INTEGER, used_quota INTEGER, request_count INTEGER, "group" TEXT, aff_code TEXT, aff_count INTEGER, aff_quota INTEGER, aff_history INTEGER, inviter_id INTEGER, deleted_at DATETIME, linux_do_id TEXT, setting TEXT, remark TEXT, stripe_customer TEXT)`).Error; err != nil {
		t.Fatalf("failed to create users table: %v", err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_plans (id INTEGER PRIMARY KEY, name TEXT, description TEXT, plan_type INTEGER, is_active BOOLEAN, profit_share_percent REAL, min_channel_profit REAL, level1_percent REAL, level2_percent REAL, created_at DATETIME, updated_at DATETIME)`).Error; err != nil {
		t.Fatalf("failed to create referral_plans table: %v", err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, plan_id INTEGER, locked_at DATETIME, created_at DATETIME, updated_at DATETIME)`).Error; err != nil {
		t.Fatalf("failed to create referral_accounts table: %v", err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_links (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, plan_id INTEGER, code TEXT, full_url TEXT, channel_note TEXT, validity_days INTEGER, expired_at DATETIME, is_active BOOLEAN, created_at DATETIME, updated_at DATETIME)`).Error; err != nil {
		t.Fatalf("failed to create referral_links table: %v", err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_commissions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, invitee_user_id INTEGER, referral_link_id INTEGER, plan_id INTEGER, level INTEGER, top_up_amount INTEGER, commission_quota INTEGER, plan_snapshot TEXT, status TEXT, created_at DATETIME, updated_at DATETIME)`).Error; err != nil {
		t.Fatalf("failed to create referral_commissions table: %v", err)
	}
	cleanup := func() {
		DB = previousDB
		sqlDB, _ := db.DB()
		_ = sqlDB.Close()
	}
	return db, cleanup
}

func seedReferralUser(t *testing.T, db *gorm.DB, user *User) {
	t.Helper()
	if err := db.Create(user).Error; err != nil {
		t.Fatalf("failed to create user %s: %v", user.Username, err)
	}
}

func TestListReferralCommissionsByUserIDFiltersCurrentUser(t *testing.T) {
	setupReferralModelTestDB(t)

	if err := DB.Create(&ReferralCommission{UserID: 1, InviteeUserID: 11, ReferralLinkID: 1, PlanID: 1, Level: 1, TopUpAmount: 1000, CommissionQuota: 200, PlanSnapshot: "{}", Status: "pending"}).Error; err != nil {
		t.Fatalf("failed to create commission: %v", err)
	}
	if err := DB.Create(&ReferralCommission{UserID: 2, InviteeUserID: 12, ReferralLinkID: 2, PlanID: 1, Level: 1, TopUpAmount: 2000, CommissionQuota: 300, PlanSnapshot: "{}", Status: "settled"}).Error; err != nil {
		t.Fatalf("failed to create unrelated commission: %v", err)
	}

	commissions, err := ListReferralCommissionsByUserID(1)
	if err != nil {
		t.Fatalf("expected list referral commissions to succeed, got %v", err)
	}
	if len(commissions) != 1 {
		t.Fatalf("expected one commission, got %d", len(commissions))
	}
	if commissions[0].CommissionQuota != 200 {
		t.Fatalf("expected commission quota=200, got %d", commissions[0].CommissionQuota)
	}
}

func TestListReferralInviteesByInviterIDReturnsSelectedFields(t *testing.T) {
	setupReferralModelTestDB(t)

	if err := DB.Create(&User{Id: 11, Username: "invitee", Password: "password123", DisplayName: "Invitee", Email: "invitee@example.com", InviterId: 1, AffQuota: 20, AffHistoryQuota: 80, Status: common.UserStatusEnabled, Role: common.RoleCommonUser, Group: "default"}).Error; err != nil {
		t.Fatalf("failed to create invitee: %v", err)
	}
	if err := DB.Create(&User{Id: 12, Username: "other", Password: "password123", DisplayName: "Other", InviterId: 2, Status: common.UserStatusEnabled, Role: common.RoleCommonUser, Group: "default"}).Error; err != nil {
		t.Fatalf("failed to create unrelated user: %v", err)
	}

	invitees, err := ListReferralInviteesByInviterID(1)
	if err != nil {
		t.Fatalf("expected list referral invitees to succeed, got %v", err)
	}
	if len(invitees) != 1 {
		t.Fatalf("expected one invitee, got %d", len(invitees))
	}
	if invitees[0].Username != "invitee" {
		t.Fatalf("expected username=invitee, got %s", invitees[0].Username)
	}
	if invitees[0].AffHistoryQuota != 80 {
		t.Fatalf("expected aff_history_quota=80, got %d", invitees[0].AffHistoryQuota)
	}
}

func TestCreateAndListReferralWithdrawalsByUserID(t *testing.T) {
	setupReferralModelTestDB(t)

	if err := CreateReferralWithdrawal(&ReferralWithdrawal{UserID: 1, Amount: 900, Fee: 20, ActualAmount: 880, PaymentMethod: "alipay", PaymentAccount: "alice@example.com", Status: "pending"}); err != nil {
		t.Fatalf("expected create referral withdrawal to succeed, got %v", err)
	}
	if err := CreateReferralWithdrawal(&ReferralWithdrawal{UserID: 2, Amount: 1000, Fee: 10, ActualAmount: 990, PaymentMethod: "wechat", PaymentAccount: "wx-1", Status: "approved"}); err != nil {
		t.Fatalf("expected create unrelated referral withdrawal to succeed, got %v", err)
	}

	withdrawals, err := ListReferralWithdrawalsByUserID(1)
	if err != nil {
		t.Fatalf("expected list referral withdrawals to succeed, got %v", err)
	}
	if len(withdrawals) != 1 {
		t.Fatalf("expected one withdrawal, got %d", len(withdrawals))
	}
	if withdrawals[0].ActualAmount != 880 {
		t.Fatalf("expected actual_amount=880, got %d", withdrawals[0].ActualAmount)
	}
}

func TestListReferralPlanOverviewStatisticsAggregatesByPlan(t *testing.T) {
	setupReferralModelTestDB(t)

	if err := DB.Create(&ReferralPlan{ID: 1, Name: "持续返利", PlanType: 1, IsActive: true}).Error; err != nil {
		t.Fatalf("failed to create plan 1: %v", err)
	}
	if err := DB.Create(&ReferralPlan{ID: 2, Name: "一次性买断", PlanType: 2, IsActive: false}).Error; err != nil {
		t.Fatalf("failed to create plan 2: %v", err)
	}
	if err := DB.Model(&ReferralPlan{}).Where("id = ?", 2).Update("is_active", false).Error; err != nil {
		t.Fatalf("failed to disable plan 2: %v", err)
	}
	if err := DB.Create(&ReferralAccount{UserID: 11, PlanID: 1}).Error; err != nil {
		t.Fatalf("failed to create plan 1 account #1: %v", err)
	}
	if err := DB.Create(&ReferralAccount{UserID: 12, PlanID: 1}).Error; err != nil {
		t.Fatalf("failed to create plan 1 account #2: %v", err)
	}
	if err := DB.Create(&ReferralAccount{UserID: 13, PlanID: 2}).Error; err != nil {
		t.Fatalf("failed to create plan 2 account: %v", err)
	}
	if err := DB.Create(&ReferralCommission{UserID: 1, InviteeUserID: 11, ReferralLinkID: 1, PlanID: 1, Level: 1, TopUpAmount: 1000, CommissionQuota: 300, PlanSnapshot: "{}", Status: "settled"}).Error; err != nil {
		t.Fatalf("failed to create plan 1 level1 commission: %v", err)
	}
	if err := DB.Create(&ReferralCommission{UserID: 1, InviteeUserID: 12, ReferralLinkID: 2, PlanID: 1, Level: 2, TopUpAmount: 1000, CommissionQuota: 120, PlanSnapshot: "{}", Status: "settled"}).Error; err != nil {
		t.Fatalf("failed to create plan 1 level2 commission: %v", err)
	}
	if err := DB.Create(&ReferralCommission{UserID: 1, InviteeUserID: 13, ReferralLinkID: 3, PlanID: 2, Level: 1, TopUpAmount: 1000, CommissionQuota: 80, PlanSnapshot: "{}", Status: "pending"}).Error; err != nil {
		t.Fatalf("failed to create plan 2 level1 commission: %v", err)
	}

	items, err := ListReferralPlanOverviewStatistics()
	if err != nil {
		t.Fatalf("expected list referral plan overview statistics to succeed, got %v", err)
	}
	if len(items) != 2 {
		t.Fatalf("expected 2 plan overview items, got %d", len(items))
	}

	if items[0].PlanID != 1 || items[0].SelectedAccountCount != 2 || items[0].Level1CommissionQuota != 300 || items[0].Level2CommissionQuota != 120 || items[0].TotalCommissionQuota != 420 {
		t.Fatalf("unexpected plan 1 overview: %+v", items[0])
	}
	if items[1].PlanID != 2 || items[1].SelectedAccountCount != 1 || items[1].Level1CommissionQuota != 80 || items[1].Level2CommissionQuota != 0 || items[1].TotalCommissionQuota != 80 {
		t.Fatalf("unexpected plan 2 overview: %+v", items[1])
	}
}

func TestEnsureDefaultReferralPlansKeepsCustomPlans(t *testing.T) {
	setupReferralModelTestDB(t)

	if err := DB.Create(&ReferralPlan{ID: 9, Name: "自定义方案", Description: "管理员新增", PlanType: 1, IsActive: true, ProfitSharePercent: 70, MinChannelProfit: 20, Level1Percent: 60, Level2Percent: 40}).Error; err != nil {
		t.Fatalf("failed to create custom plan: %v", err)
	}

	if err := EnsureDefaultReferralPlans(); err != nil {
		t.Fatalf("expected EnsureDefaultReferralPlans to succeed, got %v", err)
	}

	plans, err := ListReferralPlans(false)
	if err != nil {
		t.Fatalf("failed to list plans: %v", err)
	}
	if len(plans) != 3 {
		t.Fatalf("expected 3 plans after keeping custom plan, got %d", len(plans))
	}
	if plans[2].ID != 9 {
		t.Fatalf("expected custom plan to remain, got %+v", plans[2])
	}
}
