package model

import (
	"errors"

	"github.com/QuantumNous/new-api/common"

	"gorm.io/gorm"
)

type MonitorEventLevel string

const (
	MonitorEventLevelInfo    MonitorEventLevel = "info"
	MonitorEventLevelWarning MonitorEventLevel = "warning"
	MonitorEventLevelError   MonitorEventLevel = "error"
)

type MonitorEvent struct {
	Id          int               `json:"id"`
	TargetID    int               `json:"target_id" gorm:"not null;index:idx_monitor_event_target,priority:1"`
	RunID       *int              `json:"run_id,omitempty" gorm:"index:idx_monitor_event_run"`
	Level       MonitorEventLevel `json:"level" gorm:"type:varchar(16);not null;index:idx_monitor_event_target,priority:2"`
	Title       string            `json:"title" gorm:"type:varchar(128);not null"`
	Message     string            `json:"message" gorm:"type:text"`
	OccurredAt  int64             `json:"occurred_at" gorm:"bigint;not null;default:0;index:idx_monitor_event_target,priority:3"`
	PayloadJSON MonitorJSON       `json:"payload_json" gorm:"column:payload_json;type:json"`
	CreatedAt   int64             `json:"created_at" gorm:"bigint"`
	UpdatedAt   int64             `json:"updated_at" gorm:"bigint"`
}

func (MonitorEvent) TableName() string {
	return "monitor_events"
}

func (e *MonitorEvent) BeforeCreate(tx *gorm.DB) error {
	now := common.GetTimestamp()
	e.CreatedAt = now
	e.UpdatedAt = now
	return e.validate()
}

func (e *MonitorEvent) BeforeUpdate(tx *gorm.DB) error {
	e.UpdatedAt = common.GetTimestamp()
	return e.validate()
}

func (e *MonitorEvent) validate() error {
	if e.TargetID <= 0 {
		return errors.New("monitor event target id is required")
	}
	if e.Title == "" {
		return errors.New("monitor event title is required")
	}
	if e.Level == "" {
		e.Level = MonitorEventLevelInfo
	} else if e.Level != MonitorEventLevelInfo && e.Level != MonitorEventLevelWarning && e.Level != MonitorEventLevelError {
		return errors.New("monitor event level must be info, warning, or error")
	}
	if err := e.PayloadJSON.validate(); err != nil {
		return err
	}
	return nil
}
