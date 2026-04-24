package controller

import (
	"context"
	"fmt"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

type monitorAPIResponse struct {
	Success bool              `json:"success"`
	Message string            `json:"message"`
	Data    monitorStatusData `json:"data"`
}

type monitorAPIEnvelope struct {
	Success bool            `json:"success"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data"`
}

type monitorStatusData struct {
	Targets []any `json:"targets"`
	Events  []any `json:"events"`
}

func setupMonitorControllerTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	gin.SetMode(gin.TestMode)
	common.UsingSQLite = true
	common.UsingMySQL = false
	common.UsingPostgreSQL = false
	common.RedisEnabled = false

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", t.Name())
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	require.NoError(t, err)
	model.DB = db
	model.LOG_DB = db
	require.NoError(t, db.AutoMigrate(&model.MonitorTarget{}, &model.MonitorRun{}, &model.MonitorStatusSnapshot{}, &model.MonitorEvent{}))
	require.NoError(t, db.Exec("DELETE FROM monitor_events").Error)
	require.NoError(t, db.Exec("DELETE FROM monitor_status_snapshots").Error)
	require.NoError(t, db.Exec("DELETE FROM monitor_runs").Error)
	require.NoError(t, db.Exec("DELETE FROM monitor_targets").Error)
	_, err = service.SeedPlatformMonitorTargets(context.Background())
	require.NoError(t, err)

	t.Cleanup(func() {
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	})
	return db
}

func TestMonitorAdminOverviewReturnsTargets(t *testing.T) {
	setupMonitorControllerTestDB(t)
	ctx, recorder := newAuthenticatedContext(t, http.MethodGet, "/api/monitor/admin/overview", nil, 1)

	GetMonitorAdminOverview(ctx)

	var response monitorAPIResponse
	require.NoError(t, common.Unmarshal(recorder.Body.Bytes(), &response))
	require.True(t, response.Success)
	require.NotEmpty(t, response.Data.Targets)
}

func TestMonitorPublicSummaryFiltersPrivateTargets(t *testing.T) {
	db := setupMonitorControllerTestDB(t)
	require.NoError(t, db.Create(&model.MonitorTarget{
		Name:       "Private Platform",
		SourceType: model.MonitorSourceTypePlatform,
		Visibility: model.MonitorVisibilityPrivate,
		SourceKey:  "platform-private",
		SourceName: "Private",
	}).Error)

	ctx, recorder := newAuthenticatedContext(t, http.MethodGet, "/api/monitor/public/summary", nil, 0)
	GetMonitorPublicSummary(ctx)

	var response monitorAPIResponse
	require.NoError(t, common.Unmarshal(recorder.Body.Bytes(), &response))
	require.True(t, response.Success)
	require.Len(t, response.Data.Targets, 1)
}

func TestMonitorUserCRUDAndArtifactsRespectOwnerIsolation(t *testing.T) {
	db := setupMonitorControllerTestDB(t)
	common.CryptoSecret = "monitor-target-secret-for-tests"
	require.NoError(t, db.AutoMigrate(&model.MonitorBillingRecord{}, &model.User{}))
	require.NoError(t, db.Create(&model.User{Id: 101, Username: "u101", Password: "password123", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Quota: 10, AffCode: "aff101"}).Error)
	require.NoError(t, db.Create(&model.User{Id: 102, Username: "u102", Password: "password123", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Quota: 10, AffCode: "aff102"}).Error)

	createBody := gin.H{"name": "User Target", "channel_type": "openai", "base_url": "https://example.com/user", "api_key": "sk-user", "model": "gpt-4.1-mini", "enabled": true}
	createCtx, createRecorder := newAuthenticatedContext(t, http.MethodPost, "/api/monitor/user/targets", createBody, 101)
	CreateMonitorUserTarget(createCtx)
	createResp := decodeMonitorEnvelope(t, createRecorder)
	require.True(t, createResp.Success)
	var created service.MonitorTargetDTO
	require.NoError(t, common.Unmarshal(createResp.Data, &created))
	require.NotZero(t, created.ID)

	listCtx, listRecorder := newAuthenticatedContext(t, http.MethodGet, "/api/monitor/user/targets", nil, 101)
	ListMonitorUserTargets(listCtx)
	listResp := decodeMonitorEnvelope(t, listRecorder)
	require.True(t, listResp.Success)
	var targets []*service.MonitorTargetDTO
	require.NoError(t, common.Unmarshal(listResp.Data, &targets))
	require.Len(t, targets, 1)
	require.Equal(t, 101, targets[0].OwnerUserID)

	updateBody := gin.H{"name": "User Target Updated", "base_url": "https://example.com/updated", "enabled": false}
	updateCtx, updateRecorder := newAuthenticatedContext(t, http.MethodPut, "/api/monitor/user/targets/"+strconv.Itoa(created.ID), updateBody, 101)
	updateCtx.Params = gin.Params{{Key: "id", Value: strconv.Itoa(created.ID)}}
	UpdateMonitorUserTarget(updateCtx)
	updateResp := decodeMonitorEnvelope(t, updateRecorder)
	require.True(t, updateResp.Success)
	var updated service.MonitorTargetDTO
	require.NoError(t, common.Unmarshal(updateResp.Data, &updated))
	require.Equal(t, "User Target Updated", updated.Name)
	require.False(t, updated.Enabled)

	run := model.MonitorRun{TargetID: created.ID, Status: model.MonitorRunStatusSuccess, StartedAt: 1710003000, FinishedAt: 1710003001, DurationMs: 111}
	require.NoError(t, db.Create(&run).Error)
	event := model.MonitorEvent{TargetID: created.ID, RunID: &run.Id, Level: model.MonitorEventLevelInfo, Title: "ok", Message: "success", OccurredAt: 1710003001}
	require.NoError(t, db.Create(&event).Error)
	_, err := service.CreateMonitorBillingRecord(context.Background(), service.CreateMonitorBillingRecordInput{TargetID: created.ID, OwnerUserID: 101, Provider: "openai", ExternalRequestID: "req-controller-1", ModelName: "gpt-4.1-mini", RequestType: "chat", CostAmountMicros: 1, OccurredAt: 1710003001})
	require.NoError(t, err)

	detailCtx, detailRecorder := newAuthenticatedContext(t, http.MethodGet, "/api/monitor/user/targets/"+strconv.Itoa(created.ID), nil, 101)
	detailCtx.Params = gin.Params{{Key: "id", Value: strconv.Itoa(created.ID)}}
	GetMonitorUserTargetDetail(detailCtx)
	detailResp := decodeMonitorEnvelope(t, detailRecorder)
	require.True(t, detailResp.Success)

	runsCtx, runsRecorder := newAuthenticatedContext(t, http.MethodGet, "/api/monitor/user/targets/"+strconv.Itoa(created.ID)+"/runs", nil, 101)
	runsCtx.Params = gin.Params{{Key: "id", Value: strconv.Itoa(created.ID)}}
	ListMonitorUserTargetRuns(runsCtx)
	runsResp := decodeMonitorEnvelope(t, runsRecorder)
	require.True(t, runsResp.Success)
	var runs []service.MonitorRunDTO
	require.NoError(t, common.Unmarshal(runsResp.Data, &runs))
	require.Len(t, runs, 1)

	eventsCtx, eventsRecorder := newAuthenticatedContext(t, http.MethodGet, "/api/monitor/user/targets/"+strconv.Itoa(created.ID)+"/events", nil, 101)
	eventsCtx.Params = gin.Params{{Key: "id", Value: strconv.Itoa(created.ID)}}
	ListMonitorUserTargetEvents(eventsCtx)
	eventsResp := decodeMonitorEnvelope(t, eventsRecorder)
	require.True(t, eventsResp.Success)
	var events []service.MonitorEventDTO
	require.NoError(t, common.Unmarshal(eventsResp.Data, &events))
	require.Len(t, events, 1)

	billingCtx, billingRecorder := newAuthenticatedContext(t, http.MethodGet, "/api/monitor/user/targets/"+strconv.Itoa(created.ID)+"/billing", nil, 101)
	billingCtx.Params = gin.Params{{Key: "id", Value: strconv.Itoa(created.ID)}}
	ListMonitorUserTargetBilling(billingCtx)
	billingResp := decodeMonitorEnvelope(t, billingRecorder)
	require.True(t, billingResp.Success)
	var billing []service.MonitorBillingRecordDTO
	require.NoError(t, common.Unmarshal(billingResp.Data, &billing))
	require.Len(t, billing, 1)

	unauthorizedCtx, unauthorizedRecorder := newAuthenticatedContext(t, http.MethodGet, "/api/monitor/user/targets/"+strconv.Itoa(created.ID), nil, 102)
	unauthorizedCtx.Params = gin.Params{{Key: "id", Value: strconv.Itoa(created.ID)}}
	GetMonitorUserTargetDetail(unauthorizedCtx)
	require.Equal(t, http.StatusOK, unauthorizedRecorder.Code)
	unauthorizedResp := decodeMonitorEnvelope(t, unauthorizedRecorder)
	require.False(t, unauthorizedResp.Success)

	deleteCtx, deleteRecorder := newAuthenticatedContext(t, http.MethodDelete, "/api/monitor/user/targets/"+strconv.Itoa(created.ID), nil, 101)
	deleteCtx.Params = gin.Params{{Key: "id", Value: strconv.Itoa(created.ID)}}
	DeleteMonitorUserTarget(deleteCtx)
	deleteResp := decodeMonitorEnvelope(t, deleteRecorder)
	require.True(t, deleteResp.Success)
}

func decodeMonitorEnvelope(t *testing.T, recorder *httptest.ResponseRecorder) monitorAPIEnvelope {
	t.Helper()
	var response monitorAPIEnvelope
	require.NoError(t, common.Unmarshal(recorder.Body.Bytes(), &response))
	return response
}
