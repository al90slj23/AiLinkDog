package model

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type ReferralAccount struct {
	ID        int        `json:"id" gorm:"primaryKey"`
	UserID    int        `json:"user_id" gorm:"uniqueIndex;not null"`
	PlanID    int        `json:"plan_id" gorm:"not null"`
	LockedAt  *time.Time `json:"locked_at"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func GetReferralAccountByUserID(userID int) (*ReferralAccount, error) {
	account := &ReferralAccount{}
	if err := DB.Where("user_id = ?", userID).First(account).Error; err != nil {
		return nil, err
	}
	return account, nil
}

func SetReferralAccountPlan(userID int, planID int) (*ReferralAccount, error) {
	account := &ReferralAccount{}
	err := DB.Where("user_id = ?", userID).First(account).Error
	if err == nil {
		return nil, errors.New("referral plan already locked")
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	now := time.Now()
	account = &ReferralAccount{
		UserID:   userID,
		PlanID:   planID,
		LockedAt: &now,
	}
	if err := DB.Create(account).Error; err != nil {
		return nil, err
	}
	return account, nil
}
