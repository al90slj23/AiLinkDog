package controller_test

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"reflect"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type referralAPIResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data"`
}

func setupReferralBehaviorTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	setupReferralControllerTestDBForBehavior()
	engine := gin.New()
	engine.Use(func(c *gin.Context) {
		c.Set("id", 101)
		c.Next()
	})
	group := engine.Group("/api/referral")
	{
		group.GET("/statistics", controller.GetReferralStatistics)
		group.GET("/balance", controller.GetReferralBalance)
		group.GET("/plans", controller.GetReferralPlans)
		group.GET("/links", controller.GetReferralLinks)
		group.POST("/links", controller.CreateReferralLink)
		group.GET("/commissions", controller.GetReferralCommissions)
		group.GET("/invitees", controller.GetReferralInvitees)
		group.GET("/withdrawals", controller.GetReferralWithdrawals)
		group.POST("/withdrawals", controller.CreateReferralWithdrawal)
	}
	return engine
}

func setupReferralControllerTestDBForBehavior() {
	dsn := "file:referral_behavior?mode=memory&cache=shared"
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	model.DB = db
	model.LOG_DB = db
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
		deleted_at DATETIME
	)`).Error; err != nil {
		panic(err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		plan_id INTEGER NOT NULL,
		locked_at DATETIME,
		created_at DATETIME,
		updated_at DATETIME
	)`).Error; err != nil {
		panic(err)
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
		panic(err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS referral_links (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		plan_id INTEGER NOT NULL,
		code TEXT,
		full_url TEXT,
		channel_note TEXT,
		validity_days INTEGER,
		expired_at DATETIME,
		is_active BOOLEAN,
		created_at DATETIME,
		updated_at DATETIME
	)`).Error; err != nil {
		panic(err)
	}
	if err := db.Exec(`CREATE TABLE IF NOT EXISTS options (
		key TEXT PRIMARY KEY,
		value TEXT
	)`).Error; err != nil {
		panic(err)
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
		panic(err)
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
		panic(err)
	}
	model.InitOptionMap()
	_ = model.DB.Exec("DELETE FROM referral_links").Error
	_ = model.DB.Exec("DELETE FROM referral_accounts").Error
	_ = model.DB.Exec("DELETE FROM referral_plans").Error
	_ = model.DB.Exec("DELETE FROM referral_commissions").Error
	_ = model.DB.Exec("DELETE FROM referral_withdrawals").Error
	_ = model.DB.Exec("DELETE FROM options").Error
	_ = model.DB.Exec("DELETE FROM users").Error

	user := &model.User{
		Id:              101,
		Username:        "referral-user",
		Password:        "password123",
		DisplayName:     "referral-user",
		AffCount:        7,
		AffQuota:        2300,
		AffHistoryQuota: 5200,
		AffCode:         "abcd",
		Status:          common.UserStatusEnabled,
		Role:            common.RoleCommonUser,
		Group:           "default",
	}
	_ = db.Create(user).Error
	_ = db.Create(&model.ReferralPlan{
		ID:                 1,
		Name:               "持续返利",
		Description:        "默认方案",
		PlanType:           1,
		IsActive:           true,
		ProfitSharePercent: 30,
		Level1Percent:      20,
		Level2Percent:      10,
	}).Error
	_ = db.Create(&model.ReferralAccount{UserID: user.Id, PlanID: 1}).Error
}

func performReferralRequest(t *testing.T, engine *gin.Engine, method string, path string, body any) *httptest.ResponseRecorder {
	t.Helper()

	var requestBody *bytes.Reader
	if body != nil {
		payload, err := common.Marshal(body)
		if err != nil {
			t.Fatalf("failed to marshal request body: %v", err)
		}
		requestBody = bytes.NewReader(payload)
	} else {
		requestBody = bytes.NewReader(nil)
	}

	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(method, path, requestBody)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	engine.ServeHTTP(recorder, req)
	return recorder
}

func decodeReferralAPIResponse(t *testing.T, recorder *httptest.ResponseRecorder) referralAPIResponse {
	t.Helper()

	var response referralAPIResponse
	if err := common.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("failed to decode referral api response: %v", err)
	}
	return response
}

func TestReferralReadEndpointsReturnSuccessMessageAndData(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	testCases := []string{
		"/api/referral/balance",
		"/api/referral/plans",
		"/api/referral/links",
		"/api/referral/commissions",
		"/api/referral/invitees",
		"/api/referral/withdrawals",
	}

	for _, path := range testCases {
		recorder := performReferralRequest(t, engine, http.MethodGet, path, nil)
		if recorder.Code != http.StatusOK {
			t.Fatalf("expected %s to return 200, got %d", path, recorder.Code)
		}

		response := decodeReferralAPIResponse(t, recorder)
		if !response.Success {
			t.Fatalf("expected %s success=true, got false with message %q", path, response.Message)
		}
		if response.Data == nil {
			t.Fatalf("expected %s response to include data", path)
		}
	}
}

func TestReferralSuccessResponseIncludesDataField(t *testing.T) {
	responseType := reflect.TypeOf(controller.ReferralSuccessResponse{})
	dataField, ok := responseType.FieldByName("Data")
	if !ok {
		t.Fatal("ReferralSuccessResponse should include Data")
	}
	if tag := dataField.Tag.Get("json"); tag != "data" {
		t.Fatalf("expected Data json tag to be data, got %q", tag)
	}
}

func TestCreateReferralLinkReturnsSuccessMessageAndData(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	recorder := performReferralRequest(t, engine, http.MethodPost, "/api/referral/links", map[string]any{
		"channel_note":  "seed",
		"validity_days": 1,
	})
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected create referral link request to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	if !response.Success {
		t.Fatalf("expected create referral link request to succeed, got message %q", response.Message)
	}
	if response.Data == nil {
		t.Fatal("expected create referral link response to include data")
	}
	links, err := model.ListReferralLinksByUserID(101)
	if err != nil {
		t.Fatalf("expected created link to be queryable, got %v", err)
	}
	if len(links) == 0 {
		t.Fatal("expected at least one referral link to be created")
	}
}

func TestCreateReferralWithdrawalReturnsSuccessMessageAndData(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	recorder := performReferralRequest(t, engine, http.MethodPost, "/api/referral/withdrawals", map[string]any{
		"amount":          800,
		"payment_method":  "alipay",
		"payment_account": "alice@example.com",
		"payment_name":    "Alice",
		"remark":          "first withdrawal",
	})
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected create referral withdrawal request to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	if !response.Success {
		t.Fatalf("expected create referral withdrawal request to succeed, got message %q", response.Message)
	}
	if response.Data == nil {
		t.Fatal("expected create referral withdrawal response to include data")
	}

	withdrawals, err := model.ListReferralWithdrawalsByUserID(101)
	if err != nil {
		t.Fatalf("expected created withdrawal to be queryable, got %v", err)
	}
	if len(withdrawals) != 1 {
		t.Fatalf("expected one withdrawal to be created, got %d", len(withdrawals))
	}
	if withdrawals[0].Amount != 800 {
		t.Fatalf("expected stored withdrawal amount=800, got %d", withdrawals[0].Amount)
	}
}

func decodeReferralData[T any](t *testing.T, raw any) T {
	t.Helper()

	payload, err := common.Marshal(raw)
	if err != nil {
		var zero T
		t.Fatalf("failed to marshal referral payload: %v", err)
		return zero
	}

	var data T
	if err := common.Unmarshal(payload, &data); err != nil {
		t.Fatalf("failed to decode referral payload: %v", err)
	}
	return data
}

func TestGetReferralCommissionsReturnsStoredRecords(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	if err := model.DB.Create(&model.ReferralCommission{
		UserID:          101,
		InviteeUserID:   202,
		ReferralLinkID:  1,
		PlanID:          1,
		Level:           1,
		TopUpAmount:     3000,
		CommissionQuota: 450,
		PlanSnapshot:    `{"name":"持续返利"}`,
		Status:          "settled",
	}).Error; err != nil {
		t.Fatalf("failed to create referral commission: %v", err)
	}

	if err := model.DB.Create(&model.ReferralCommission{
		UserID:          999,
		InviteeUserID:   303,
		ReferralLinkID:  2,
		PlanID:          1,
		Level:           1,
		TopUpAmount:     1000,
		CommissionQuota: 100,
		PlanSnapshot:    `{"name":"other"}`,
		Status:          "pending",
	}).Error; err != nil {
		t.Fatalf("failed to create unrelated referral commission: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodGet, "/api/referral/commissions", nil)
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected get referral commissions to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	commissions := decodeReferralData[[]model.ReferralCommission](t, response.Data)
	if len(commissions) != 1 {
		t.Fatalf("expected one commission for current user, got %d", len(commissions))
	}
	if commissions[0].CommissionQuota != 450 {
		t.Fatalf("expected commission quota=450, got %d", commissions[0].CommissionQuota)
	}
}

func TestGetReferralInviteesReturnsUsersByInviterID(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	invitee := &model.User{
		Id:              202,
		Username:        "invitee-user",
		Password:        "password123",
		DisplayName:     "Invitee User",
		InviterId:       101,
		AffQuota:        180,
		AffHistoryQuota: 360,
		Status:          common.UserStatusEnabled,
		Role:            common.RoleCommonUser,
		Group:           "default",
	}
	if err := model.DB.Create(invitee).Error; err != nil {
		t.Fatalf("failed to create invitee user: %v", err)
	}
	if err := model.DB.Create(&model.User{
		Id:          203,
		Username:    "other-user",
		Password:    "password123",
		DisplayName: "Other User",
		InviterId:   999,
		Status:      common.UserStatusEnabled,
		Role:        common.RoleCommonUser,
		Group:       "default",
	}).Error; err != nil {
		t.Fatalf("failed to create unrelated user: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodGet, "/api/referral/invitees", nil)
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected get referral invitees to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	invitees := decodeReferralData[[]map[string]any](t, response.Data)
	if len(invitees) != 1 {
		t.Fatalf("expected one invitee for current user, got %d", len(invitees))
	}
	if invitees[0]["username"] != "invitee-user" {
		t.Fatalf("expected invitee username=invitee-user, got %v", invitees[0]["username"])
	}
}

func TestGetReferralWithdrawalsReturnsStoredRecords(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	if err := model.DB.Create(&model.ReferralWithdrawal{
		UserID:         101,
		Amount:         1000,
		Fee:            15,
		ActualAmount:   985,
		PaymentMethod:  "wechat",
		PaymentAccount: "wx-123",
		PaymentName:    "Alice",
		Remark:         "queued",
		Status:         "pending",
	}).Error; err != nil {
		t.Fatalf("failed to create referral withdrawal: %v", err)
	}
	if err := model.DB.Create(&model.ReferralWithdrawal{
		UserID:         999,
		Amount:         2000,
		Fee:            20,
		ActualAmount:   1980,
		PaymentMethod:  "alipay",
		PaymentAccount: "other@example.com",
		Status:         "approved",
	}).Error; err != nil {
		t.Fatalf("failed to create unrelated referral withdrawal: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodGet, "/api/referral/withdrawals", nil)
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected get referral withdrawals to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	withdrawals := decodeReferralData[[]model.ReferralWithdrawal](t, response.Data)
	if len(withdrawals) != 1 {
		t.Fatalf("expected one withdrawal for current user, got %d", len(withdrawals))
	}
	if withdrawals[0].ActualAmount != 985 {
		t.Fatalf("expected actual_amount=985, got %d", withdrawals[0].ActualAmount)
	}
}

func TestCreateReferralWithdrawalValidatesPayload(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	recorder := performReferralRequest(t, engine, http.MethodPost, "/api/referral/withdrawals", map[string]any{
		"amount":          0,
		"payment_method":  "",
		"payment_account": "",
	})
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected invalid create referral withdrawal request to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	if response.Success {
		t.Fatal("expected invalid withdrawal payload to fail")
	}
}

func TestGetReferralStatisticsSubtractsPendingWithdrawals(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	if err := model.DB.Create(&model.ReferralWithdrawal{
		UserID:         101,
		Amount:         500,
		Fee:            10,
		ActualAmount:   490,
		PaymentMethod:  "alipay",
		PaymentAccount: "alice@example.com",
		Status:         "pending",
	}).Error; err != nil {
		t.Fatalf("failed to create pending referral withdrawal: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodGet, "/api/referral/statistics", nil)
	response := decodeReferralAPIResponse(t, recorder)
	data := decodeReferralStatisticsData(t, response.Data)
	if data.PendingBalance != 500 {
		t.Fatalf("expected pending_balance=500, got %d", data.PendingBalance)
	}
	if data.WithdrawableBalance != 1800 {
		t.Fatalf("expected withdrawable_balance=1800, got %d", data.WithdrawableBalance)
	}
}

func TestCreateReferralWithdrawalRejectsAmountExceedingAvailableBalanceAfterPending(t *testing.T) {
	engine := setupReferralBehaviorTestRouter()

	if err := model.DB.Create(&model.ReferralWithdrawal{
		UserID:         101,
		Amount:         2000,
		Fee:            20,
		ActualAmount:   1980,
		PaymentMethod:  "wechat",
		PaymentAccount: "wx-1",
		Status:         "pending",
	}).Error; err != nil {
		t.Fatalf("failed to create pending referral withdrawal: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodPost, "/api/referral/withdrawals", map[string]any{
		"amount":          500,
		"payment_method":  "alipay",
		"payment_account": "alice@example.com",
	})
	response := decodeReferralAPIResponse(t, recorder)
	if response.Success {
		t.Fatal("expected withdrawal exceeding reserved balance to fail")
	}
}

type referralStatisticsData struct {
	AffCount            int `json:"aff_count"`
	AffQuota            int `json:"aff_quota"`
	AffHistoryQuota     int `json:"aff_history_quota"`
	ReferralPlanID      int `json:"referral_plan_id"`
	TotalInvites        int `json:"total_invites"`
	TotalEarnings       int `json:"total_earnings"`
	WithdrawableBalance int `json:"withdrawable_balance"`
	PendingBalance      int `json:"pending_balance"`
	InviteeCount        int `json:"invitee_count"`
}

func setupReferralControllerTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	gin.SetMode(gin.TestMode)

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open sqlite db: %v", err)
	}
	previousDB := model.DB
	previousLogDB := model.LOG_DB
	model.DB = db
	model.LOG_DB = db

	if err := db.AutoMigrate(&model.User{}, &model.ReferralAccount{}, &model.ReferralWithdrawal{}); err != nil {
		t.Fatalf("failed to migrate referral test tables: %v", err)
	}

	t.Cleanup(func() {
		model.DB = previousDB
		model.LOG_DB = previousLogDB
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	})

	return db
}

func decodeReferralStatisticsData(t *testing.T, raw any) referralStatisticsData {
	t.Helper()

	payload, err := common.Marshal(raw)
	if err != nil {
		t.Fatalf("failed to marshal referral statistics data: %v", err)
	}

	var data referralStatisticsData
	dataBytes := append([]byte(nil), payload...)
	if err := common.Unmarshal(dataBytes, &data); err != nil {
		t.Fatalf("failed to decode referral statistics data: %v", err)
	}
	return data
}

func TestReferralControllersUseCommonJSONWrappers(t *testing.T) {
	content, err := os.ReadFile("referral.go")
	if err != nil {
		t.Fatalf("failed to read referral controller source: %v", err)
	}

	source := string(content)
	if strings.Contains(source, "ShouldBindJSON") {
		t.Fatal("referral controller should not use ShouldBindJSON")
	}
	if !strings.Contains(source, "common.DecodeJson") {
		t.Fatal("referral controller should use common.DecodeJson")
	}
}

func TestReferralControllerTestUsesCommonUnmarshalAndPreservesDBFlags(t *testing.T) {
	content, err := os.ReadFile("referral_test.go")
	if err != nil {
		t.Fatalf("failed to read referral controller test source: %v", err)
	}

	source := string(content)
	if strings.Contains(source, "import (\n\t\"encoding/json\"") || strings.Contains(source, "\n\t\"encoding/json\"\n") {
		t.Fatal("referral controller tests should not import encoding/json")
	}
	if strings.Contains(source, "common.Unmarshal(payload") {
		return
	}
	if strings.Contains(source, " json.Unmarshal(") || strings.Contains(source, "= json.Unmarshal(") {
		t.Fatal("referral controller tests should use common.Unmarshal")
	}
	for _, forbidden := range []string{"common.UsingSQLite", "common.UsingMySQL", "common.UsingPostgreSQL"} {
		if strings.Contains(source, forbidden) {
			t.Fatalf("referral controller tests should not modify %s", forbidden)
		}
	}
}

func TestGetReferralStatisticsBridgesExistingUserFields(t *testing.T) {
	db := setupReferralControllerTestDB(t)

	user := &model.User{
		Id:              101,
		Username:        "referral-user",
		Password:        "password123",
		DisplayName:     "referral-user",
		AffCount:        7,
		AffQuota:        2300,
		AffHistoryQuota: 5200,
		Status:          common.UserStatusEnabled,
		Role:            common.RoleCommonUser,
		Group:           "default",
	}
	if err := db.Create(user).Error; err != nil {
		t.Fatalf("failed to create user: %v", err)
	}

	account := &model.ReferralAccount{UserID: user.Id, PlanID: 12}
	if err := db.Create(account).Error; err != nil {
		t.Fatalf("failed to create referral account: %v", err)
	}

	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/api/referral/statistics", nil)
	ctx.Set("id", user.Id)

	controller.GetReferralStatistics(ctx)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected get referral statistics to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	if !response.Success {
		t.Fatalf("expected get referral statistics to succeed, got message %q", response.Message)
	}

	data := decodeReferralStatisticsData(t, response.Data)
	if data.AffCount != user.AffCount {
		t.Fatalf("expected aff_count=%d, got %d", user.AffCount, data.AffCount)
	}
	if data.AffQuota != user.AffQuota {
		t.Fatalf("expected aff_quota=%d, got %d", user.AffQuota, data.AffQuota)
	}
	if data.AffHistoryQuota != user.AffHistoryQuota {
		t.Fatalf("expected aff_history_quota=%d, got %d", user.AffHistoryQuota, data.AffHistoryQuota)
	}
	if data.ReferralPlanID != account.PlanID {
		t.Fatalf("expected referral_plan_id=%d, got %d", account.PlanID, data.ReferralPlanID)
	}
	if data.TotalInvites != user.AffCount {
		t.Fatalf("expected total_invites=%d, got %d", user.AffCount, data.TotalInvites)
	}
	if data.TotalEarnings != user.AffHistoryQuota {
		t.Fatalf("expected total_earnings=%d, got %d", user.AffHistoryQuota, data.TotalEarnings)
	}
	if data.WithdrawableBalance != user.AffQuota {
		t.Fatalf("expected withdrawable_balance=%d, got %d", user.AffQuota, data.WithdrawableBalance)
	}
	if data.PendingBalance != 0 {
		t.Fatalf("expected pending_balance=0, got %d", data.PendingBalance)
	}
}
