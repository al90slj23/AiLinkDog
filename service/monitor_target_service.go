package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/QuantumNous/new-api/model"
)

type CreateCustomMonitorTargetInput struct {
	OwnerUserID          int
	Name                 string
	ChannelType          string
	BaseURL              string
	APIKey               string
	Model                string
	GroupName            string
	Tag                  string
	ProbeIntervalSeconds int
	Enabled              bool
}

type MonitorTargetDTO struct {
	ID                   int    `json:"id"`
	Name                 string `json:"name"`
	SourceType           string `json:"source_type"`
	Visibility           string `json:"visibility"`
	OwnerUserID          int    `json:"owner_user_id"`
	ChannelType          string `json:"channel_type"`
	BaseURL              string `json:"base_url"`
	APIKey               string `json:"api_key,omitempty"`
	Model                string `json:"model"`
	GroupName            string `json:"group_name"`
	Tag                  string `json:"tag"`
	ProbeIntervalSeconds int    `json:"probe_interval_seconds"`
	Enabled              bool   `json:"enabled"`
	Status               string `json:"status"`
}

type CreateMonitorBillingRecordInput struct {
	TargetID          int
	OwnerUserID       int
	Provider          string
	ExternalRequestID string
	ModelName         string
	RequestType       string
	Currency          string
	InputTokens       int64
	OutputTokens      int64
	TotalTokens       int64
	CostAmountMicros  int64
	OccurredAt        int64
}

type MonitorBillingRecordDTO struct {
	ID                int    `json:"id"`
	TargetID          int    `json:"target_id"`
	OwnerUserID       int    `json:"owner_user_id"`
	Provider          string `json:"provider"`
	ExternalRequestID string `json:"external_request_id"`
	ModelName         string `json:"model_name"`
	RequestType       string `json:"request_type"`
	Currency          string `json:"currency"`
	InputTokens       int64  `json:"input_tokens"`
	OutputTokens      int64  `json:"output_tokens"`
	TotalTokens       int64  `json:"total_tokens"`
	CostAmountMicros  int64  `json:"cost_amount_micros"`
	OccurredAt        int64  `json:"occurred_at"`
}

type UpdateCustomMonitorTargetInput struct {
	Name                 string
	BaseURL              string
	APIKey               string
	Model                string
	GroupName            string
	Tag                  string
	ProbeIntervalSeconds int
	Enabled              bool
}

type MonitorRunDTO struct {
	ID         int    `json:"id"`
	TargetID   int    `json:"target_id"`
	Status     string `json:"status"`
	StartedAt  int64  `json:"started_at"`
	FinishedAt int64  `json:"finished_at"`
	DurationMs int64  `json:"duration_ms"`
}

type MonitorEventDTO struct {
	ID         int    `json:"id"`
	TargetID   int    `json:"target_id"`
	RunID      *int   `json:"run_id,omitempty"`
	Level      string `json:"level"`
	Title      string `json:"title"`
	Message    string `json:"message"`
	OccurredAt int64  `json:"occurred_at"`
}

func CreateCustomMonitorTarget(ctx context.Context, input CreateCustomMonitorTargetInput) (*MonitorTargetDTO, error) {
	_ = ctx
	apiKeyEncrypted, err := EncryptMonitorTargetAPIKey(strings.TrimSpace(input.APIKey))
	if err != nil {
		return nil, err
	}
	ownerUserID := input.OwnerUserID
	sourceKey := fmt.Sprintf("custom-%d-%s", ownerUserID, normalizeMonitorTargetKey(input.Name))
	target := model.MonitorTarget{
		Name:                 strings.TrimSpace(input.Name),
		SourceType:           model.MonitorSourceTypeCustom,
		OwnerUserID:          &ownerUserID,
		Visibility:           model.MonitorVisibilityPrivate,
		SourceKey:            sourceKey,
		SourceName:           sourceKey,
		BaseURL:              strings.TrimSpace(input.BaseURL),
		ChannelType:          strings.TrimSpace(input.ChannelType),
		APIKeyEncrypted:      apiKeyEncrypted,
		Model:                strings.TrimSpace(input.Model),
		GroupName:            strings.TrimSpace(input.GroupName),
		Tag:                  strings.TrimSpace(input.Tag),
		ProbeIntervalSeconds: input.ProbeIntervalSeconds,
		Enabled:              input.Enabled,
		Status:               boolToMonitorLifecycleStatus(input.Enabled),
	}
	if err := model.DB.Create(&target).Error; err != nil {
		return nil, err
	}
	return monitorTargetToDTO(target), nil
}

func CreateMonitorBillingRecord(ctx context.Context, input CreateMonitorBillingRecordInput) (*MonitorBillingRecordDTO, error) {
	_ = ctx
	var target model.MonitorTarget
	if err := model.DB.First(&target, input.TargetID).Error; err != nil {
		return nil, err
	}
	if target.SourceType != model.MonitorSourceTypeCustom {
		return nil, fmt.Errorf("monitor billing target must be custom")
	}
	if target.OwnerUserID == nil || *target.OwnerUserID != input.OwnerUserID {
		return nil, fmt.Errorf("monitor billing target owner mismatch")
	}
	record := model.MonitorBillingRecord{
		TargetID:          input.TargetID,
		OwnerUserID:       input.OwnerUserID,
		Provider:          strings.TrimSpace(input.Provider),
		ExternalRequestID: strings.TrimSpace(input.ExternalRequestID),
		ModelName:         strings.TrimSpace(input.ModelName),
		RequestType:       strings.TrimSpace(input.RequestType),
		Currency:          strings.TrimSpace(input.Currency),
		InputTokens:       input.InputTokens,
		OutputTokens:      input.OutputTokens,
		TotalTokens:       input.TotalTokens,
		CostAmountMicros:  input.CostAmountMicros,
		OccurredAt:        input.OccurredAt,
	}
	if err := model.DB.Create(&record).Error; err != nil {
		return nil, err
	}
	return &MonitorBillingRecordDTO{
		ID:                record.Id,
		TargetID:          record.TargetID,
		OwnerUserID:       record.OwnerUserID,
		Provider:          record.Provider,
		ExternalRequestID: record.ExternalRequestID,
		ModelName:         record.ModelName,
		RequestType:       record.RequestType,
		Currency:          record.Currency,
		InputTokens:       record.InputTokens,
		OutputTokens:      record.OutputTokens,
		TotalTokens:       record.TotalTokens,
		CostAmountMicros:  record.CostAmountMicros,
		OccurredAt:        record.OccurredAt,
	}, nil
}

func ListCustomMonitorTargets(userID int) ([]*MonitorTargetDTO, error) {
	var targets []model.MonitorTarget
	if err := model.DB.
		Where("source_type = ? AND owner_user_id = ?", model.MonitorSourceTypeCustom, userID).
		Order("id asc").
		Find(&targets).Error; err != nil {
		return nil, err
	}
	items := make([]*MonitorTargetDTO, 0, len(targets))
	for _, target := range targets {
		items = append(items, monitorTargetToDTO(target))
	}
	return items, nil
}

func GetCustomMonitorTarget(userID int, id int) (*MonitorTargetDTO, error) {
	target, err := requireOwnedCustomMonitorTarget(userID, id)
	if err != nil {
		return nil, err
	}
	return monitorTargetToDTO(*target), nil
}

func UpdateCustomMonitorTarget(ctx context.Context, userID int, id int, input UpdateCustomMonitorTargetInput) (*MonitorTargetDTO, error) {
	_ = ctx
	target, err := requireOwnedCustomMonitorTarget(userID, id)
	if err != nil {
		return nil, err
	}
	target.Name = strings.TrimSpace(input.Name)
	target.BaseURL = strings.TrimSpace(input.BaseURL)
	if strings.TrimSpace(input.APIKey) != "" {
		apiKeyEncrypted, err := EncryptMonitorTargetAPIKey(strings.TrimSpace(input.APIKey))
		if err != nil {
			return nil, err
		}
		target.APIKeyEncrypted = apiKeyEncrypted
	}
	target.Model = strings.TrimSpace(input.Model)
	target.GroupName = strings.TrimSpace(input.GroupName)
	target.Tag = strings.TrimSpace(input.Tag)
	if input.ProbeIntervalSeconds > 0 {
		target.ProbeIntervalSeconds = input.ProbeIntervalSeconds
	}
	target.Enabled = input.Enabled
	target.Status = boolToMonitorLifecycleStatus(input.Enabled)
	if err := model.DB.Save(target).Error; err != nil {
		return nil, err
	}
	return monitorTargetToDTO(*target), nil
}

func DeleteCustomMonitorTarget(ctx context.Context, userID int, id int) error {
	_ = ctx
	target, err := requireOwnedCustomMonitorTarget(userID, id)
	if err != nil {
		return err
	}
	return model.DB.Delete(target).Error
}

func ListCustomMonitorRuns(userID int, targetID int) ([]MonitorRunDTO, error) {
	if _, err := requireOwnedCustomMonitorTarget(userID, targetID); err != nil {
		return nil, err
	}
	var runs []model.MonitorRun
	if err := model.DB.Where("target_id = ?", targetID).Order("id desc").Find(&runs).Error; err != nil {
		return nil, err
	}
	items := make([]MonitorRunDTO, 0, len(runs))
	for _, run := range runs {
		items = append(items, MonitorRunDTO{ID: run.Id, TargetID: run.TargetID, Status: string(run.Status), StartedAt: run.StartedAt, FinishedAt: run.FinishedAt, DurationMs: run.DurationMs})
	}
	return items, nil
}

func ListCustomMonitorEvents(userID int, targetID int) ([]MonitorEventDTO, error) {
	if _, err := requireOwnedCustomMonitorTarget(userID, targetID); err != nil {
		return nil, err
	}
	var events []model.MonitorEvent
	if err := model.DB.Where("target_id = ?", targetID).Order("occurred_at desc, id desc").Find(&events).Error; err != nil {
		return nil, err
	}
	items := make([]MonitorEventDTO, 0, len(events))
	for _, event := range events {
		items = append(items, MonitorEventDTO{ID: event.Id, TargetID: event.TargetID, RunID: event.RunID, Level: string(event.Level), Title: event.Title, Message: event.Message, OccurredAt: event.OccurredAt})
	}
	return items, nil
}

func ListCustomMonitorBillingRecords(userID int, targetID int) ([]MonitorBillingRecordDTO, error) {
	if _, err := requireOwnedCustomMonitorTarget(userID, targetID); err != nil {
		return nil, err
	}
	var records []model.MonitorBillingRecord
	if err := model.DB.Where("target_id = ? AND owner_user_id = ?", targetID, userID).Order("occurred_at desc, id desc").Find(&records).Error; err != nil {
		return nil, err
	}
	items := make([]MonitorBillingRecordDTO, 0, len(records))
	for _, record := range records {
		items = append(items, MonitorBillingRecordDTO{ID: record.Id, TargetID: record.TargetID, OwnerUserID: record.OwnerUserID, Provider: record.Provider, ExternalRequestID: record.ExternalRequestID, ModelName: record.ModelName, RequestType: record.RequestType, Currency: record.Currency, InputTokens: record.InputTokens, OutputTokens: record.OutputTokens, TotalTokens: record.TotalTokens, CostAmountMicros: record.CostAmountMicros, OccurredAt: record.OccurredAt})
	}
	return items, nil
}

func monitorTargetToDTO(target model.MonitorTarget) *MonitorTargetDTO {
	ownerUserID := 0
	if target.OwnerUserID != nil {
		ownerUserID = *target.OwnerUserID
	}
	return &MonitorTargetDTO{
		ID:                   target.Id,
		Name:                 target.Name,
		SourceType:           string(target.SourceType),
		Visibility:           string(target.Visibility),
		OwnerUserID:          ownerUserID,
		ChannelType:          target.ChannelType,
		BaseURL:              target.BaseURL,
		APIKey:               "",
		Model:                target.Model,
		GroupName:            target.GroupName,
		Tag:                  target.Tag,
		ProbeIntervalSeconds: target.ProbeIntervalSeconds,
		Enabled:              target.Enabled,
		Status:               string(target.Status),
	}
}

func normalizeMonitorTargetKey(name string) string {
	key := strings.ToLower(strings.TrimSpace(name))
	key = strings.ReplaceAll(key, " ", "-")
	key = strings.ReplaceAll(key, "/", "-")
	if key == "" {
		return "target"
	}
	return key
}

func boolToMonitorLifecycleStatus(enabled bool) model.MonitorLifecycleStatus {
	if enabled {
		return model.MonitorLifecycleStatusEnabled
	}
	return model.MonitorLifecycleStatusDisabled
}
