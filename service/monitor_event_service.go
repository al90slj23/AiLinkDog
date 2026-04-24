package service

import (
	"fmt"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"gorm.io/gorm"
)

func recordMonitorEvent(tx *gorm.DB, target model.MonitorTarget, run model.MonitorRun, snapshot model.MonitorStatusSnapshot, level model.MonitorEventLevel) error {
	title := fmt.Sprintf("%s -> %s", target.Name, snapshot.Status)
	payload, err := common.Marshal(map[string]any{"target": target.SourceKey})
	if err != nil {
		return err
	}
	event := model.MonitorEvent{
		TargetID:   target.Id,
		RunID:      &run.Id,
		Level:      level,
		Title:      title,
		Message:    snapshot.StatusMessage,
		OccurredAt: snapshot.OccurredAt,
		PayloadJSON: model.MonitorJSON(payload),
	}
	useDB := model.DB
	if tx != nil {
		useDB = tx
	}
	return useDB.Create(&event).Error
}
