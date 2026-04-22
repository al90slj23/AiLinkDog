package controller

import (
	"errors"
	"fmt"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

func GetReferralAdminStatistics(c *gin.Context) {
	if err := model.EnsureDefaultReferralPlans(); err != nil {
		common.ApiError(c, err)
		return
	}
	totalInvites, err := model.CountInvitedUsers()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	planCount, err := model.CountReferralPlans()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	activePlanCount, err := model.CountActiveReferralPlans()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	lockedAccounts, err := model.CountReferralAccounts()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pendingWithdrawals, err := model.CountPendingReferralWithdrawals()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	totalReferralPayout, err := model.SumAllReferralCommissionQuota()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	planOverview, err := model.ListReferralPlanOverviewStatistics()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, gin.H{
		"active_referrers":         lockedAccounts,
		"total_invites":            totalInvites,
		"plan_count":               planCount,
		"active_plan_count":        activePlanCount,
		"pending_withdrawal_count": pendingWithdrawals,
		"pending_withdrawals":      pendingWithdrawals,
		"total_referral_payout":    totalReferralPayout,
		"plan_overview":            planOverview,
	})
}

func maxInt64(a int64, b int64) int64 {
	if a > b {
		return a
	}
	return b
}

func GetReferralAdminPlans(c *gin.Context) {
	if err := model.EnsureDefaultReferralPlans(); err != nil {
		common.ApiError(c, err)
		return
	}
	plans, err := model.ListReferralPlans(false)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, plans)
}

func UpdateReferralAdminPlans(c *gin.Context) {
	var req model.ReferralPlan
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	if req.Name == "" {
		common.ApiError(c, errors.New("invalid referral plan name"))
		return
	}
	if req.Level1Percent < 0 || req.Level2Percent < 0 || req.Level1Percent+req.Level2Percent != 100 {
		common.ApiError(c, errors.New("level1_percent and level2_percent must sum to 100"))
		return
	}
	if req.ID <= 0 {
		newPlan := &model.ReferralPlan{
			Name:               req.Name,
			Description:        req.Description,
			PlanType:           req.PlanType,
			IsActive:           req.IsActive,
			ProfitSharePercent: req.ProfitSharePercent,
			MinChannelProfit:   req.MinChannelProfit,
			Level1Percent:      req.Level1Percent,
			Level2Percent:      req.Level2Percent,
		}
		if err := model.CreateReferralPlan(newPlan); err != nil {
			common.ApiError(c, err)
			return
		}
		referralSuccess(c, newPlan)
		return
	}
	plan, err := model.GetReferralPlanByID(req.ID)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	plan.Name = req.Name
	plan.Description = req.Description
	plan.PlanType = req.PlanType
	plan.IsActive = req.IsActive
	plan.ProfitSharePercent = req.ProfitSharePercent
	plan.MinChannelProfit = req.MinChannelProfit
	plan.Level1Percent = req.Level1Percent
	plan.Level2Percent = req.Level2Percent
	if err := model.SaveReferralPlan(plan); err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, plan)
}

func GetReferralAdminSetting(c *gin.Context) {
	referralSuccess(c, buildReferralSettingResponse())
}

func UpdateReferralAdminSetting(c *gin.Context) {
	var req map[string]any
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	optionMapping := map[string]string{
		"enabled":                    "ReferralEnabled",
		"default_link_validity_days": "ReferralDefaultLinkValidityDays",
		"allow_custom_link_validity": "ReferralAllowCustomLinkValidity",
		"min_withdrawal_amount":      "ReferralMinWithdrawalAmount",
		"withdrawal_fee_percent":     "ReferralWithdrawalFeePercent",
		"withdrawal_fee_fixed":       "ReferralWithdrawalFeeFixed",
		"auto_approve_withdrawal":    "ReferralAutoApproveWithdrawal",
		"commission_cap_enabled":     "ReferralCommissionCapEnabled",
		"monthly_commission_cap":     "ReferralMonthlyCommissionCap",
	}
	for key, optionKey := range optionMapping {
		if value, ok := req[key]; ok {
			if err := model.UpdateOption(optionKey, referralOptionValue(value)); err != nil {
				common.ApiError(c, fmt.Errorf("update %s failed: %w", optionKey, err))
				return
			}
		}
	}
	referralSuccess(c, buildReferralSettingResponse())
}

func GetReferralAdminWithdrawals(c *gin.Context) {
	withdrawals, err := model.ListReferralAdminWithdrawals()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	if withdrawals == nil {
		withdrawals = []model.ReferralAdminWithdrawal{}
	}
	referralSuccess(c, withdrawals)
}

func ProcessReferralAdminWithdrawal(c *gin.Context) {
	var req ProcessReferralWithdrawalRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	if strings.TrimSpace(req.Action) == "" {
		referralSuccess(c, gin.H{})
		return
	}
	if req.WithdrawalID <= 0 {
		common.ApiError(c, errors.New("invalid withdrawal id"))
		return
	}
	status := mapReferralWithdrawalActionToStatus(req.Action)
	if status == "" {
		common.ApiError(c, errors.New("invalid withdrawal action"))
		return
	}
	withdrawal, err := model.GetReferralWithdrawalByID(req.WithdrawalID)
	if err != nil {
		if model.IsReferralWithdrawalNotFound(err) {
			common.ApiError(c, errors.New("referral withdrawal not found"))
			return
		}
		common.ApiError(c, err)
		return
	}
	if withdrawal.Status == status {
		referralSuccess(c, withdrawal)
		return
	}
	updated, err := model.UpdateReferralWithdrawalStatus(req.WithdrawalID, status, strings.TrimSpace(req.AdminRemark))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, updated)
}

func mapReferralWithdrawalActionToStatus(action string) string {
	switch strings.ToLower(strings.TrimSpace(action)) {
	case "approve", "approved":
		return "approved"
	case "reject", "rejected":
		return "rejected"
	default:
		return ""
	}
}
