package service

import (
	"context"
	"fmt"
	"time"

	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/setting/console_setting"
)

const DefaultMonitorWindow = "24h"

func normalizeMonitorWindow(window string) string {
	switch window {
	case "24h", "7d", "30d":
		return window
	default:
		return DefaultMonitorWindow
	}
}

func getWindowStart(window string) int64 {
	now := time.Now().Unix()
	switch normalizeMonitorWindow(window) {
	case "7d":
		return now - 7*24*3600
	case "30d":
		return now - 30*24*3600
	default:
		return now - 24*3600
	}
}

func buildOverview(targets []dto.MonitorStatusTargetDTO, channels []dto.MonitorStatusChannelDTO, window string) dto.MonitorStatusOverviewDTO {
	targetCount := len(targets)
	affectedCount := 0
	var latencyTotal int
	var latencyCount int
	overallStatus := string(model.MonitorServiceStatusOperational)
	for _, channel := range channels {
		if channel.Status != string(model.MonitorServiceStatusOperational) {
			affectedCount++
		}
		if channel.Status == string(model.MonitorServiceStatusOutage) {
			overallStatus = string(model.MonitorServiceStatusOutage)
		} else if channel.Status == string(model.MonitorServiceStatusDegraded) && overallStatus != string(model.MonitorServiceStatusOutage) {
			overallStatus = string(model.MonitorServiceStatusDegraded)
		}
		if channel.LatencyMs > 0 {
			latencyTotal += channel.LatencyMs
			latencyCount++
		}
	}
	avgLatency := 0.0
	if latencyCount > 0 {
		avgLatency = float64(latencyTotal) / float64(latencyCount)
	}
	updatedAt := int64(0)
	if len(channels) > 0 {
		latest, _ := model.DB.Model(&model.MonitorStatusSnapshot{}).Select("MAX(checked_at)").Rows()
		if latest != nil {
			defer latest.Close()
			if latest.Next() {
				_ = latest.Scan(&updatedAt)
			}
		}
	}
	return dto.MonitorStatusOverviewDTO{
		OverallStatus: overallStatus,
		TargetCount:   targetCount,
		AffectedCount: affectedCount,
		AvgLatencyMs:  avgLatency,
		UpdatedAt:     updatedAt,
		Window:        normalizeMonitorWindow(window),
	}
}

func ListMonitorTargets(ctx context.Context, publicOnly bool) ([]dto.MonitorStatusTargetDTO, error) {
	_ = ctx
	query := model.DB.Model(&model.MonitorTarget{}).Where("source_type = ?", model.MonitorSourceTypePlatform).Order("id asc")
	if publicOnly {
		query = query.Where("visibility = ?", model.MonitorVisibilityPublic)
	}
	var targets []model.MonitorTarget
	if err := query.Find(&targets).Error; err != nil {
		return nil, err
	}
	items := make([]dto.MonitorStatusTargetDTO, 0, len(targets))
	for _, target := range targets {
		items = append(items, dto.MonitorStatusTargetDTO{
			ID:         target.Id,
			Name:       target.Name,
			SourceType: string(target.SourceType),
			Visibility: string(target.Visibility),
			SourceKey:  target.SourceKey,
			SourceName: target.SourceName,
			Status:     string(target.Status),
		})
	}
	return items, nil
}

func ListMonitorChannels(ctx context.Context, publicOnly bool) ([]dto.MonitorStatusChannelDTO, error) {
	_ = ctx
	query := model.DB.Model(&model.MonitorTarget{}).Where("source_type = ?", model.MonitorSourceTypePlatform).Order("id asc")
	if publicOnly {
		query = query.Where("visibility = ?", model.MonitorVisibilityPublic)
	}
	var targets []model.MonitorTarget
	if err := query.Find(&targets).Error; err != nil {
		return nil, err
	}
	rows := make([]dto.MonitorStatusChannelDTO, 0, len(targets))
	for _, target := range targets {
		channelStatus := string(model.MonitorServiceStatusOperational)
		latencyMs := 0
		var snapshot model.MonitorStatusSnapshot
		if err := model.DB.Where("target_id = ?", target.Id).Order("occurred_at desc, id desc").First(&snapshot).Error; err == nil {
			channelStatus = string(snapshot.Status)
			latencyMs = snapshot.LatencyMs
		}
		rows = append(rows, dto.MonitorStatusChannelDTO{
			ID:         target.Id,
			Name:       target.Name,
			Status:     channelStatus,
			LatencyMs:  latencyMs,
			SourceKey:  target.SourceKey,
			Visibility: string(target.Visibility),
		})
	}
	return rows, nil
}

func ListRecentMonitorEvents(ctx context.Context, publicOnly bool, window string) ([]dto.MonitorStatusEventDTO, error) {
	_ = ctx
	windowStart := getWindowStart(window)
	query := model.DB.Model(&model.MonitorEvent{}).Order("monitor_events.occurred_at desc, monitor_events.id desc").Limit(20)
	query = query.Where("monitor_events.occurred_at >= ?", windowStart)
	if publicOnly {
		query = query.Joins("JOIN monitor_targets ON monitor_targets.id = monitor_events.target_id").Where("monitor_targets.visibility = ? AND monitor_targets.source_type = ?", model.MonitorVisibilityPublic, model.MonitorSourceTypePlatform)
	}
	var events []model.MonitorEvent
	if err := query.Find(&events).Error; err != nil {
		return nil, err
	}
	items := make([]dto.MonitorStatusEventDTO, 0, len(events))
	for _, event := range events {
		source := getMonitorEventSource(event)
		message := event.Message
		if source == "notification" {
			message = appendMonitorNotificationMessage(message)
		}
		items = append(items, dto.MonitorStatusEventDTO{
			ID:         event.Id,
			TargetID:   event.TargetID,
			RunID:      event.RunID,
			Level:      string(event.Level),
			Title:      event.Title,
			Message:    message,
			OccurredAt: event.OccurredAt,
			Source:     source,
		})
	}
	return items, nil
}

func ListMonitorAnnouncements() []dto.MonitorStatusAnnouncementDTO {
	if !console_setting.GetConsoleSetting().AnnouncementsEnabled {
		return nil
	}
	items := console_setting.GetAnnouncements()
	announcements := make([]dto.MonitorStatusAnnouncementDTO, 0, len(items))
	for index, item := range items {
		content, _ := item["content"].(string)
		if content == "" {
			continue
		}
		announcement := dto.MonitorStatusAnnouncementDTO{
			ID:      index + 1,
			Content: content,
		}
		if id, ok := item["id"].(float64); ok {
			announcement.ID = int(id)
		}
		if publishDate, ok := item["publishDate"].(string); ok {
			announcement.PublishDate = publishDate
		}
		if announcementType, ok := item["type"].(string); ok {
			announcement.Type = announcementType
		}
		if extra, ok := item["extra"].(string); ok {
			announcement.Extra = extra
		}
		announcements = append(announcements, announcement)
	}
	if len(announcements) > 20 {
		return announcements[:20]
	}
	return announcements
}

func GetLatestMonitorSnapshot(ctx context.Context, targetID int) (*dto.MonitorStatusSnapshotDTO, error) {
	_ = ctx
	var snapshot model.MonitorStatusSnapshot
	err := model.DB.Where("target_id = ?", targetID).Order("occurred_at desc, id desc").First(&snapshot).Error
	if err != nil {
		return nil, err
	}
	return &dto.MonitorStatusSnapshotDTO{
		ID:            snapshot.Id,
		TargetID:      snapshot.TargetID,
		RunID:         snapshot.RunID,
		Status:        string(snapshot.Status),
		StatusMessage: snapshot.StatusMessage,
		OccurredAt:    snapshot.OccurredAt,
		CheckedAt:     snapshot.CheckedAt,
		LatencyMs:     snapshot.LatencyMs,
	}, nil
}

func BuildMonitorAdminOverview(ctx context.Context, window string) (*dto.MonitorAdminOverviewDTO, error) {
	window = normalizeMonitorWindow(window)
	targets, err := ListMonitorTargets(ctx, false)
	if err != nil {
		return nil, err
	}
	channels, err := ListMonitorChannels(ctx, false)
	if err != nil {
		return nil, err
	}
	events, err := ListRecentMonitorEvents(ctx, false, window)
	if err != nil {
		return nil, err
	}
	announcements := ListMonitorAnnouncements()
	return &dto.MonitorAdminOverviewDTO{
		Overview:      buildOverview(targets, channels, window),
		Targets:       targets,
		Channels:      channels,
		Events:        events,
		Announcements: announcements,
	}, nil
}

func BuildMonitorPublicSummary(ctx context.Context, window string) (*dto.MonitorPublicSummaryDTO, error) {
	window = normalizeMonitorWindow(window)
	targets, err := ListMonitorTargets(ctx, true)
	if err != nil {
		return nil, err
	}
	channels, err := ListMonitorChannels(ctx, true)
	if err != nil {
		return nil, err
	}
	events, err := ListRecentMonitorEvents(ctx, true, window)
	if err != nil {
		return nil, err
	}
	announcements := ListMonitorAnnouncements()
	return &dto.MonitorPublicSummaryDTO{
		Overview:      buildOverview(targets, channels, window),
		Targets:       targets,
		Events:        events,
		Announcements: announcements,
	}, nil
}

func BuildMonitorNotificationKey(target model.MonitorTarget, status model.MonitorServiceStatus, message string) string {
	return fmt.Sprintf("%d:%s:%s", target.Id, status, message)
}
