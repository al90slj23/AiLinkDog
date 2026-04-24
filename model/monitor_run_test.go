package model

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestMonitorRunRequiresTargetID(t *testing.T) {
	run := &MonitorRun{
		Status: MonitorRunStatusRunning,
	}

	err := DB.Create(run).Error
	require.Error(t, err)
}

func TestMonitorRunRejectsUnsupportedStatus(t *testing.T) {
	truncateTables(t)

	run := &MonitorRun{
		TargetID: 1,
		Status:   MonitorRunStatus("queued"),
	}

	err := DB.Create(run).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "status must be running, success, or failure"), err.Error())
}

func TestMonitorRunRejectsInvalidSummaryJSON(t *testing.T) {
	truncateTables(t)

	run := &MonitorRun{
		TargetID:    1,
		Status:      MonitorRunStatusRunning,
		SummaryJSON: MonitorJSON(`{"broken":`),
	}

	err := DB.Create(run).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "valid JSON"), err.Error())
}

func TestMonitorRunPayloadRoundTrip(t *testing.T) {
	truncateTables(t)

	target := &MonitorTarget{
		Name:       "Official Platform",
		SourceType: MonitorSourceTypePlatform,
		Visibility: MonitorVisibilityPrivate,
		SourceKey:  "platform-main",
		SourceName: "AiLinkDog Platform",
		Status:     MonitorLifecycleStatusEnabled,
	}
	require.NoError(t, DB.Create(target).Error)

	run := &MonitorRun{
		TargetID:    target.Id,
		Status:      MonitorRunStatusSuccess,
		StartedAt:   1710000000,
		FinishedAt:  1710000015,
		DurationMs:  1500,
		SummaryJSON: MonitorJSON(`{"overall_status":"operational","platforms":1}`),
	}

	require.NoError(t, DB.Create(run).Error)
	require.NotZero(t, run.Id)
	require.NotZero(t, run.CreatedAt)
	require.NotZero(t, run.UpdatedAt)

	var saved MonitorRun
	require.NoError(t, DB.First(&saved, run.Id).Error)
	require.Equal(t, target.Id, saved.TargetID)
	require.Equal(t, MonitorRunStatusSuccess, saved.Status)
	require.JSONEq(t, `{"overall_status":"operational","platforms":1}`, string(saved.SummaryJSON))
}
