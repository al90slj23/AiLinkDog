package service

import (
	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"gorm.io/gorm"
)

const monitorNotificationDedupWindowSeconds int64 = 15 * 60

func maybeRecordMonitorNotification(tx *gorm.DB, target model.MonitorTarget, snapshot model.MonitorStatusSnapshot, level model.MonitorEventLevel) error {
	if level == model.MonitorEventLevelInfo {
		return nil
	}
	key := BuildMonitorNotificationKey(target, snapshot.Status, snapshot.StatusMessage)
	windowStart := snapshot.OccurredAt - monitorNotificationDedupWindowSeconds
	useDB := model.DB
	if tx != nil {
		useDB = tx
	}
	query := useDB.Model(&model.MonitorEvent{}).
		Where("target_id = ? AND occurred_at >= ?", target.Id, windowStart).
		Where("title = ?", buildMonitorNotificationTitle(target.Name))
	var existing model.MonitorEvent
	if err := query.Order("occurred_at desc, id desc").First(&existing).Error; err == nil {
		payload, payloadErr := decodeMonitorPayload(existing.PayloadJSON)
		if payloadErr == nil {
			if existingKey, _ := payload["notification_key"].(string); existingKey == key {
				return nil
			}
		}
	}
	payload := mustMarshalMonitorJSON(map[string]any{
		"notification_key": key,
		"source":           "notification",
		"status":           snapshot.Status,
	})
	return useDB.Create(&model.MonitorEvent{
		TargetID:    target.Id,
		Level:       level,
		Title:       buildMonitorNotificationTitle(target.Name),
		Message:     snapshot.StatusMessage,
		OccurredAt:  snapshot.OccurredAt,
		PayloadJSON: payload,
	}).Error
}

func buildMonitorNotificationTitle(targetName string) string {
	return targetName + " notification"
}

func getMonitorEventSource(event model.MonitorEvent) string {
	payload, err := decodeMonitorPayload(event.PayloadJSON)
	if err == nil {
		if source, ok := payload["source"].(string); ok && source != "" {
			return source
		}
	}
	return "monitor"
}

func decodeMonitorPayload(payload model.MonitorJSON) (map[string]any, error) {
	if len(payload) == 0 {
		return map[string]any{}, nil
	}
	decoded := make(map[string]any)
	if err := common.Unmarshal(payload, &decoded); err != nil {
		return nil, err
	}
	return decoded, nil
}

func appendMonitorNotificationMessage(message string) string {
	if message == "" {
		return "监控发现异常，已生成站内通知事件"
	}
	return message + " | 已生成站内通知事件"
}

func nowUnix() int64 {
	return common.GetTimestamp()
}
