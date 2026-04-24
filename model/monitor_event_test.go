package model

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestMonitorEventRequiresTargetID(t *testing.T) {
	event := &MonitorEvent{
		Level: MonitorEventLevelInfo,
		Title: "status_change",
	}

	err := DB.Create(event).Error
	require.Error(t, err)
}

func TestMonitorEventRejectsUnsupportedLevel(t *testing.T) {
	truncateTables(t)

	event := &MonitorEvent{
		TargetID: 1,
		Level:    MonitorEventLevel("debug"),
		Title:    "status_change",
	}

	err := DB.Create(event).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "level must be info, warning, or error"), err.Error())
}

func TestMonitorEventRejectsInvalidPayloadJSON(t *testing.T) {
	truncateTables(t)

	event := &MonitorEvent{
		TargetID:    1,
		Level:       MonitorEventLevelInfo,
		Title:       "status_change",
		PayloadJSON: MonitorJSON(`{"broken":`),
	}

	err := DB.Create(event).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "valid JSON"), err.Error())
}

func TestMonitorEventPayloadRoundTrip(t *testing.T) {
	truncateTables(t)

	target := &MonitorTarget{
		Name:       "Official Platform",
		SourceType: MonitorSourceTypePlatform,
		Visibility: MonitorVisibilityPublic,
		SourceKey:  "platform-main",
		SourceName: "AiLinkDog Platform",
		Status:     MonitorLifecycleStatusEnabled,
	}
	require.NoError(t, DB.Create(target).Error)

	run := &MonitorRun{
		TargetID: target.Id,
		Status:   MonitorRunStatusFailure,
	}
	require.NoError(t, DB.Create(run).Error)

	event := &MonitorEvent{
		TargetID:    target.Id,
		RunID:       &run.Id,
		Level:       MonitorEventLevelError,
		Title:       "probe_failed",
		Message:     "upstream timeout",
		OccurredAt:  1710000030,
		PayloadJSON: MonitorJSON(`{"reason":"timeout","retryable":true}`),
	}

	require.NoError(t, DB.Create(event).Error)

	var saved MonitorEvent
	require.NoError(t, DB.First(&saved, event.Id).Error)
	require.Equal(t, target.Id, saved.TargetID)
	require.NotNil(t, saved.RunID)
	require.Equal(t, run.Id, *saved.RunID)
	require.Equal(t, MonitorEventLevelError, saved.Level)
	require.JSONEq(t, `{"reason":"timeout","retryable":true}`, string(saved.PayloadJSON))
}
