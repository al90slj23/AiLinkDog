package service

import (
	"context"
	"testing"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestCreateCustomMonitorTargetEncryptsAPIKeyAndDefaultsPrivate(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"

	target, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID:           101,
		Name:                  "My OpenAI",
		ChannelType:           "openai",
		BaseURL:               "https://api.openai.com",
		APIKey:                "sk-test-plain",
		Model:                 "gpt-4.1-mini",
		GroupName:             "default",
		Tag:                   "personal",
		ProbeIntervalSeconds:  120,
		Enabled:               true,
	})
	require.NoError(t, err)
	require.NotNil(t, target)
	require.Equal(t, string(model.MonitorSourceTypeCustom), target.SourceType)
	require.Equal(t, string(model.MonitorVisibilityPrivate), target.Visibility)
	require.Empty(t, target.APIKey)

	var saved model.MonitorTarget
	require.NoError(t, model.DB.First(&saved, target.ID).Error)
	require.NotEmpty(t, saved.APIKeyEncrypted)
	require.NotEqual(t, "sk-test-plain", saved.APIKeyEncrypted)
	require.Empty(t, saved.APIKeyMasked)

	plain, err := DecryptMonitorTargetAPIKey(saved.APIKeyEncrypted)
	require.NoError(t, err)
	require.Equal(t, "sk-test-plain", plain)
}

func TestMonitorTargetSecretRoundTrip(t *testing.T) {
	common.CryptoSecret = "monitor-target-secret-for-tests"

	ciphertext, err := EncryptMonitorTargetAPIKey("sk-secret")
	require.NoError(t, err)
	require.NotEmpty(t, ciphertext)
	require.NotEqual(t, "sk-secret", ciphertext)

	plain, err := DecryptMonitorTargetAPIKey(ciphertext)
	require.NoError(t, err)
	require.Equal(t, "sk-secret", plain)
}

func TestMonitorTargetSecretRejectsInvalidCiphertext(t *testing.T) {
	common.CryptoSecret = "monitor-target-secret-for-tests"

	_, err := DecryptMonitorTargetAPIKey("not-valid")
	require.Error(t, err)
}

func TestMonitorTargetSecretRequiresCryptoSecret(t *testing.T) {
	common.CryptoSecret = ""
	_, err := EncryptMonitorTargetAPIKey("sk-secret")
	require.Error(t, err)
	_, err = DecryptMonitorTargetAPIKey("ciphertext")
	require.Error(t, err)
}

func TestMonitorBillingRecordCreateRoundTrip(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"

	target, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID:  7,
		Name:         "Billing Target",
		ChannelType:  "openai",
		BaseURL:      "https://example.com",
		APIKey:       "sk-billing",
		Model:        "gpt-4.1-mini",
		Enabled:      true,
	})
	require.NoError(t, err)

	record, err := CreateMonitorBillingRecord(context.Background(), CreateMonitorBillingRecordInput{
		TargetID:          target.ID,
		OwnerUserID:       7,
		Provider:          "openai",
		ExternalRequestID: "req-billing-1",
		ModelName:         "gpt-4.1-mini",
		RequestType:       "chat",
		Currency:          "USD",
		InputTokens:       10,
		OutputTokens:      20,
		TotalTokens:       30,
		CostAmountMicros:  456,
		OccurredAt:        1710000001,
	})
	require.NoError(t, err)
	require.NotZero(t, record.ID)

	var saved model.MonitorBillingRecord
	require.NoError(t, model.DB.First(&saved, record.ID).Error)
	require.Equal(t, target.ID, saved.TargetID)
	require.Equal(t, 7, saved.OwnerUserID)
	require.EqualValues(t, 456, saved.CostAmountMicros)
}

func TestMonitorBillingRecordRejectsPlatformTargetAndOwnerMismatch(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"

	platformTarget := model.MonitorTarget{
		Name:       "Platform Target",
		SourceType: model.MonitorSourceTypePlatform,
		Visibility: model.MonitorVisibilityPublic,
		SourceKey:  "platform-billing-target",
		SourceName: "platform-billing-target",
	}
	require.NoError(t, model.DB.Create(&platformTarget).Error)

	_, err := CreateMonitorBillingRecord(context.Background(), CreateMonitorBillingRecordInput{
		TargetID:    platformTarget.Id,
		OwnerUserID: 7,
	})
	require.Error(t, err)

	customTarget, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 9,
		Name:        "Owner Nine",
		ChannelType: "openai",
		BaseURL:     "https://example.com",
		APIKey:      "sk-owner-nine",
		Enabled:     true,
	})
	require.NoError(t, err)

	_, err = CreateMonitorBillingRecord(context.Background(), CreateMonitorBillingRecordInput{
		TargetID:    customTarget.ID,
		OwnerUserID: 10,
	})
	require.Error(t, err)
}

func TestRunCustomMonitorProbeCycleConsumesQuotaAndWritesBilling(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"
	require.NoError(t, model.DB.Create(&model.User{Id: 301, Username: "monitor-user", Password: "secret123", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Quota: 5, AffCode: "aff-301"}).Error)
	target, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 301,
		Name:        "Runner",
		ChannelType: "openai",
		BaseURL:     "https://example.com/runner",
		APIKey:      "sk-runner",
		Enabled:     true,
	})
	require.NoError(t, err)
	resetProbeExecutorForTest(t, ProbeExecutorFunc(func(ctx context.Context, target model.MonitorTarget, probeCtx ProbeContext) ProbeResult {
		return ProbeResult{Success: true, HTTPStatusCode: 204, Latency: 12 * time.Millisecond, CheckedAt: time.Now()}
	}))

	require.NoError(t, RunCustomMonitorProbeCycle(context.Background()))

	var user model.User
	require.NoError(t, model.DB.First(&user, 301).Error)
	require.Equal(t, 4, user.Quota)

	var billing model.MonitorBillingRecord
	require.NoError(t, model.DB.First(&billing).Error)
	require.Equal(t, target.ID, billing.TargetID)
	require.Equal(t, 301, billing.OwnerUserID)

	var run model.MonitorRun
	require.NoError(t, model.DB.First(&run).Error)
	var snapshot model.MonitorStatusSnapshot
	require.NoError(t, model.DB.First(&snapshot).Error)
	require.Equal(t, run.Id, snapshot.RunID)
}

func TestRunCustomMonitorProbeCycleRejectsTargetWithoutOwner(t *testing.T) {
	setupMonitorServiceTestDB(t)
	target := model.MonitorTarget{
		Name:       "Broken Custom",
		SourceType: model.MonitorSourceTypeCustom,
		Visibility: model.MonitorVisibilityPrivate,
		SourceKey:  "broken-custom",
		BaseURL:    "https://example.com/broken",
		ChannelType: "openai",
	}
	require.NoError(t, model.DB.Session(&gorm.Session{SkipHooks: true}).Create(&target).Error)

	require.NoError(t, RunCustomMonitorProbeCycle(context.Background()))
	var event model.MonitorEvent
	require.NoError(t, model.DB.Where("target_id = ?", target.Id).First(&event).Error)
	require.Contains(t, event.Message, "owner is missing")
}

func TestListCustomMonitorTargetsOnlyReturnsOwnersTargetsAndHidesAPIKey(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"

	first, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 1,
		Name:        "User One A",
		ChannelType: "openai",
		BaseURL:     "https://example.com/a",
		APIKey:      "sk-user-one-a",
		Enabled:     true,
	})
	require.NoError(t, err)
	_, err = CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 1,
		Name:        "User One B",
		ChannelType: "openai",
		BaseURL:     "https://example.com/b",
		APIKey:      "sk-user-one-b",
		Enabled:     true,
	})
	require.NoError(t, err)
	_, err = CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 2,
		Name:        "User Two A",
		ChannelType: "openai",
		BaseURL:     "https://example.com/c",
		APIKey:      "sk-user-two-a",
		Enabled:     true,
	})
	require.NoError(t, err)

	items, err := ListCustomMonitorTargets(1)
	require.NoError(t, err)
	require.Len(t, items, 2)
	require.Equal(t, first.ID, items[0].ID)
	for _, item := range items {
		require.Equal(t, 1, item.OwnerUserID)
		require.Equal(t, string(model.MonitorSourceTypeCustom), item.SourceType)
		require.Empty(t, item.APIKey)
	}
}

func TestGetCustomMonitorTargetReturnsOnlyOwnersTargetAndHidesAPIKey(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"

	owned, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 11,
		Name:        "Owned Target",
		ChannelType: "openai",
		BaseURL:     "https://example.com/owned",
		APIKey:      "sk-owned",
		Enabled:     true,
	})
	require.NoError(t, err)

	other, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 12,
		Name:        "Other Target",
		ChannelType: "openai",
		BaseURL:     "https://example.com/other",
		APIKey:      "sk-other",
		Enabled:     true,
	})
	require.NoError(t, err)

	item, err := GetCustomMonitorTarget(11, owned.ID)
	require.NoError(t, err)
	require.Equal(t, owned.ID, item.ID)
	require.Equal(t, 11, item.OwnerUserID)
	require.Empty(t, item.APIKey)

	missing, err := GetCustomMonitorTarget(11, other.ID)
	require.Error(t, err)
	require.Nil(t, missing)
	require.ErrorIs(t, err, gorm.ErrRecordNotFound)
}

func TestUpdateAndDeleteCustomMonitorTargetRespectOwnerIsolation(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"

	owned, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 21,
		Name:        "Owned Target",
		ChannelType: "openai",
		BaseURL:     "https://example.com/original",
		APIKey:      "sk-original",
		Enabled:     true,
	})
	require.NoError(t, err)

	updated, err := UpdateCustomMonitorTarget(context.Background(), 21, owned.ID, UpdateCustomMonitorTargetInput{
		Name:                 "Updated Target",
		BaseURL:              "https://example.com/updated",
		Model:                "gpt-4.1-mini",
		ProbeIntervalSeconds: 180,
		Enabled:              false,
	})
	require.NoError(t, err)
	require.Equal(t, "Updated Target", updated.Name)
	require.Equal(t, "https://example.com/updated", updated.BaseURL)
	require.Equal(t, "gpt-4.1-mini", updated.Model)
	require.False(t, updated.Enabled)
	require.Equal(t, string(model.MonitorLifecycleStatusDisabled), updated.Status)

	_, err = UpdateCustomMonitorTarget(context.Background(), 22, owned.ID, UpdateCustomMonitorTargetInput{Name: "Should Fail"})
	require.ErrorIs(t, err, gorm.ErrRecordNotFound)

	require.NoError(t, DeleteCustomMonitorTarget(context.Background(), 21, owned.ID))
	_, err = GetCustomMonitorTarget(21, owned.ID)
	require.ErrorIs(t, err, gorm.ErrRecordNotFound)

	err = DeleteCustomMonitorTarget(context.Background(), 22, owned.ID)
	require.ErrorIs(t, err, gorm.ErrRecordNotFound)
}

func TestListCustomMonitorArtifactsByOwner(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"

	target, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{
		OwnerUserID: 31,
		Name:        "Artifact Target",
		ChannelType: "openai",
		BaseURL:     "https://example.com/artifact",
		APIKey:      "sk-artifact",
		Enabled:     true,
	})
	require.NoError(t, err)

	run := model.MonitorRun{TargetID: target.ID, Status: model.MonitorRunStatusSuccess, StartedAt: 1710001000, FinishedAt: 1710001001, DurationMs: 250, SummaryJSON: mustMarshalMonitorJSON(map[string]any{"ok": true})}
	require.NoError(t, model.DB.Create(&run).Error)
	snapshot := model.MonitorStatusSnapshot{TargetID: target.ID, RunID: run.Id, Status: model.MonitorServiceStatusOperational, StatusMessage: "ok", OccurredAt: 1710001001, CheckedAt: 1710001001, LatencyMs: 250}
	require.NoError(t, model.DB.Create(&snapshot).Error)
	event := model.MonitorEvent{TargetID: target.ID, RunID: &run.Id, Level: model.MonitorEventLevelInfo, Title: "ok", Message: "success", OccurredAt: 1710001001}
	require.NoError(t, model.DB.Create(&event).Error)
	_, err = CreateMonitorBillingRecord(context.Background(), CreateMonitorBillingRecordInput{TargetID: target.ID, OwnerUserID: 31, Provider: "openai", ExternalRequestID: "req-31", ModelName: "gpt-4.1-mini", RequestType: "chat", Currency: "USD", InputTokens: 10, OutputTokens: 20, TotalTokens: 30, CostAmountMicros: 99, OccurredAt: 1710001001})
	require.NoError(t, err)

	runs, err := ListCustomMonitorRuns(31, target.ID)
	require.NoError(t, err)
	require.Len(t, runs, 1)
	require.Equal(t, run.Id, runs[0].ID)

	events, err := ListCustomMonitorEvents(31, target.ID)
	require.NoError(t, err)
	require.Len(t, events, 1)
	require.Equal(t, event.Id, events[0].ID)

	billing, err := ListCustomMonitorBillingRecords(31, target.ID)
	require.NoError(t, err)
	require.Len(t, billing, 1)
	require.Equal(t, int64(99), billing[0].CostAmountMicros)

	_, err = ListCustomMonitorRuns(32, target.ID)
	require.ErrorIs(t, err, gorm.ErrRecordNotFound)
	_, err = ListCustomMonitorEvents(32, target.ID)
	require.ErrorIs(t, err, gorm.ErrRecordNotFound)
	_, err = ListCustomMonitorBillingRecords(32, target.ID)
	require.ErrorIs(t, err, gorm.ErrRecordNotFound)
}

func TestRunCustomMonitorProbeCycleChecksQuotaAndWritesArtifacts(t *testing.T) {
	setupMonitorServiceTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"
	require.NoError(t, model.DB.Create(&model.User{Id: 41, Username: "u41", Password: "password123", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Quota: 1000, AccessToken: nil, AffCode: "aff-41"}).Error)
	require.NoError(t, model.DB.Create(&model.User{Id: 42, Username: "u42", Password: "password123", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Quota: 0, AccessToken: nil, AffCode: "aff-42"}).Error)

	eligible, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{OwnerUserID: 41, Name: "Eligible", ChannelType: "openai", BaseURL: "https://example.com/eligible", APIKey: "sk-eligible", Enabled: true})
	require.NoError(t, err)
	blocked, err := CreateCustomMonitorTarget(context.Background(), CreateCustomMonitorTargetInput{OwnerUserID: 42, Name: "Blocked", ChannelType: "openai", BaseURL: "https://example.com/blocked", APIKey: "sk-blocked", Enabled: true})
	require.NoError(t, err)

	resetProbeExecutorForTest(t, ProbeExecutorFunc(func(ctx context.Context, target model.MonitorTarget, probeCtx ProbeContext) ProbeResult {
		if target.Id != eligible.ID {
			t.Fatalf("unexpected probe target %d", target.Id)
		}
		return ProbeResult{Success: true, HTTPStatusCode: 200, Latency: 120 * time.Millisecond, CheckedAt: time.Unix(1710002000, 0), Summary: map[string]any{"endpoint": probeCtx.Endpoint}}
	}))

	err = RunCustomMonitorProbeCycle(context.Background())
	require.NoError(t, err)

	quota, err := model.GetUserQuota(41, true)
	require.NoError(t, err)
	require.Equal(t, 999, quota)

	blockedQuota, err := model.GetUserQuota(42, true)
	require.NoError(t, err)
	require.Equal(t, 0, blockedQuota)

	runs, err := ListCustomMonitorRuns(41, eligible.ID)
	require.NoError(t, err)
	require.Len(t, runs, 1)

	events, err := ListCustomMonitorEvents(41, eligible.ID)
	require.NoError(t, err)
	require.Len(t, events, 1)

	billing, err := ListCustomMonitorBillingRecords(41, eligible.ID)
	require.NoError(t, err)
	require.Len(t, billing, 1)
	require.Equal(t, int64(1), billing[0].CostAmountMicros)

	blockedRuns, err := ListCustomMonitorRuns(42, blocked.ID)
	require.NoError(t, err)
	require.Len(t, blockedRuns, 0)

	blockedEvents, err := ListCustomMonitorEvents(42, blocked.ID)
	require.NoError(t, err)
	require.Len(t, blockedEvents, 1)
	require.Equal(t, string(model.MonitorEventLevelError), blockedEvents[0].Level)

	blockedBilling, err := ListCustomMonitorBillingRecords(42, blocked.ID)
	require.NoError(t, err)
	require.Len(t, blockedBilling, 0)
}
