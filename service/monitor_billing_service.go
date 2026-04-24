package service

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/QuantumNous/new-api/model"
	"gorm.io/gorm"
)

const customMonitorProbeQuotaCost = 1

func EnsureCustomMonitorQuota(ctx context.Context, userID int) error {
	_ = ctx
	quota, err := model.GetUserQuota(userID, true)
	if err != nil {
		return err
	}
	if quota < customMonitorProbeQuotaCost {
		return errors.New("monitor quota is insufficient")
	}
	return nil
}

func ConsumeCustomMonitorQuota(ctx context.Context, userID int, amount int) error {
	_ = ctx
	if amount <= 0 {
		return nil
	}
	result := model.DB.Model(&model.User{}).
		Where("id = ? AND quota >= ?", userID, amount).
		Update("quota", gorm.Expr("quota - ?", amount))
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("monitor quota is insufficient")
	}
	return nil
}

func BuildCustomMonitorBillingRecordInput(target model.MonitorTarget, result ProbeResult) CreateMonitorBillingRecordInput {
	ownerUserID := 0
	if target.OwnerUserID != nil {
		ownerUserID = *target.OwnerUserID
	}
	requestID := fmt.Sprintf("monitor-run-%d-%d", target.Id, result.CheckedAt.Unix())
	return CreateMonitorBillingRecordInput{
		TargetID:          target.Id,
		OwnerUserID:       ownerUserID,
		Provider:          strings.TrimSpace(target.ChannelType),
		ExternalRequestID: requestID,
		ModelName:         strings.TrimSpace(target.Model),
		RequestType:       "monitor_probe",
		Currency:          "quota",
		TotalTokens:       int64(customMonitorProbeQuotaCost),
		CostAmountMicros:  int64(customMonitorProbeQuotaCost),
		OccurredAt:        result.CheckedAt.Unix(),
	}
}

func requireOwnedCustomMonitorTarget(userID int, targetID int) (*model.MonitorTarget, error) {
	var target model.MonitorTarget
	err := model.DB.Where("id = ? AND source_type = ? AND owner_user_id = ?", targetID, model.MonitorSourceTypeCustom, userID).First(&target).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gorm.ErrRecordNotFound
		}
		return nil, err
	}
	return &target, nil
}
