package model

import (
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/setting/system_setting"
)

type ReferralLink struct {
	ID           int        `json:"id" gorm:"primaryKey"`
	UserID       int        `json:"user_id" gorm:"index;not null"`
	PlanID       int        `json:"plan_id" gorm:"not null"`
	Code         string     `json:"code" gorm:"type:varchar(64);uniqueIndex;not null"`
	FullURL      string     `json:"full_url" gorm:"type:text;not null"`
	ChannelNote  string     `json:"channel_note" gorm:"type:varchar(128);default:''"`
	ValidityDays int        `json:"validity_days" gorm:"type:int;not null;default:0"`
	ExpiredAt    *time.Time `json:"expired_at"`
	IsActive     bool       `json:"is_active" gorm:"type:bool;not null;default:true"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

func ListReferralLinksByUserID(userID int) ([]ReferralLink, error) {
	var links []ReferralLink
	err := DB.Where("user_id = ?", userID).Order("id desc").Find(&links).Error
	return links, err
}

func CreateReferralLinkForUser(userID int, planID int, affCode string, channelNote string, validityDays int) (*ReferralLink, error) {
	if validityDays < 0 {
		validityDays = 0
	}
	code := common.GetRandomString(10)
	fullURL := common.BuildURL(system_setting.ServerAddress, "/register?aff="+affCode)
	if fullURL == "/register?aff="+affCode || fullURL == affCode {
		fullURL = common.BuildURL("http://localhost:3000", "/register?aff="+affCode)
	}
	link := &ReferralLink{
		UserID:       userID,
		PlanID:       planID,
		Code:         code,
		FullURL:      fullURL,
		ChannelNote:  channelNote,
		ValidityDays: validityDays,
		IsActive:     true,
	}
	if validityDays > 0 {
		expiredAt := time.Now().Add(time.Duration(validityDays) * 24 * time.Hour)
		link.ExpiredAt = &expiredAt
	}
	if err := DB.Create(link).Error; err != nil {
		return nil, err
	}
	return link, nil
}
