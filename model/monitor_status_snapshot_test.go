package model

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestMonitorStatusSnapshotRequiresTargetID(t *testing.T) {
	snapshot := &MonitorStatusSnapshot{
		Status: MonitorServiceStatusOperational,
	}

	err := DB.Create(snapshot).Error
	require.Error(t, err)
}

func TestMonitorStatusSnapshotRejectsUnsupportedStatus(t *testing.T) {
	truncateTables(t)

	snapshot := &MonitorStatusSnapshot{
		TargetID: 1,
		RunID:    1,
		Status:   MonitorServiceStatus("unknown"),
	}

	err := DB.Create(snapshot).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "status must be operational, degraded, outage, or maintenance"), err.Error())
}

func TestMonitorStatusSnapshotRejectsInvalidDetailJSON(t *testing.T) {
	truncateTables(t)

	snapshot := &MonitorStatusSnapshot{
		TargetID:   1,
		RunID:      1,
		Status:     MonitorServiceStatusOperational,
		DetailJSON: MonitorJSON(`{"broken":`),
	}

	err := DB.Create(snapshot).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "valid JSON"), err.Error())
}

func TestMonitorStatusSnapshotRoundTrip(t *testing.T) {
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
		Status:   MonitorRunStatusSuccess,
	}
	require.NoError(t, DB.Create(run).Error)

	snapshot := &MonitorStatusSnapshot{
		TargetID:      target.Id,
		RunID:         run.Id,
		Status:        MonitorServiceStatusOperational,
		StatusMessage: "All systems normal",
		OccurredAt:    1710000020,
		CheckedAt:     1710000025,
		LatencyMs:     320,
		DetailJSON:    MonitorJSON(`{"region":"global","healthy":true}`),
	}

	require.NoError(t, DB.Create(snapshot).Error)

	var saved MonitorStatusSnapshot
	require.NoError(t, DB.First(&saved, snapshot.Id).Error)
	require.Equal(t, target.Id, saved.TargetID)
	require.Equal(t, run.Id, saved.RunID)
	require.Equal(t, MonitorServiceStatusOperational, saved.Status)
	require.JSONEq(t, `{"region":"global","healthy":true}`, string(saved.DetailJSON))
}
