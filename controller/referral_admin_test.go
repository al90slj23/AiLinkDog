package controller_test

import (
	"net/http"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

type referralAdminStatisticsData struct {
	ActiveReferrers      int64 `json:"active_referrers"`
	TotalInvites         int64 `json:"total_invites"`
	PlanCount            int64 `json:"plan_count"`
	ActivePlanCount      int64 `json:"active_plan_count"`
	PendingWithdrawals   int64 `json:"pending_withdrawals"`
	TotalReferralPayout  int64 `json:"total_referral_payout"`
	PlanOverview         []referralAdminPlanOverviewItem `json:"plan_overview"`
}

type referralAdminPlanOverviewItem struct {
	PlanID                    int    `json:"plan_id"`
	Name                      string `json:"name"`
	PlanType                  int    `json:"plan_type"`
	SelectedAccountCount      int64  `json:"selected_account_count"`
	Level1CommissionQuota     int64  `json:"level1_commission_quota"`
	Level2CommissionQuota     int64  `json:"level2_commission_quota"`
	TotalCommissionQuota      int64  `json:"total_commission_quota"`
	IsActive                  bool   `json:"is_active"`
}

type referralAdminWithdrawalItem struct {
	ID             int    `json:"id"`
	UserID         int    `json:"user_id"`
	Amount         int64  `json:"amount"`
	ActualAmount   int64  `json:"actual_amount"`
	PaymentMethod  string `json:"payment_method"`
	PaymentAccount string `json:"payment_account"`
	PaymentName    string `json:"payment_name"`
	AdminRemark    string `json:"admin_remark"`
	Status         string `json:"status"`
	Username       string `json:"username"`
	DisplayName    string `json:"display_name"`
}

func decodeReferralAdminStatisticsData(t *testing.T, raw any) referralAdminStatisticsData {
	t.Helper()

	payload, err := common.Marshal(raw)
	if err != nil {
		t.Fatalf("failed to marshal referral admin statistics data: %v", err)
	}

	var data referralAdminStatisticsData
	if err := common.Unmarshal(payload, &data); err != nil {
		t.Fatalf("failed to decode referral admin statistics data: %v", err)
	}
	return data
}

func setupReferralAdminBehaviorTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	setupReferralControllerTestDBForBehavior()
	engine := gin.New()
	group := engine.Group("/api/referral/admin")
	{
		group.GET("/statistics", controller.GetReferralAdminStatistics)
		group.GET("/plans", controller.GetReferralAdminPlans)
		group.PUT("/plans", controller.UpdateReferralAdminPlans)
		group.GET("/setting", controller.GetReferralAdminSetting)
		group.PUT("/setting", controller.UpdateReferralAdminSetting)
		group.GET("/withdrawals", controller.GetReferralAdminWithdrawals)
		group.POST("/withdrawals/process", controller.ProcessReferralAdminWithdrawal)
	}
	return engine
}

func TestReferralAdminRoutesExist(t *testing.T) {
	engine := setupReferralRouteRegistryRouter()

	routes := make(map[string]struct{}, len(engine.Routes()))
	for _, routeInfo := range engine.Routes() {
		routes[routeInfo.Method+" "+routeInfo.Path] = struct{}{}
	}

	testCases := []struct {
		method string
		path   string
	}{
		{method: http.MethodGet, path: "/api/referral/admin/statistics"},
		{method: http.MethodGet, path: "/api/referral/admin/plans"},
		{method: http.MethodPut, path: "/api/referral/admin/plans"},
		{method: http.MethodGet, path: "/api/referral/admin/setting"},
		{method: http.MethodPut, path: "/api/referral/admin/setting"},
		{method: http.MethodGet, path: "/api/referral/admin/withdrawals"},
		{method: http.MethodPost, path: "/api/referral/admin/withdrawals/process"},
	}

	for _, tc := range testCases {
		if _, ok := routes[tc.method+" "+tc.path]; !ok {
			t.Fatalf("expected route %s %s to exist", tc.method, tc.path)
		}
	}
}

func TestReferralAdminReadEndpointsReturnSuccessMessageAndData(t *testing.T) {
	engine := setupReferralAdminBehaviorTestRouter()

	testCases := []string{
		"/api/referral/admin/statistics",
		"/api/referral/admin/plans",
		"/api/referral/admin/setting",
		"/api/referral/admin/withdrawals",
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

func TestReferralAdminWriteEndpointsReturnSuccessMessageAndData(t *testing.T) {
	engine := setupReferralAdminBehaviorTestRouter()

	testCases := []struct {
		method string
		path   string
		body   any
	}{
		{method: http.MethodPut, path: "/api/referral/admin/plans", body: map[string]any{"id": 1, "name": "持续返利", "description": "更新描述", "plan_type": 1, "is_active": true, "profit_share_percent": 80, "min_channel_profit": 20, "level1_percent": 60, "level2_percent": 40}},
		{method: http.MethodPut, path: "/api/referral/admin/setting", body: map[string]any{"enabled": true}},
		{method: http.MethodPost, path: "/api/referral/admin/withdrawals/process", body: map[string]any{"withdrawal_id": 1}},
	}

	for _, tc := range testCases {
		recorder := performReferralRequest(t, engine, tc.method, tc.path, tc.body)
		if recorder.Code != http.StatusOK {
			t.Fatalf("expected %s %s to return 200, got %d", tc.method, tc.path, recorder.Code)
		}

		response := decodeReferralAPIResponse(t, recorder)
		if !response.Success {
			t.Fatalf("expected %s %s success=true, got false with message %q", tc.method, tc.path, response.Message)
		}
		if response.Data == nil {
			t.Fatalf("expected %s %s response to include data", tc.method, tc.path)
		}
	}

	plans, err := model.ListReferralPlans(false)
	if err != nil {
		t.Fatalf("expected referral plans to remain queryable, got %v", err)
	}
	if len(plans) == 0 {
		t.Fatal("expected at least one referral plan to exist after admin update")
	}
}

func TestReferralAdminStatisticsExposeManageOverviewFields(t *testing.T) {
	engine := setupReferralAdminBehaviorTestRouter()

	recorder := performReferralRequest(t, engine, http.MethodGet, "/api/referral/admin/statistics", nil)
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected statistics endpoint to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	if !response.Success {
		t.Fatalf("expected statistics endpoint to succeed, got message %q", response.Message)
	}

	data := decodeReferralAdminStatisticsData(t, response.Data)
	if data.ActiveReferrers != 1 {
		t.Fatalf("expected active_referrers=1, got %d", data.ActiveReferrers)
	}
	if data.TotalInvites != 0 {
		t.Fatalf("expected total_invites=0 before creating invited users, got %d", data.TotalInvites)
	}
	if data.PlanCount != 2 {
		t.Fatalf("expected plan_count=2, got %d", data.PlanCount)
	}
	if data.ActivePlanCount != 2 {
		t.Fatalf("expected active_plan_count=2, got %d", data.ActivePlanCount)
	}
	if data.PendingWithdrawals != 0 {
		t.Fatalf("expected pending_withdrawals to default to 0, got %d", data.PendingWithdrawals)
	}
	if data.TotalReferralPayout != 0 {
		t.Fatalf("expected total_referral_payout to default to 0, got %d", data.TotalReferralPayout)
	}
}

func TestReferralAdminStatisticsIncludeRealWithdrawalAndPayoutTotals(t *testing.T) {
	engine := setupReferralAdminBehaviorTestRouter()

	if err := model.DB.Create(&model.ReferralCommission{UserID: 101, InviteeUserID: 202, ReferralLinkID: 1, PlanID: 1, Level: 1, TopUpAmount: 1000, CommissionQuota: 320, PlanSnapshot: "{}", Status: "settled"}).Error; err != nil {
		t.Fatalf("failed to create commission: %v", err)
	}
	if err := model.DB.Create(&model.ReferralCommission{UserID: 101, InviteeUserID: 203, ReferralLinkID: 2, PlanID: 1, Level: 1, TopUpAmount: 1000, CommissionQuota: 180, PlanSnapshot: "{}", Status: "pending"}).Error; err != nil {
		t.Fatalf("failed to create pending commission: %v", err)
	}
	if err := model.DB.Create(&model.ReferralWithdrawal{UserID: 101, Amount: 150, Fee: 10, ActualAmount: 140, PaymentMethod: "alipay", PaymentAccount: "alice@example.com", Status: "pending"}).Error; err != nil {
		t.Fatalf("failed to create pending withdrawal: %v", err)
	}
	if err := model.DB.Create(&model.ReferralWithdrawal{UserID: 101, Amount: 200, Fee: 0, ActualAmount: 200, PaymentMethod: "bank", PaymentAccount: "6222", Status: "approved"}).Error; err != nil {
		t.Fatalf("failed to create approved withdrawal: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodGet, "/api/referral/admin/statistics", nil)
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected statistics endpoint to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	data := decodeReferralAdminStatisticsData(t, response.Data)

	if data.PendingWithdrawals != 1 {
		t.Fatalf("expected pending_withdrawals=1, got %d", data.PendingWithdrawals)
	}
	if data.TotalReferralPayout != 500 {
		t.Fatalf("expected total_referral_payout=500, got %d", data.TotalReferralPayout)
	}
}

func TestReferralAdminStatisticsIncludePerPlanOverview(t *testing.T) {
	engine := setupReferralAdminBehaviorTestRouter()

	if err := model.DB.Create(&model.ReferralPlan{ID: 2, Name: "一次性买断", Description: "短期方案", PlanType: 2, IsActive: false, ProfitSharePercent: 20, Level1Percent: 15, Level2Percent: 5}).Error; err != nil {
		t.Fatalf("failed to create second plan: %v", err)
	}
	if err := model.DB.Model(&model.ReferralPlan{}).Where("id = ?", 2).Update("is_active", false).Error; err != nil {
		t.Fatalf("failed to disable second plan: %v", err)
	}
	if err := model.DB.Create(&model.User{Id: 202, Username: "invitee-a", Password: "password123", DisplayName: "Invitee A", Status: common.UserStatusEnabled, Role: common.RoleCommonUser, Group: "default", InviterId: 101}).Error; err != nil {
		t.Fatalf("failed to create user 202: %v", err)
	}
	if err := model.DB.Create(&model.User{Id: 203, Username: "invitee-b", Password: "password123", DisplayName: "Invitee B", Status: common.UserStatusEnabled, Role: common.RoleCommonUser, Group: "default", InviterId: 202}).Error; err != nil {
		t.Fatalf("failed to create user 203: %v", err)
	}
	if err := model.DB.Create(&model.ReferralAccount{UserID: 202, PlanID: 1}).Error; err != nil {
		t.Fatalf("failed to create plan 1 referral account: %v", err)
	}
	if err := model.DB.Create(&model.ReferralAccount{UserID: 203, PlanID: 2}).Error; err != nil {
		t.Fatalf("failed to create plan 2 referral account: %v", err)
	}
	if err := model.DB.Create(&model.ReferralCommission{UserID: 101, InviteeUserID: 202, ReferralLinkID: 1, PlanID: 1, Level: 1, TopUpAmount: 1000, CommissionQuota: 300, PlanSnapshot: "{}", Status: "settled"}).Error; err != nil {
		t.Fatalf("failed to create plan 1 level1 commission: %v", err)
	}
	if err := model.DB.Create(&model.ReferralCommission{UserID: 101, InviteeUserID: 202, ReferralLinkID: 1, PlanID: 1, Level: 2, TopUpAmount: 1000, CommissionQuota: 120, PlanSnapshot: "{}", Status: "settled"}).Error; err != nil {
		t.Fatalf("failed to create plan 1 level2 commission: %v", err)
	}
	if err := model.DB.Create(&model.ReferralCommission{UserID: 101, InviteeUserID: 203, ReferralLinkID: 2, PlanID: 2, Level: 1, TopUpAmount: 1000, CommissionQuota: 80, PlanSnapshot: "{}", Status: "pending"}).Error; err != nil {
		t.Fatalf("failed to create plan 2 commission: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodGet, "/api/referral/admin/statistics", nil)
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected statistics endpoint to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	data := decodeReferralAdminStatisticsData(t, response.Data)
	if len(data.PlanOverview) != 2 {
		t.Fatalf("expected 2 plan overview items, got %d", len(data.PlanOverview))
	}

	plan1 := data.PlanOverview[0]
	if plan1.PlanID != 1 {
		t.Fatalf("expected first plan overview to be plan 1, got %d", plan1.PlanID)
	}
	if plan1.SelectedAccountCount != 2 {
		t.Fatalf("expected plan 1 selected_account_count=2, got %d", plan1.SelectedAccountCount)
	}
	if plan1.Level1CommissionQuota != 300 {
		t.Fatalf("expected plan 1 level1_commission_quota=300, got %d", plan1.Level1CommissionQuota)
	}
	if plan1.Level2CommissionQuota != 120 {
		t.Fatalf("expected plan 1 level2_commission_quota=120, got %d", plan1.Level2CommissionQuota)
	}
	if plan1.TotalCommissionQuota != 420 {
		t.Fatalf("expected plan 1 total_commission_quota=420, got %d", plan1.TotalCommissionQuota)
	}
	if !plan1.IsActive {
		t.Fatal("expected plan 1 to remain active in overview")
	}

	plan2 := data.PlanOverview[1]
	if plan2.PlanID != 2 {
		t.Fatalf("expected second plan overview to be plan 2, got %d", plan2.PlanID)
	}
	if plan2.SelectedAccountCount != 1 {
		t.Fatalf("expected plan 2 selected_account_count=1, got %d", plan2.SelectedAccountCount)
	}
	if plan2.Level1CommissionQuota != 80 {
		t.Fatalf("expected plan 2 level1_commission_quota=80, got %d", plan2.Level1CommissionQuota)
	}
	if plan2.Level2CommissionQuota != 0 {
		t.Fatalf("expected plan 2 level2_commission_quota=0, got %d", plan2.Level2CommissionQuota)
	}
	if plan2.TotalCommissionQuota != 80 {
		t.Fatalf("expected plan 2 total_commission_quota=80, got %d", plan2.TotalCommissionQuota)
	}
	if plan2.IsActive {
		t.Fatal("expected plan 2 to remain inactive in overview")
	}
	if data.TotalInvites != 2 {
		t.Fatalf("expected total_invites=2, got %d", data.TotalInvites)
	}
	if data.ActiveReferrers != 3 {
		t.Fatalf("expected active_referrers=3, got %d", data.ActiveReferrers)
	}
}

func TestReferralAdminWithdrawalsReturnsRealRecords(t *testing.T) {
	engine := setupReferralAdminBehaviorTestRouter()

	if err := model.DB.Create(&model.User{Id: 303, Username: "reviewer", Password: "password123", DisplayName: "Reviewer", Status: common.UserStatusEnabled, Role: common.RoleCommonUser, Group: "default"}).Error; err != nil {
		t.Fatalf("failed to create extra user: %v", err)
	}
	if err := model.DB.Create(&model.ReferralWithdrawal{UserID: 101, Amount: 150, Fee: 10, ActualAmount: 140, PaymentMethod: "alipay", PaymentAccount: "alice@example.com", PaymentName: "Alice", Status: "pending"}).Error; err != nil {
		t.Fatalf("failed to create pending withdrawal: %v", err)
	}
	if err := model.DB.Create(&model.ReferralWithdrawal{UserID: 303, Amount: 200, Fee: 0, ActualAmount: 200, PaymentMethod: "bank", PaymentAccount: "6222", PaymentName: "Reviewer", Status: "approved"}).Error; err != nil {
		t.Fatalf("failed to create approved withdrawal: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodGet, "/api/referral/admin/withdrawals", nil)
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected withdrawals endpoint to return 200, got %d", recorder.Code)
	}

	response := decodeReferralAPIResponse(t, recorder)
	items := decodeReferralData[[]referralAdminWithdrawalItem](t, response.Data)
	if len(items) != 2 {
		t.Fatalf("expected 2 withdrawal items, got %d", len(items))
	}
	if items[0].Username == "" {
		t.Fatal("expected withdrawal item to include username")
	}
	if items[0].Status == "" {
		t.Fatal("expected withdrawal item to include status")
	}
}

func TestReferralAdminProcessWithdrawalUpdatesStatusAndRemark(t *testing.T) {
	engine := setupReferralAdminBehaviorTestRouter()

	withdrawal := &model.ReferralWithdrawal{UserID: 101, Amount: 150, Fee: 10, ActualAmount: 140, PaymentMethod: "alipay", PaymentAccount: "alice@example.com", Status: "pending"}
	if err := model.DB.Create(withdrawal).Error; err != nil {
		t.Fatalf("failed to create withdrawal: %v", err)
	}

	recorder := performReferralRequest(t, engine, http.MethodPost, "/api/referral/admin/withdrawals/process", map[string]any{
		"withdrawal_id": withdrawal.ID,
		"action":        "reject",
		"admin_remark":  "资料不完整",
	})
	if recorder.Code != http.StatusOK {
		t.Fatalf("expected process endpoint to return 200, got %d", recorder.Code)
	}

	var stored model.ReferralWithdrawal
	if err := model.DB.First(&stored, withdrawal.ID).Error; err != nil {
		t.Fatalf("failed to reload withdrawal: %v", err)
	}
	if stored.Status != "rejected" {
		t.Fatalf("expected status=rejected, got %s", stored.Status)
	}
	if stored.AdminRemark != "资料不完整" {
		t.Fatalf("expected admin_remark to persist, got %q", stored.AdminRemark)
	}
}
