package model

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestMonitorTargetRejectsUnsupportedSourceType(t *testing.T) {
	truncateTables(t)

	target := &MonitorTarget{
		Name:       "Custom Target",
		SourceType: MonitorSourceType("user"),
		Visibility: MonitorVisibilityPublic,
		SourceKey:  "custom",
	}

	err := DB.Create(target).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "source type must be platform"), err.Error())
}

func TestMonitorTargetRejectsUnsupportedVisibility(t *testing.T) {
	truncateTables(t)

	target := &MonitorTarget{
		Name:       "Platform Target",
		SourceType: MonitorSourceTypePlatform,
		Visibility: MonitorVisibility("internal"),
		SourceKey:  "platform-main",
	}

	err := DB.Create(target).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "visibility must be public or private"), err.Error())
}

func TestMonitorTargetRejectsUnsupportedStatus(t *testing.T) {
	truncateTables(t)

	target := &MonitorTarget{
		Name:       "Platform Target",
		SourceType: MonitorSourceTypePlatform,
		Visibility: MonitorVisibilityPublic,
		SourceKey:  "platform-status-invalid",
		Status:     MonitorLifecycleStatus("archived"),
	}

	err := DB.Create(target).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "status must be enabled or disabled"), err.Error())
}

func TestMonitorTargetRoundTrip(t *testing.T) {
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
	require.NotZero(t, target.Id)
	require.NotZero(t, target.CreatedAt)
	require.NotZero(t, target.UpdatedAt)

	var saved MonitorTarget
	require.NoError(t, DB.First(&saved, target.Id).Error)
	require.Equal(t, MonitorSourceTypePlatform, saved.SourceType)
	require.Equal(t, MonitorVisibilityPublic, saved.Visibility)
	require.Equal(t, "platform-main", saved.SourceKey)
	require.Equal(t, MonitorLifecycleStatusEnabled, saved.Status)
}

func TestMonitorTargetAllowsCustomSourceWithOwnerAndDefaultsPrivateVisibility(t *testing.T) {
	truncateTables(t)

	ownerUserID := 42
	target := &MonitorTarget{
		Name:        "User Target",
		SourceType:  MonitorSourceTypeCustom,
		OwnerUserID: &ownerUserID,
		SourceKey:   "custom-42-main",
		BaseURL:     "https://example.com",
	}

	require.NoError(t, DB.Create(target).Error)
	require.Equal(t, MonitorVisibilityPrivate, target.Visibility)
	require.Equal(t, MonitorLifecycleStatusEnabled, target.Status)
	require.Equal(t, ownerUserID, *target.OwnerUserID)
}

func TestMonitorTargetRejectsCustomSourceWithoutOwnerUserID(t *testing.T) {
	truncateTables(t)

	target := &MonitorTarget{
		Name:       "User Target",
		SourceType: MonitorSourceTypeCustom,
		SourceKey:  "custom-missing-owner",
	}

	err := DB.Create(target).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "owner user id is required"), err.Error())
}

func TestMonitorTargetRejectsPlatformSourceWithOwnerUserID(t *testing.T) {
	truncateTables(t)

	ownerUserID := 99
	target := &MonitorTarget{
		Name:        "Platform Target",
		SourceType:  MonitorSourceTypePlatform,
		Visibility:  MonitorVisibilityPublic,
		OwnerUserID: &ownerUserID,
		SourceKey:   "platform-with-owner",
	}

	err := DB.Create(target).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "owner user id is only allowed"), err.Error())
}

func TestMonitorTargetRejectsPublicVisibilityForCustomSource(t *testing.T) {
	truncateTables(t)
	ownerUserID := 12
	target := &MonitorTarget{
		Name:        "Custom Public Target",
		SourceType:  MonitorSourceTypeCustom,
		OwnerUserID: &ownerUserID,
		Visibility:  MonitorVisibilityPublic,
		SourceKey:   "custom-public-target",
	}
	err := DB.Create(target).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "custom monitor target visibility must be private"), err.Error())
}
