package model

import (
	"time"

	"github.com/QuantumNous/new-api/common"
	"gorm.io/gorm"
)

type ReferralCommission struct {
	ID              int       `json:"id" gorm:"primaryKey"`
	UserID          int       `json:"user_id" gorm:"index;not null"`
	InviteeUserID   int       `json:"invitee_user_id" gorm:"index;not null"`
	ReferralLinkID  int       `json:"referral_link_id" gorm:"index;not null"`
	PlanID          int       `json:"plan_id" gorm:"not null"`
	Level           int       `json:"level" gorm:"type:int;not null;default:1"`
	TopUpAmount     int64     `json:"top_up_amount" gorm:"type:bigint;not null;default:0"`
	CommissionQuota int64     `json:"commission_quota" gorm:"type:bigint;not null;default:0"`
	PlanSnapshot    string    `json:"plan_snapshot" gorm:"type:text;not null"`
	Status          string    `json:"status" gorm:"type:varchar(32);not null;default:'pending'"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func ListReferralCommissionsByUserID(userID int) ([]ReferralCommission, error) {
	var commissions []ReferralCommission
	err := DB.Where("user_id = ?", userID).Order("id desc").Find(&commissions).Error
	return commissions, err
}

func SumSettledReferralCommissionQuota() (int64, error) {
	var total int64
	err := DB.Model(&ReferralCommission{}).
		Where("status = ?", "settled").
		Select("COALESCE(SUM(commission_quota), 0)").
		Scan(&total).Error
	return total, err
}

func SumAllReferralCommissionQuota() (int64, error) {
	var total int64
	err := DB.Model(&ReferralCommission{}).
		Select("COALESCE(SUM(commission_quota), 0)").
		Scan(&total).Error
	return total, err
}

func CreateReferralCommission(commission *ReferralCommission) error {
	if commission == nil {
		return nil
	}
	return DB.Create(commission).Error
}

func CreateReferralCommissionAndApplyBalance(commission *ReferralCommission) error {
	if commission == nil {
		return nil
	}
	return DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(commission).Error; err != nil {
			return err
		}
		return tx.Model(&User{}).
			Where("id = ?", commission.UserID).
			Updates(map[string]any{
				"aff_quota":   gorm.Expr("aff_quota + ?", commission.CommissionQuota),
				"aff_history": gorm.Expr("aff_history + ?", commission.CommissionQuota),
			}).Error
	})
}

func GetLatestReferralLinkByUserID(userID int) (*ReferralLink, error) {
	link := &ReferralLink{}
	if err := DB.Where("user_id = ?", userID).Order("id desc").First(link).Error; err != nil {
		return nil, err
	}
	return link, nil
}

func buildReferralPlanSnapshot(plan *ReferralPlan) string {
	if plan == nil {
		return "{}"
	}
	payload, err := common.Marshal(map[string]any{
		"id":                   plan.ID,
		"name":                 plan.Name,
		"plan_type":            plan.PlanType,
		"profit_share_percent": plan.ProfitSharePercent,
		"min_channel_profit":   plan.MinChannelProfit,
		"level1_percent":       plan.Level1Percent,
		"level2_percent":       plan.Level2Percent,
	})
	if err != nil {
		return "{}"
	}
	return string(payload)
}

func calculateReferralCommissionQuota(amount int64, plan *ReferralPlan, level int) int64 {
	if amount <= 0 || plan == nil {
		return 0
	}
	minProfit := plan.MinChannelProfit / 100
	profitShare := plan.ProfitSharePercent / 100
	levelPercent := plan.Level1Percent / 100
	if level == 2 {
		levelPercent = plan.Level2Percent / 100
	}
	return int64(float64(amount) * minProfit * profitShare * levelPercent)
}

func ProcessReferralCommissionsForTopUp(userID int, topUpAmount int64) error {
	if userID <= 0 || topUpAmount <= 0 {
		return nil
	}
	invitee, err := GetUserById(userID, true)
	if err != nil {
		return err
	}
	if invitee.InviterId <= 0 {
		return nil
	}

	settle := func(beneficiaryID int, inviteeID int, level int) error {
		account, err := GetReferralAccountByUserID(beneficiaryID)
		if err != nil {
			return nil
		}
		plan, err := GetReferralPlanByID(account.PlanID)
		if err != nil {
			return err
		}
		link, err := GetLatestReferralLinkByUserID(beneficiaryID)
		if err != nil {
			return nil
		}
		quota := calculateReferralCommissionQuota(topUpAmount, plan, level)
		if quota <= 0 {
			return nil
		}
		status := "settled"
		if plan.PlanType == 1 {
			status = "pending"
		}
		commission := &ReferralCommission{
			UserID:          beneficiaryID,
			InviteeUserID:   inviteeID,
			ReferralLinkID:  link.ID,
			PlanID:          plan.ID,
			Level:           level,
			TopUpAmount:     topUpAmount,
			CommissionQuota: quota,
			PlanSnapshot:    buildReferralPlanSnapshot(plan),
			Status:          status,
		}
		return CreateReferralCommissionAndApplyBalance(commission)
	}

	if err := settle(invitee.InviterId, invitee.Id, 1); err != nil {
		return err
	}
	if invitee.InviterId > 0 {
		level1User, err := GetUserById(invitee.InviterId, true)
		if err != nil {
			return err
		}
		if level1User.InviterId > 0 {
			if err := settle(level1User.InviterId, invitee.Id, 2); err != nil {
				return err
			}
		}
	}
	return nil
}
