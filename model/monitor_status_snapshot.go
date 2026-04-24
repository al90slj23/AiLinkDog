package model

import (
	"errors"

	"github.com/QuantumNous/new-api/common"

	"gorm.io/gorm"
)

type MonitorServiceStatus string

const (
	MonitorServiceStatusOperational MonitorServiceStatus = "operational"
	MonitorServiceStatusDegraded    MonitorServiceStatus = "degraded"
	MonitorServiceStatusOutage      MonitorServiceStatus = "outage"
	MonitorServiceStatusMaintenance MonitorServiceStatus = "maintenance"
)

type MonitorStatusSnapshot struct {
	Id            int                  `json:"id"`
	TargetID      int                  `json:"target_id" gorm:"not null;index:idx_monitor_snapshot_target,priority:1"`
	RunID         int                  `json:"run_id" gorm:"not null;index:idx_monitor_snapshot_run"`
	Status        MonitorServiceStatus `json:"status" gorm:"type:varchar(24);not null;index:idx_monitor_snapshot_target,priority:2"`
	StatusMessage string               `json:"status_message" gorm:"type:varchar(255);not null;default:''"`
	OccurredAt    int64                `json:"occurred_at" gorm:"bigint;not null;default:0;index:idx_monitor_snapshot_target,priority:3"`
	CheckedAt     int64                `json:"checked_at" gorm:"bigint;not null;default:0"`
	LatencyMs     int                  `json:"latency_ms" gorm:"not null;default:0"`
	DetailJSON    MonitorJSON          `json:"detail_json" gorm:"column:detail_json;type:json"`
	CreatedAt     int64                `json:"created_at" gorm:"bigint"`
	UpdatedAt     int64                `json:"updated_at" gorm:"bigint"`
}

func (MonitorStatusSnapshot) TableName() string {
	return "monitor_status_snapshots"
}

func (s *MonitorStatusSnapshot) BeforeCreate(tx *gorm.DB) error {
	now := common.GetTimestamp()
	s.CreatedAt = now
	s.UpdatedAt = now
	return s.validate()
}

func (s *MonitorStatusSnapshot) BeforeUpdate(tx *gorm.DB) error {
	s.UpdatedAt = common.GetTimestamp()
	return s.validate()
}

func (s *MonitorStatusSnapshot) validate() error {
	if s.TargetID <= 0 {
		return errors.New("monitor status snapshot target id is required")
	}
	if s.RunID <= 0 {
		return errors.New("monitor status snapshot run id is required")
	}
	if s.Status == "" {
		s.Status = MonitorServiceStatusOperational
	} else if s.Status != MonitorServiceStatusOperational && s.Status != MonitorServiceStatusDegraded && s.Status != MonitorServiceStatusOutage && s.Status != MonitorServiceStatusMaintenance {
		return errors.New("monitor status snapshot status must be operational, degraded, outage, or maintenance")
	}
	if err := s.DetailJSON.validate(); err != nil {
		return err
	}
	return nil
}
