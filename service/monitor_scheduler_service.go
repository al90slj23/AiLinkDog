package service

import (
	"context"
	"errors"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"gorm.io/gorm"
)

func RunPlatformProbeCycle(ctx context.Context) error {
	var targets []model.MonitorTarget
	if err := model.DB.Where("source_type = ? AND status = ?", model.MonitorSourceTypePlatform, model.MonitorLifecycleStatusEnabled).Order("id asc").Find(&targets).Error; err != nil {
		return err
	}
	for _, target := range targets {
		if err := executeMonitorProbeForTarget(ctx, target, false); err != nil {
			return err
		}
	}
	return nil
}

func RunCustomMonitorProbeCycle(ctx context.Context) error {
	var targets []model.MonitorTarget
	if err := model.DB.Where("source_type = ? AND status = ?", model.MonitorSourceTypeCustom, model.MonitorLifecycleStatusEnabled).Order("id asc").Find(&targets).Error; err != nil {
		return err
	}
	for _, target := range targets {
		if target.OwnerUserID == nil || *target.OwnerUserID <= 0 {
			if err := recordCustomMonitorQuotaFailure(target, errors.New("custom monitor target owner is missing")); err != nil {
				return err
			}
			continue
		}
		if err := executeMonitorProbeForTarget(ctx, target, true); err != nil {
			return err
		}
	}
	return nil
}

func StartPlatformMonitorTask() {
	go func() {
		for {
			ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
			_ = RunPlatformProbeCycle(ctx)
			_ = RunCustomMonitorProbeCycle(ctx)
			cancel()
			time.Sleep(10 * time.Minute)
		}
	}()
}

func executeMonitorProbeForTarget(ctx context.Context, target model.MonitorTarget, consumeQuota bool) error {
	if consumeQuota {
		ownerUserID := *target.OwnerUserID
		if err := EnsureCustomMonitorQuota(ctx, ownerUserID); err != nil {
			return recordCustomMonitorQuotaFailure(target, err)
		}
	}
	probeCtx := BuildProbeContext(target)
	result := defaultProbeExecutor.Execute(ctx, target, probeCtx)
	status, message, level := DeriveMonitorServiceStatus(result)
	now := common.GetTimestamp()
	run := model.MonitorRun{
		TargetID:   target.Id,
		Status:     mapProbeRunStatus(result),
		StartedAt:  result.CheckedAt.Unix(),
		FinishedAt: result.CheckedAt.Unix(),
		DurationMs: result.Latency.Milliseconds(),
		SummaryJSON: mustMarshalMonitorJSON(map[string]any{
			"http_status": result.HTTPStatusCode,
			"error":       result.Error,
			"summary":     result.Summary,
		}),
	}
	if run.StartedAt == 0 {
		run.StartedAt = now
		run.FinishedAt = now
	}
	return model.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&run).Error; err != nil {
			return err
		}
		snapshot := model.MonitorStatusSnapshot{
			TargetID:      target.Id,
			RunID:         run.Id,
			Status:        status,
			StatusMessage: message,
			OccurredAt:    run.FinishedAt,
			CheckedAt:     run.FinishedAt,
			LatencyMs:     int(result.Latency.Milliseconds()),
			DetailJSON: mustMarshalMonitorJSON(map[string]any{
				"http_status": result.HTTPStatusCode,
				"error":       result.Error,
			}),
		}
		if err := tx.Create(&snapshot).Error; err != nil {
			return err
		}
		if err := recordMonitorEvent(tx, target, run, snapshot, level); err != nil {
			return err
		}
		if err := maybeRecordMonitorNotification(tx, target, snapshot, level); err != nil {
			return err
		}
		if consumeQuota {
			ownerUserID := *target.OwnerUserID
			quotaResult := tx.Model(&model.User{}).
				Where("id = ? AND quota >= ?", ownerUserID, customMonitorProbeQuotaCost).
				Update("quota", gorm.Expr("quota - ?", customMonitorProbeQuotaCost))
			if quotaResult.Error != nil {
				return quotaResult.Error
			}
			if quotaResult.RowsAffected == 0 {
				return errors.New("monitor quota is insufficient")
			}
			billingInput := BuildCustomMonitorBillingRecordInput(target, result)
			record := model.MonitorBillingRecord{
				TargetID:          billingInput.TargetID,
				OwnerUserID:       billingInput.OwnerUserID,
				Provider:          billingInput.Provider,
				ExternalRequestID: billingInput.ExternalRequestID,
				ModelName:         billingInput.ModelName,
				RequestType:       billingInput.RequestType,
				Currency:          billingInput.Currency,
				InputTokens:       billingInput.InputTokens,
				OutputTokens:      billingInput.OutputTokens,
				TotalTokens:       billingInput.TotalTokens,
				CostAmountMicros:  billingInput.CostAmountMicros,
				OccurredAt:        billingInput.OccurredAt,
			}
			if err := tx.Create(&record).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func recordCustomMonitorQuotaFailure(target model.MonitorTarget, quotaErr error) error {
	message := quotaErr.Error()
	event := model.MonitorEvent{
		TargetID:    target.Id,
		Level:       model.MonitorEventLevelError,
		Title:       target.Name + " quota blocked",
		Message:     message,
		OccurredAt:  common.GetTimestamp(),
		PayloadJSON: mustMarshalMonitorJSON(map[string]any{"reason": message}),
	}
	return model.DB.Create(&event).Error
}

func mapProbeRunStatus(result ProbeResult) model.MonitorRunStatus {
	if result.Success {
		return model.MonitorRunStatusSuccess
	}
	return model.MonitorRunStatusFailure
}

func mustMarshalMonitorJSON(payload map[string]any) model.MonitorJSON {
	bytes, err := common.Marshal(payload)
	if err != nil {
		return model.MonitorJSON(`{}`)
	}
	return model.MonitorJSON(bytes)
}
