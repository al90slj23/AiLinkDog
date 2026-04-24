package model

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestMonitorBillingRecordRejectsMissingTargetID(t *testing.T) {
	truncateTables(t)

	record := &MonitorBillingRecord{
		OwnerUserID:      1,
		Provider:         "openai",
		ExternalRequestID: "req-1",
		ModelName:        "gpt-4.1-mini",
	}

	err := DB.Create(record).Error
	require.Error(t, err)
	require.True(t, strings.Contains(err.Error(), "target id is required"), err.Error())
}

func TestMonitorBillingRecordRoundTrip(t *testing.T) {
	truncateTables(t)

	ownerUserID := 7
	target := &MonitorTarget{
		Name:        "User Target",
		SourceType:  MonitorSourceTypeCustom,
		OwnerUserID: &ownerUserID,
		SourceKey:   "custom-7-main",
		BaseURL:     "https://example.com",
	}
	require.NoError(t, DB.Create(target).Error)

	record := &MonitorBillingRecord{
		TargetID:           target.Id,
		OwnerUserID:        ownerUserID,
		Provider:           "openai",
		ExternalRequestID:  "req-1",
		ModelName:          "gpt-4.1-mini",
		RequestType:        "chat",
		Currency:           "USD",
		InputTokens:        100,
		OutputTokens:       50,
		TotalTokens:        150,
		CostAmountMicros:   12345,
		OccurredAt:         1710000000,
	}

	require.NoError(t, DB.Create(record).Error)
	require.NotZero(t, record.Id)

	var saved MonitorBillingRecord
	require.NoError(t, DB.First(&saved, record.Id).Error)
	require.Equal(t, target.Id, saved.TargetID)
	require.Equal(t, ownerUserID, saved.OwnerUserID)
	require.Equal(t, int64(12345), saved.CostAmountMicros)
	require.Equal(t, int64(150), saved.TotalTokens)
	require.Equal(t, "USD", saved.Currency)
}
