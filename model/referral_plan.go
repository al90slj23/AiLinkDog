package model

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type ReferralPlan struct {
	ID                 int       `json:"id" gorm:"primaryKey"`
	Name               string    `json:"name" gorm:"type:varchar(64);not null"`
	Description        string    `json:"description" gorm:"type:text;default:''"`
	PlanType           int       `json:"plan_type" gorm:"type:int;not null;default:1"`
	IsActive           bool      `json:"is_active" gorm:"type:bool;not null;default:true"`
	ProfitSharePercent float64   `json:"profit_share_percent" gorm:"type:numeric(10,2);not null;default:0"`
	MinChannelProfit   float64   `json:"min_channel_profit" gorm:"type:numeric(10,2);not null;default:0"`
	Level1Percent      float64   `json:"level1_percent" gorm:"type:numeric(10,2);not null;default:0"`
	Level2Percent      float64   `json:"level2_percent" gorm:"type:numeric(10,2);not null;default:0"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type ReferralPlanOverviewStatistic struct {
	PlanID                int    `json:"plan_id"`
	Name                  string `json:"name"`
	PlanType              int    `json:"plan_type"`
	SelectedAccountCount  int64  `json:"selected_account_count"`
	Level1CommissionQuota int64  `json:"level1_commission_quota"`
	Level2CommissionQuota int64  `json:"level2_commission_quota"`
	TotalCommissionQuota  int64  `json:"total_commission_quota"`
	IsActive              bool   `json:"is_active"`
}

func ListReferralPlans(activeOnly bool) ([]ReferralPlan, error) {
	var plans []ReferralPlan
	query := DB.Model(&ReferralPlan{}).Order("id asc")
	if activeOnly {
		query = query.Where("is_active = ?", true)
	}
	if err := query.Find(&plans).Error; err != nil {
		return nil, err
	}
	return plans, nil
}

func GetReferralPlanByID(id int) (*ReferralPlan, error) {
	plan := &ReferralPlan{}
	if err := DB.First(plan, id).Error; err != nil {
		return nil, err
	}
	return plan, nil
}

func SaveReferralPlan(plan *ReferralPlan) error {
	if plan == nil {
		return errors.New("referral plan is nil")
	}
	return DB.Save(plan).Error
}

func CreateReferralPlan(plan *ReferralPlan) error {
	if plan == nil {
		return errors.New("referral plan is nil")
	}
	return DB.Create(plan).Error
}

func EnsureDefaultReferralPlans() error {
	count := int64(0)
	if err := DB.Model(&ReferralPlan{}).Count(&count).Error; err != nil {
		return err
	}
	if count >= 2 {
		for _, plan := range []ReferralPlan{
			{ID: 1},
			{ID: 2},
		} {
			exists, err := HasReferralPlan(plan.ID)
			if err != nil {
				return err
			}
			if !exists {
				return errors.New("missing default referral plan")
			}
		}
		return nil
	}

	defaultPlans := []ReferralPlan{
		{
			ID:                 1,
			Name:               "持续返利",
			Description:        "长期按邀请关系返利，适合稳定推广。",
			PlanType:           1,
			IsActive:           true,
			ProfitSharePercent: 80,
			MinChannelProfit:   20,
			Level1Percent:      60,
			Level2Percent:      40,
		},
		{
			ID:                 2,
			Name:               "一次性买断",
			Description:        "适合短期投放，首阶段返利更集中。",
			PlanType:           2,
			IsActive:           true,
			ProfitSharePercent: 80,
			MinChannelProfit:   20,
			Level1Percent:      60,
			Level2Percent:      40,
		},
	}
	return DB.Transaction(func(tx *gorm.DB) error {
		for _, plan := range defaultPlans {
			if err := tx.Where("id = ?", plan.ID).Assign(plan).FirstOrCreate(&ReferralPlan{}).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func CountActiveReferralPlans() (int64, error) {
	var count int64
	err := DB.Model(&ReferralPlan{}).Where("is_active = ?", true).Count(&count).Error
	return count, err
}

func HasReferralPlan(id int) (bool, error) {
	var count int64
	err := DB.Model(&ReferralPlan{}).Where("id = ?", id).Count(&count).Error
	return count > 0, err
}

func IsReferralPlanActive(id int) (bool, error) {
	plan, err := GetReferralPlanByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}
	return plan.IsActive, nil
}

func ListReferralPlanOverviewStatistics() ([]ReferralPlanOverviewStatistic, error) {
	var items []ReferralPlanOverviewStatistic
	err := DB.Table("referral_plans AS plans").
		Select(`
			plans.id AS plan_id,
			plans.name,
			plans.plan_type,
			plans.is_active,
			COALESCE(accounts.selected_account_count, 0) AS selected_account_count,
			COALESCE(commissions.level1_commission_quota, 0) AS level1_commission_quota,
			COALESCE(commissions.level2_commission_quota, 0) AS level2_commission_quota,
			COALESCE(commissions.total_commission_quota, 0) AS total_commission_quota
		`).
		Joins(`LEFT JOIN (
			SELECT plan_id, COUNT(*) AS selected_account_count
			FROM referral_accounts
			GROUP BY plan_id
		) AS accounts ON accounts.plan_id = plans.id`).
		Joins(`LEFT JOIN (
			SELECT
				plan_id,
				COALESCE(SUM(CASE WHEN level = 1 THEN commission_quota ELSE 0 END), 0) AS level1_commission_quota,
				COALESCE(SUM(CASE WHEN level = 2 THEN commission_quota ELSE 0 END), 0) AS level2_commission_quota,
				COALESCE(SUM(commission_quota), 0) AS total_commission_quota
			FROM referral_commissions
			GROUP BY plan_id
		) AS commissions ON commissions.plan_id = plans.id`).
		Order("plans.id asc").
		Scan(&items).Error
	if err != nil {
		return nil, err
	}
	return items, nil
}

func CountUsersWithReferralInvites() (int64, error) {
	var count int64
	err := DB.Model(&User{}).Where("aff_count > ?", 0).Count(&count).Error
	return count, err
}

func CountReferralAccounts() (int64, error) {
	var count int64
	err := DB.Model(&ReferralAccount{}).Count(&count).Error
	return count, err
}

func CountInvitedUsers() (int64, error) {
	var count int64
	err := DB.Model(&User{}).Where("inviter_id > ?", 0).Count(&count).Error
	return count, err
}

func SumReferralInviteCount() (int64, error) {
	var total int64
	err := DB.Model(&User{}).Select("COALESCE(SUM(aff_count), 0)").Scan(&total).Error
	return total, err
}

func CountReferralPlans() (int64, error) {
	var count int64
	err := DB.Model(&ReferralPlan{}).Count(&count).Error
	return count, err
}
