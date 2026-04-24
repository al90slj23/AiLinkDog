package model

import (
	"errors"

	"github.com/QuantumNous/new-api/common"

	"gorm.io/gorm"
)

type MonitorRunStatus string

const (
	MonitorRunStatusRunning MonitorRunStatus = "running"
	MonitorRunStatusSuccess MonitorRunStatus = "success"
	MonitorRunStatusFailure MonitorRunStatus = "failure"
)

type MonitorRun struct {
	Id          int              `json:"id"`
	TargetID    int              `json:"target_id" gorm:"not null;index:idx_monitor_run_target"`
	Status      MonitorRunStatus `json:"status" gorm:"type:varchar(16);not null;index"`
	StartedAt   int64            `json:"started_at" gorm:"bigint;not null;default:0"`
	FinishedAt  int64            `json:"finished_at" gorm:"bigint;not null;default:0"`
	DurationMs  int64            `json:"duration_ms" gorm:"bigint;not null;default:0"`
	SummaryJSON MonitorJSON      `json:"summary_json" gorm:"column:summary_json;type:json"`
	CreatedAt   int64            `json:"created_at" gorm:"bigint"`
	UpdatedAt   int64            `json:"updated_at" gorm:"bigint"`
}

func (MonitorRun) TableName() string {
	return "monitor_runs"
}

func (r *MonitorRun) BeforeCreate(tx *gorm.DB) error {
	now := common.GetTimestamp()
	r.CreatedAt = now
	r.UpdatedAt = now
	return r.validate()
}

func (r *MonitorRun) BeforeUpdate(tx *gorm.DB) error {
	r.UpdatedAt = common.GetTimestamp()
	return r.validate()
}

func (r *MonitorRun) validate() error {
	if r.TargetID <= 0 {
		return errors.New("monitor run target id is required")
	}
	if r.Status == "" {
		r.Status = MonitorRunStatusRunning
	} else if r.Status != MonitorRunStatusRunning && r.Status != MonitorRunStatusSuccess && r.Status != MonitorRunStatusFailure {
		return errors.New("monitor run status must be running, success, or failure")
	}
	if err := r.SummaryJSON.validate(); err != nil {
		return err
	}
	return nil
}
