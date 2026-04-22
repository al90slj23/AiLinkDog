package controller

import (
	"errors"
	"fmt"
	"math"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func referralSuccess(c *gin.Context, data any) {
	common.ApiSuccess(c, data)
}

func GetReferralStatistics(c *gin.Context) {
	user, err := model.GetUserById(c.GetInt("id"), false)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pendingBalance, err := model.SumPendingReferralWithdrawalAmountByUserID(user.Id)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	referralSnapshot := buildUserReferralSnapshot(user)
	referralPlanID := 0
	account, err := model.GetReferralAccountByUserID(user.Id)
	if err == nil {
		referralPlanID = account.PlanID
	} else if err != nil && err != gorm.ErrRecordNotFound {
		common.ApiError(c, err)
		return
	}
	withdrawableBalance := referralSnapshot.AffQuota - int(pendingBalance)
	if withdrawableBalance < 0 {
		withdrawableBalance = 0
	}

	referralSuccess(c, gin.H{
		"aff_count":            referralSnapshot.AffCount,
		"aff_quota":            referralSnapshot.AffQuota,
		"aff_history_quota":    referralSnapshot.AffHistoryQuota,
		"referral_plan_id":     referralPlanID,
		"total_invites":        referralSnapshot.AffCount,
		"total_earnings":       referralSnapshot.AffHistoryQuota,
		"withdrawable_balance": withdrawableBalance,
		"pending_balance":      pendingBalance,
		"invitee_count":        referralSnapshot.AffCount,
	})
}

func GetReferralBalance(c *gin.Context) {
	referralSuccess(c, gin.H{})
}

func GetReferralPlans(c *gin.Context) {
	if err := model.EnsureDefaultReferralPlans(); err != nil {
		common.ApiError(c, err)
		return
	}
	plans, err := model.ListReferralPlans(true)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, plans)
}

func SelectReferralPlan(c *gin.Context) {
	userID := c.GetInt("id")
	var req SelectReferralPlanRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	if req.PlanID <= 0 {
		common.ApiError(c, errors.New("invalid plan id"))
		return
	}
	active, err := model.IsReferralPlanActive(req.PlanID)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	if !active {
		common.ApiError(c, errors.New("selected referral plan is not active"))
		return
	}
	account, err := model.SetReferralAccountPlan(userID, req.PlanID)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, account)
}

func GetReferralLinks(c *gin.Context) {
	links, err := model.ListReferralLinksByUserID(c.GetInt("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, links)
}

func CreateReferralLink(c *gin.Context) {
	userID := c.GetInt("id")
	var req CreateReferralLinkRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}
	account, err := model.GetReferralAccountByUserID(userID)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	user, err := model.GetUserById(userID, true)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	if strings.TrimSpace(user.AffCode) == "" {
		user.AffCode = common.GetRandomString(4)
		if err := user.Update(false); err != nil {
			common.ApiError(c, err)
			return
		}
	}
	link, err := model.CreateReferralLinkForUser(userID, account.PlanID, user.AffCode, strings.TrimSpace(req.ChannelNote), req.ValidityDays)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, link)
}

func GetReferralCommissions(c *gin.Context) {
	commissions, err := model.ListReferralCommissionsByUserID(c.GetInt("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, commissions)
}

func GetReferralInvitees(c *gin.Context) {
	invitees, err := model.ListReferralInviteesByInviterID(c.GetInt("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, invitees)
}

func GetReferralWithdrawals(c *gin.Context) {
	withdrawals, err := model.ListReferralWithdrawalsByUserID(c.GetInt("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, withdrawals)
}

func CreateReferralWithdrawal(c *gin.Context) {
	user, err := model.GetUserById(c.GetInt("id"), false)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	var req CreateReferralWithdrawalRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		common.ApiError(c, err)
		return
	}

	if req.Amount <= 0 {
		common.ApiError(c, errors.New("invalid withdrawal amount"))
		return
	}
	if strings.TrimSpace(req.PaymentMethod) == "" {
		common.ApiError(c, errors.New("invalid payment method"))
		return
	}
	if strings.TrimSpace(req.PaymentAccount) == "" {
		common.ApiError(c, errors.New("invalid payment account"))
		return
	}
	if common.ReferralMinWithdrawalAmount > 0 && req.Amount < common.ReferralMinWithdrawalAmount {
		common.ApiError(c, fmt.Errorf("withdrawal amount must be at least %d", common.ReferralMinWithdrawalAmount))
		return
	}
	pendingBalance, err := model.SumPendingReferralWithdrawalAmountByUserID(user.Id)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	availableBalance := user.AffQuota - int(pendingBalance)
	if availableBalance < 0 {
		availableBalance = 0
	}
	if req.Amount > availableBalance {
		common.ApiError(c, errors.New("withdrawal amount exceeds withdrawable balance"))
		return
	}

	percentFee := int(math.Round(float64(req.Amount) * common.ReferralWithdrawalFeePercent / 100))
	fee := percentFee + common.ReferralWithdrawalFeeFixed
	if fee < 0 {
		fee = 0
	}
	actualAmount := req.Amount - fee
	if actualAmount < 0 {
		actualAmount = 0
	}

	status := "pending"
	if common.ReferralAutoApproveWithdrawal {
		status = "approved"
	}

	withdrawal := &model.ReferralWithdrawal{
		UserID:         user.Id,
		Amount:         int64(req.Amount),
		Fee:            int64(fee),
		ActualAmount:   int64(actualAmount),
		PaymentMethod:  strings.TrimSpace(req.PaymentMethod),
		PaymentAccount: strings.TrimSpace(req.PaymentAccount),
		PaymentName:    strings.TrimSpace(req.PaymentName),
		Remark:         strings.TrimSpace(req.Remark),
		Status:         status,
	}
	if err := model.CreateReferralWithdrawal(withdrawal); err != nil {
		common.ApiError(c, err)
		return
	}
	referralSuccess(c, withdrawal)
}

func buildReferralSettingResponse() gin.H {
	return gin.H{
		"enabled":                     common.ReferralEnabled,
		"default_link_validity_days":  common.ReferralDefaultLinkValidityDays,
		"allow_custom_link_validity":  common.ReferralAllowCustomLinkValidity,
		"min_withdrawal_amount":       common.ReferralMinWithdrawalAmount,
		"withdrawal_fee_percent":      common.ReferralWithdrawalFeePercent,
		"withdrawal_fee_fixed":        common.ReferralWithdrawalFeeFixed,
		"auto_approve_withdrawal":     common.ReferralAutoApproveWithdrawal,
		"commission_cap_enabled":      common.ReferralCommissionCapEnabled,
		"monthly_commission_cap":      common.ReferralMonthlyCommissionCap,
	}
}

func referralOptionValue(value any) string {
	return fmt.Sprintf("%v", value)
}
