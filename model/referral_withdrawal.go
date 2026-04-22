package model

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type ReferralWithdrawal struct {
	ID             int       `json:"id" gorm:"primaryKey"`
	UserID         int       `json:"user_id" gorm:"index;not null"`
	Amount         int64     `json:"amount" gorm:"type:bigint;not null;default:0"`
	Fee            int64     `json:"fee" gorm:"type:bigint;not null;default:0"`
	ActualAmount   int64     `json:"actual_amount" gorm:"type:bigint;not null;default:0"`
	PaymentMethod  string    `json:"payment_method" gorm:"type:varchar(32);not null"`
	PaymentAccount string    `json:"payment_account" gorm:"type:varchar(255);not null"`
	PaymentName    string    `json:"payment_name" gorm:"type:varchar(128);default:''"`
	Remark         string    `json:"remark" gorm:"type:text;default:''"`
	AdminRemark    string    `json:"admin_remark" gorm:"type:text;default:''"`
	Status         string    `json:"status" gorm:"type:varchar(32);not null;default:'pending'"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type ReferralAdminWithdrawal struct {
	ReferralWithdrawal
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
}

func ListReferralWithdrawalsByUserID(userID int) ([]ReferralWithdrawal, error) {
	var withdrawals []ReferralWithdrawal
	err := DB.Where("user_id = ?", userID).Order("id desc").Find(&withdrawals).Error
	return withdrawals, err
}

func SumPendingReferralWithdrawalAmountByUserID(userID int) (int64, error) {
	var total int64
	err := DB.Model(&ReferralWithdrawal{}).
		Where("user_id = ?", userID).
		Where("status IN ?", []string{"pending", "processing"}).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total).Error
	return total, err
}

func CreateReferralWithdrawal(withdrawal *ReferralWithdrawal) error {
	if withdrawal == nil {
		return errors.New("referral withdrawal is nil")
	}
	if err := DB.Create(withdrawal).Error; err != nil {
		return err
	}
	if withdrawal.ID <= 0 {
		return errors.New("referral withdrawal created without id")
	}
	return nil
}

func CountPendingReferralWithdrawals() (int64, error) {
	var total int64
	err := DB.Model(&ReferralWithdrawal{}).
		Where("status = ?", "pending").
		Count(&total).Error
	return total, err
}

func ListReferralAdminWithdrawals() ([]ReferralAdminWithdrawal, error) {
	var withdrawals []ReferralAdminWithdrawal
	err := DB.Table("referral_withdrawals").
		Select("referral_withdrawals.*, users.username, users.display_name").
		Joins("LEFT JOIN users ON users.id = referral_withdrawals.user_id").
		Order("referral_withdrawals.id desc").
		Scan(&withdrawals).Error
	return withdrawals, err
}

func GetReferralWithdrawalByID(id int) (*ReferralWithdrawal, error) {
	withdrawal := &ReferralWithdrawal{}
	if err := DB.First(withdrawal, id).Error; err != nil {
		return nil, err
	}
	return withdrawal, nil
}

func UpdateReferralWithdrawalStatus(id int, status string, adminRemark string) (*ReferralWithdrawal, error) {
	updates := map[string]any{"status": status}
	if adminRemark != "" {
		updates["admin_remark"] = adminRemark
	}
	if err := DB.Model(&ReferralWithdrawal{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return nil, err
	}
	updated := &ReferralWithdrawal{}
	if err := DB.First(updated, id).Error; err != nil {
		return nil, err
	}
	return updated, nil
}

func IsReferralWithdrawalNotFound(err error) bool {
	return errors.Is(err, gorm.ErrRecordNotFound)
}
