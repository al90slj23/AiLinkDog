package model

import (
	"errors"

	"github.com/QuantumNous/new-api/common"
	"gorm.io/gorm"
)

type MonitorBillingRecord struct {
	Id                int    `json:"id"`
	TargetID          int    `json:"target_id" gorm:"not null;index:idx_monitor_billing_target,priority:1"`
	OwnerUserID       int    `json:"owner_user_id" gorm:"not null;index:idx_monitor_billing_owner_user_id"`
	Provider          string `json:"provider" gorm:"type:varchar(64);not null;default:''"`
	ExternalRequestID string `json:"external_request_id" gorm:"type:varchar(128);not null;default:'';index:idx_monitor_billing_external_request_id"`
	ModelName         string `json:"model_name" gorm:"type:varchar(255);not null;default:''"`
	RequestType       string `json:"request_type" gorm:"type:varchar(64);not null;default:''"`
	Currency          string `json:"currency" gorm:"type:varchar(16);not null;default:'USD'"`
	InputTokens       int64  `json:"input_tokens" gorm:"bigint;not null;default:0"`
	OutputTokens      int64  `json:"output_tokens" gorm:"bigint;not null;default:0"`
	TotalTokens       int64  `json:"total_tokens" gorm:"bigint;not null;default:0"`
	CostAmountMicros  int64  `json:"cost_amount_micros" gorm:"bigint;not null;default:0"`
	OccurredAt        int64  `json:"occurred_at" gorm:"bigint;not null;default:0;index:idx_monitor_billing_target,priority:2"`
	CreatedAt         int64  `json:"created_at" gorm:"bigint"`
	UpdatedAt         int64  `json:"updated_at" gorm:"bigint"`
}

func (MonitorBillingRecord) TableName() string {
	return "monitor_billing_records"
}

func (r *MonitorBillingRecord) BeforeCreate(tx *gorm.DB) error {
	now := common.GetTimestamp()
	r.CreatedAt = now
	r.UpdatedAt = now
	return r.validate()
}

func (r *MonitorBillingRecord) BeforeUpdate(tx *gorm.DB) error {
	r.UpdatedAt = common.GetTimestamp()
	return r.validate()
}

func (r *MonitorBillingRecord) validate() error {
	if r.TargetID <= 0 {
		return errors.New("monitor billing record target id is required")
	}
	if r.OwnerUserID <= 0 {
		return errors.New("monitor billing record owner user id is required")
	}
	if r.Currency == "" {
		r.Currency = "USD"
	}
	if r.TotalTokens < 0 || r.InputTokens < 0 || r.OutputTokens < 0 {
		return errors.New("monitor billing record tokens must be non-negative")
	}
	if r.CostAmountMicros < 0 {
		return errors.New("monitor billing record cost amount micros must be non-negative")
	}
	if r.OccurredAt <= 0 {
		r.OccurredAt = common.GetTimestamp()
	}
	return nil
}
