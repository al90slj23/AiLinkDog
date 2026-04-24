package service

import (
	"context"
	"fmt"
	"strings"
	"testing"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/setting/console_setting"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func setupMonitorServiceTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	common.UsingSQLite = true
	common.UsingMySQL = false
	common.UsingPostgreSQL = false
	common.RedisEnabled = false

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", t.Name())
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	require.NoError(t, err)
	model.DB = db
	model.LOG_DB = db
	require.NoError(t, db.AutoMigrate(&model.User{}, &model.MonitorTarget{}, &model.MonitorBillingRecord{}, &model.MonitorRun{}, &model.MonitorStatusSnapshot{}, &model.MonitorEvent{}))
	require.NoError(t, db.Exec("DELETE FROM monitor_events").Error)
	require.NoError(t, db.Exec("DELETE FROM monitor_status_snapshots").Error)
	require.NoError(t, db.Exec("DELETE FROM monitor_runs").Error)
	require.NoError(t, db.Exec("DELETE FROM monitor_billing_records").Error)
	require.NoError(t, db.Exec("DELETE FROM monitor_targets").Error)
	require.NoError(t, db.Exec("DELETE FROM users").Error)

	t.Cleanup(func() {
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	})
	return db
}

func TestSeedPlatformMonitorTargetsCreatesDefaults(t *testing.T) {
	setupMonitorServiceTestDB(t)

	created, err := SeedPlatformMonitorTargets(context.Background())
	require.NoError(t, err)
	require.GreaterOrEqual(t, created, 1)

	var targets []model.MonitorTarget
	require.NoError(t, model.DB.Order("id asc").Find(&targets).Error)
	require.NotEmpty(t, targets)
	require.Equal(t, model.MonitorSourceTypePlatform, targets[0].SourceType)
	require.NotEmpty(t, targets[0].SourceKey)
	require.NotEmpty(t, targets[0].Name)
	require.NotEmpty(t, targets[0].BaseURL)

	createdAgain, err := SeedPlatformMonitorTargets(context.Background())
	require.NoError(t, err)
	require.Equal(t, 0, createdAgain)
	var count int64
	require.NoError(t, model.DB.Model(&model.MonitorTarget{}).Count(&count).Error)
	require.EqualValues(t, len(targets), count)
}

func TestBuildProbeContextPrefersConfiguredBaseURL(t *testing.T) {
	probeCtx := BuildProbeContext(model.MonitorTarget{
		SourceKey:       "gateway-core",
		BaseURL:         "http://127.0.0.1:3000/",
		TimeoutSeconds:  9,
		ChannelType:     "internal-http",
	})
	require.Equal(t, "http://127.0.0.1:3000/", probeCtx.Endpoint)
	require.Equal(t, 9, probeCtx.TimeoutSeconds)
}

func TestDeriveMonitorServiceStatusPrefersOutageAndDegraded(t *testing.T) {
	status, message, level := DeriveMonitorServiceStatus(ProbeResult{Success: false, HTTPStatusCode: 503, Error: "dial tcp timeout"})
	require.Equal(t, model.MonitorServiceStatusOutage, status)
	require.Equal(t, model.MonitorEventLevelError, level)
	require.Contains(t, strings.ToLower(message), "service unavailable")

	status, message, level = DeriveMonitorServiceStatus(ProbeResult{Success: true, HTTPStatusCode: 429})
	require.Equal(t, model.MonitorServiceStatusDegraded, status)
	require.Equal(t, model.MonitorEventLevelWarning, level)
	require.Contains(t, strings.ToLower(message), "too many requests")

	status, message, level = DeriveMonitorServiceStatus(ProbeResult{Success: false, HTTPStatusCode: 404})
	require.Equal(t, model.MonitorServiceStatusOutage, status)
	require.Equal(t, model.MonitorEventLevelError, level)
	require.Contains(t, strings.ToLower(message), "not found")

	status, message, level = DeriveMonitorServiceStatus(ProbeResult{Success: true, HTTPStatusCode: 204})
	require.Equal(t, model.MonitorServiceStatusOperational, status)
	require.Equal(t, model.MonitorEventLevelInfo, level)
	require.Contains(t, strings.ToLower(message), "no content")
}

func TestRunPlatformProbeCyclePersistsRunSnapshotAndEvent(t *testing.T) {
	setupMonitorServiceTestDB(t)
	_, err := SeedPlatformMonitorTargets(context.Background())
	require.NoError(t, err)

	ctx := context.Background()
	resetProbeExecutorForTest(t, ProbeExecutorFunc(func(ctx context.Context, target model.MonitorTarget, probeCtx ProbeContext) ProbeResult {
		return ProbeResult{
			Success:        true,
			HTTPStatusCode: 204,
			Latency:        25 * time.Millisecond,
			CheckedAt:      time.Unix(1710000000, 0),
			Summary: map[string]any{
				"endpoint": probeCtx.Endpoint,
			},
		}
	}))

	require.NoError(t, RunPlatformProbeCycle(ctx))

	var run model.MonitorRun
	require.NoError(t, model.DB.First(&run).Error)
	require.Equal(t, model.MonitorRunStatusSuccess, run.Status)

	var snapshot model.MonitorStatusSnapshot
	require.NoError(t, model.DB.First(&snapshot).Error)
	require.Equal(t, model.MonitorServiceStatusOperational, snapshot.Status)
	require.Equal(t, 25, snapshot.LatencyMs)

	var event model.MonitorEvent
	require.NoError(t, model.DB.First(&event).Error)
	require.Equal(t, model.MonitorEventLevelInfo, event.Level)
	require.Contains(t, event.Title, "API Gateway")
}

func TestBuildMonitorAdminOverviewIncludesOverviewChannelsAndWindow(t *testing.T) {
	setupMonitorServiceTestDB(t)
	_, err := SeedPlatformMonitorTargets(context.Background())
	require.NoError(t, err)

	now := time.Now()
	resetProbeExecutorForTest(t, ProbeExecutorFunc(func(ctx context.Context, target model.MonitorTarget, probeCtx ProbeContext) ProbeResult {
		statusCode := 204
		if target.SourceKey == "console-core" {
			statusCode = 429
		}
		return ProbeResult{
			Success:        statusCode < 500,
			HTTPStatusCode: statusCode,
			Latency:        40 * time.Millisecond,
			CheckedAt:      now,
			Summary: map[string]any{"endpoint": probeCtx.Endpoint},
		}
	}))

	require.NoError(t, RunPlatformProbeCycle(context.Background()))

	overview, err := BuildMonitorAdminOverview(context.Background(), "7d")
	require.NoError(t, err)
	require.Equal(t, "7d", overview.Overview.Window)
	require.NotEmpty(t, overview.Targets)
	require.NotEmpty(t, overview.Channels)
	require.NotEmpty(t, overview.Events)
	require.Equal(t, 3, overview.Overview.TargetCount)
	require.Equal(t, 1, overview.Overview.AffectedCount)
	require.Equal(t, string(model.MonitorServiceStatusDegraded), overview.Overview.OverallStatus)
}

func TestBuildMonitorAdminOverviewRespectsWindowForEvents(t *testing.T) {
	setupMonitorServiceTestDB(t)
	now := time.Now().Unix()
	target := model.MonitorTarget{
		Name:       "Window Target",
		SourceType: model.MonitorSourceTypePlatform,
		Visibility: model.MonitorVisibilityPublic,
		SourceKey:  "window-target",
		SourceName: "window-target",
		BaseURL:    "http://127.0.0.1:3000/window",
	}
	require.NoError(t, model.DB.Create(&target).Error)
	run := model.MonitorRun{TargetID: target.Id, Status: model.MonitorRunStatusSuccess, StartedAt: now, FinishedAt: now, DurationMs: 5}
	require.NoError(t, model.DB.Create(&run).Error)
	require.NoError(t, model.DB.Create(&model.MonitorStatusSnapshot{TargetID: target.Id, RunID: run.Id, Status: model.MonitorServiceStatusOperational, StatusMessage: "ok", OccurredAt: now, CheckedAt: now, LatencyMs: 5}).Error)
	require.NoError(t, model.DB.Create(&model.MonitorEvent{TargetID: target.Id, RunID: &run.Id, Level: model.MonitorEventLevelInfo, Title: "recent", Message: "recent event", OccurredAt: now}).Error)
	require.NoError(t, model.DB.Create(&model.MonitorEvent{TargetID: target.Id, RunID: &run.Id, Level: model.MonitorEventLevelInfo, Title: "old", Message: "old event", OccurredAt: now - 31*24*3600}).Error)

	overview, err := BuildMonitorAdminOverview(context.Background(), "24h")
	require.NoError(t, err)
	require.Len(t, overview.Events, 1)
	require.Equal(t, "recent", overview.Events[0].Title)

	overview30d, err := BuildMonitorAdminOverview(context.Background(), "30d")
	require.NoError(t, err)
	require.Len(t, overview30d.Events, 1)

	overviewAll, err := BuildMonitorAdminOverview(context.Background(), "bad")
	require.NoError(t, err)
	require.Equal(t, DefaultMonitorWindow, overviewAll.Overview.Window)
}

func TestBuildMonitorPublicSummaryIncludesConsoleAnnouncementsAndTaggedEvents(t *testing.T) {
	setupMonitorServiceTestDB(t)
	now := time.Now().Unix()
	common.OptionMap = map[string]string{
		"console_setting.announcements": `[{"id":1,"content":"平台公告：今晚维护窗口","publishDate":"2026-04-24T10:00:00Z","type":"warning","extra":"预计 10 分钟"}]`,
	}
	consoleConfig := console_setting.GetConsoleSetting()
	consoleConfig.Announcements = common.OptionMap["console_setting.announcements"]
	consoleConfig.AnnouncementsEnabled = true

	target := model.MonitorTarget{
		Name:       "Public Target",
		SourceType: model.MonitorSourceTypePlatform,
		Visibility: model.MonitorVisibilityPublic,
		SourceKey:  "public-target",
		SourceName: "public-target",
		BaseURL:    "http://127.0.0.1:3000/public",
	}
	require.NoError(t, model.DB.Create(&target).Error)
	run := model.MonitorRun{TargetID: target.Id, Status: model.MonitorRunStatusSuccess, StartedAt: now, FinishedAt: now, DurationMs: 5}
	require.NoError(t, model.DB.Create(&run).Error)
	require.NoError(t, model.DB.Create(&model.MonitorEvent{TargetID: target.Id, RunID: &run.Id, Level: model.MonitorEventLevelWarning, Title: "public event", Message: "public event message", OccurredAt: now}).Error)

	summary, err := BuildMonitorPublicSummary(context.Background(), "24h")
	require.NoError(t, err)
	require.Len(t, summary.Announcements, 1)
	require.Equal(t, "平台公告：今晚维护窗口", summary.Announcements[0].Content)
	require.Len(t, summary.Events, 1)
	require.Equal(t, "monitor", summary.Events[0].Source)

	overview, err := BuildMonitorAdminOverview(context.Background(), "24h")
	require.NoError(t, err)
	require.Len(t, overview.Announcements, 1)
	require.Equal(t, "warning", overview.Announcements[0].Type)
	require.Len(t, overview.Events, 1)
	require.Equal(t, "monitor", overview.Events[0].Source)
}

func TestMaybeRecordMonitorNotificationDeduplicatesWithinWindow(t *testing.T) {
	setupMonitorServiceTestDB(t)
	target := model.MonitorTarget{
		Name:       "Notification Target",
		SourceType: model.MonitorSourceTypePlatform,
		Visibility: model.MonitorVisibilityPublic,
		SourceKey:  "notification-target",
		SourceName: "notification-target",
		BaseURL:    "http://127.0.0.1:3000/notify",
	}
	require.NoError(t, model.DB.Create(&target).Error)

	snapshot := model.MonitorStatusSnapshot{
		TargetID:      target.Id,
		Status:        model.MonitorServiceStatusDegraded,
		StatusMessage: "Probe returned HTTP status Too Many Requests",
		OccurredAt:    time.Now().Unix(),
	}
	require.NoError(t, maybeRecordMonitorNotification(nil, target, snapshot, model.MonitorEventLevelWarning))
	require.NoError(t, maybeRecordMonitorNotification(nil, target, snapshot, model.MonitorEventLevelWarning))

	var events []model.MonitorEvent
	require.NoError(t, model.DB.Order("id asc").Find(&events).Error)
	require.Len(t, events, 1)
	require.Equal(t, buildMonitorNotificationTitle(target.Name), events[0].Title)

	summary, err := BuildMonitorAdminOverview(context.Background(), "24h")
	require.NoError(t, err)
	require.Len(t, summary.Events, 1)
	require.Equal(t, "notification", summary.Events[0].Source)
	require.Contains(t, summary.Events[0].Message, "站内通知事件")
}
