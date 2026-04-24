package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type upstreamTrackingPageAPIResponse struct {
	Success bool            `json:"success"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data"`
}

type upstreamTrackingPageResponse struct {
	Overview       upstreamTrackingOverviewView       `json:"overview"`
	HistoryItems   []upstreamTrackingHistoryItemView  `json:"historyItems"`
	SelectedDetail *upstreamTrackingHistoryDetailView `json:"selectedDetail"`
	ConfigView     upstreamTrackingConfigView         `json:"configView"`
}

type upstreamTrackingDetailResponse struct {
	Success bool                           `json:"success"`
	Message string                         `json:"message"`
	Data    upstreamTrackingHistoryDetailView `json:"data"`
}

type upstreamTrackingOverviewView struct {
	StartVersion      string   `json:"startVersion"`
	LastSyncedVersion string   `json:"lastSyncedVersion"`
	IntervalDays      int      `json:"intervalDays"`
	Repo              string   `json:"repo"`
	BaseBranch        string   `json:"baseBranch"`
	ExecutedAt        int64    `json:"executedAt"`
	UpdateSummary     string   `json:"updateSummary"`
	HasSimilarLocalWork bool   `json:"hasSimilarLocalWork"`
	LocalWorkSummary string    `json:"localWorkSummary"`
	ShouldMerge       string   `json:"shouldMerge"`
	MergeReason       string   `json:"mergeReason"`
	MergeStrategy     string   `json:"mergeStrategy"`
	MergePlanSummary string    `json:"mergePlanSummary"`
	TargetFiles       []string `json:"targetFiles"`
	TargetAreas       []string `json:"targetAreas"`
	RiskSummary       string   `json:"riskSummary"`
}

type upstreamTrackingHistoryItemView struct {
	ID             int    `json:"id"`
	Title          string `json:"title"`
	CycleCode      string `json:"cycleCode"`
	Status         string `json:"status"`
	ExecutedAt     int64  `json:"executedAt"`
	UpdateSummary  string `json:"updateSummary"`
	ShouldMerge    string `json:"shouldMerge"`
	MergeStrategy  string `json:"mergeStrategy"`
	DecisionStatus string `json:"decisionStatus"`
}

type upstreamTrackingHistoryDetailView struct {
	ID             int                           `json:"id"`
	CycleCode      string                        `json:"cycleCode"`
	Status         string                        `json:"status"`
	ExecutedAt     int64                         `json:"executedAt"`
	UpdateSummary  string                        `json:"updateSummary"`
	HasSimilarLocalWork bool                     `json:"hasSimilarLocalWork"`
	LocalWorkSummary string                      `json:"localWorkSummary"`
	ShouldMerge    string                        `json:"shouldMerge"`
	MergeReason    string                        `json:"mergeReason"`
	MergeStrategy  string                        `json:"mergeStrategy"`
	MergePlanSummary string                      `json:"mergePlanSummary"`
	TargetFiles    []string                      `json:"targetFiles"`
	TargetAreas    []string                      `json:"targetAreas"`
	RiskSummary    string                        `json:"riskSummary"`
	DecisionStatus string                        `json:"decisionStatus"`
	DecisionNote   string                        `json:"decisionNote"`
	Actions        []upstreamTrackingActionView  `json:"actions"`
	Contexts       []upstreamTrackingContextView `json:"contexts"`
}

type upstreamTrackingConfigView struct {
	Configured        bool   `json:"configured"`
	Enabled           bool   `json:"enabled"`
	StartVersion      string `json:"startVersion"`
	LastSyncedVersion string `json:"lastSyncedVersion"`
	IntervalDays      int    `json:"intervalDays"`
	RepoOwner         string `json:"repoOwner"`
	RepoName          string `json:"repoName"`
	Repo              string `json:"repo"`
	BaseBranch        string `json:"baseBranch"`
	MaskedToken       string `json:"maskedToken"`
}

type upstreamTrackingActionView struct {
	ID             int    `json:"id"`
	Title          string `json:"title"`
	Category       string `json:"category"`
	Recommendation string `json:"recommendation"`
	Priority       string `json:"priority"`
	Status         string `json:"status"`
	TargetArea     string `json:"targetArea"`
	Note           string `json:"note"`
}

type upstreamTrackingContextView struct {
	ID          int    `json:"id"`
	ContextType string `json:"contextType"`
	Content     string `json:"content"`
	ContentMeta string `json:"contentMeta"`
}

type upstreamTrackingConfigAPIResponse struct {
	Success bool                      `json:"success"`
	Message string                    `json:"message"`
	Data    upstreamTrackingConfigResponse `json:"data"`
}

type upstreamTrackingConfigResponse struct {
	Configured  bool   `json:"configured"`
	MaskedToken string `json:"maskedToken"`
}

func setupUpstreamTrackingControllerTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	gin.SetMode(gin.TestMode)
	common.UsingSQLite = true
	common.UsingMySQL = false
	common.UsingPostgreSQL = false
	common.RedisEnabled = false

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open sqlite db: %v", err)
	}
	model.DB = db
	model.LOG_DB = db

	if err := db.AutoMigrate(&model.Option{}, &model.UpstreamTrackingCycle{}, &model.UpstreamTrackingAction{}, &model.UpstreamTrackingContext{}); err != nil {
		t.Fatalf("failed to migrate upstream tracking cycle table: %v", err)
	}

	t.Cleanup(func() {
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	})

	return db
}

func TestGetUpstreamTrackingPageData(t *testing.T) {
	db := setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{
		upstreamTrackingRepoOwnerKey:     "QuantumNous",
		upstreamTrackingRepoNameKey:      "new-api",
		upstreamTrackingBaseBranchKey:    "main",
		upstreamTrackingProviderKey:      "deepseek",
		upstreamTrackingModelKey:         "deepseek-chat",
		upstreamTrackingBaseURLKey:       "https://api.example.com",
		upstreamTrackingAnalysisTokenKey: "secret-token-value",
		upstreamTrackingEnabledKey:       "true",
		"UpstreamTrackingStartVersion":    "v0.12.14",
		"UpstreamTrackingLastSyncedVersion": "v0.12.15",
	}
	common.UpstreamTrackingIntervalDays = 7

	olderCycle := &model.UpstreamTrackingCycle{
		CycleCode:          "cycle-0",
		Status:             "pending",
		RepoOwner:          "QuantumNous",
		RepoName:           "new-api",
		BaseBranch:         "main",
		AldBaseVersion:     "v0.12.13",
		Summary:            "older summary",
		RecommendationText: "",
		RiskSummary:        "medium risk",
		AnalysisFinishedAt: 1700000000000,
	}
	if err := db.Create(olderCycle).Error; err != nil {
		t.Fatalf("failed to create older cycle: %v", err)
	}

	latestCycle := &model.UpstreamTrackingCycle{
		CycleCode:          "cycle-1",
		Status:             "completed",
		RepoOwner:          "QuantumNous",
		RepoName:           "new-api",
		BaseBranch:         "main",
		AldBaseVersion:     "v0.12.14",
		Summary:            "upstream summary",
		RecommendationText: "merge carefully",
		DecisionStatus:     "accepted",
		DecisionNote:       "ship this sync",
		RiskSummary:        "low risk",
		AnalysisFinishedAt: 1710000000000,
	}
	if err := db.Create(latestCycle).Error; err != nil {
		t.Fatalf("failed to create latest cycle: %v", err)
	}

	action := &model.UpstreamTrackingAction{CycleId: latestCycle.Id, Title: "sync relay provider", Category: "relay", Recommendation: "merge", Priority: "high", Status: "pending", TargetArea: "relay/provider", Note: "touch adapter mapping"}
	if err := db.Create(action).Error; err != nil {
		t.Fatalf("failed to create action: %v", err)
	}

	contextItem := &model.UpstreamTrackingContext{CycleId: latestCycle.Id, ContextType: "compare", Content: "diff summary", ContentMeta: "{\"source\":\"upstream\"}"}
	if err := db.Create(contextItem).Error; err != nil {
		t.Fatalf("failed to create context: %v", err)
	}

	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/api/upstreamtracking/page", nil)

	GetUpstreamTrackingPageData(ctx)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", recorder.Code)
	}

	var response upstreamTrackingPageAPIResponse
	if err := common.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("failed to decode api response: %v", err)
	}
	if !response.Success {
		t.Fatalf("expected success response, got message: %s", response.Message)
	}

	var pageData upstreamTrackingPageResponse
	if err := common.Unmarshal(response.Data, &pageData); err != nil {
		t.Fatalf("failed to decode page response: %v", err)
	}
	if pageData.Overview.ExecutedAt != latestCycle.AnalysisFinishedAt {
		t.Fatalf("expected overview.executedAt %d, got %d", latestCycle.AnalysisFinishedAt, pageData.Overview.ExecutedAt)
	}
	if pageData.Overview.StartVersion != "v0.12.14" {
		t.Fatalf("expected overview.startVersion %q, got %q", "v0.12.14", pageData.Overview.StartVersion)
	}
	if pageData.Overview.LastSyncedVersion != "v0.12.15" {
		t.Fatalf("expected overview.lastSyncedVersion %q, got %q", "v0.12.15", pageData.Overview.LastSyncedVersion)
	}
	if pageData.Overview.IntervalDays != 7 {
		t.Fatalf("expected overview.intervalDays %d, got %d", 7, pageData.Overview.IntervalDays)
	}
	if pageData.Overview.Repo != "QuantumNous/new-api" {
		t.Fatalf("expected overview.repo %q, got %q", "QuantumNous/new-api", pageData.Overview.Repo)
	}
	if pageData.Overview.BaseBranch != "main" {
		t.Fatalf("expected overview.baseBranch %q, got %q", "main", pageData.Overview.BaseBranch)
	}
	if pageData.Overview.UpdateSummary != latestCycle.Summary {
		t.Fatalf("expected overview.updateSummary %q, got %q", latestCycle.Summary, pageData.Overview.UpdateSummary)
	}
	if pageData.Overview.ShouldMerge != "review" {
		t.Fatalf("expected overview.shouldMerge %q, got %q", "review", pageData.Overview.ShouldMerge)
	}
	if pageData.Overview.MergeStrategy == "" {
		t.Fatal("expected overview.mergeStrategy to be populated")
	}
	if pageData.Overview.TargetFiles == nil {
		t.Fatal("expected overview.targetFiles to be a stable array")
	}
	if pageData.Overview.MergeReason != latestCycle.RecommendationText {
		t.Fatalf("expected overview.mergeReason %q, got %q", latestCycle.RecommendationText, pageData.Overview.MergeReason)
	}
	if pageData.Overview.RiskSummary != latestCycle.RiskSummary {
		t.Fatalf("expected overview.riskSummary %q, got %q", latestCycle.RiskSummary, pageData.Overview.RiskSummary)
	}
	if pageData.ConfigView.MaskedToken != "secret-...alue" {
		t.Fatalf("expected masked token %q, got %q", "secret-...alue", pageData.ConfigView.MaskedToken)
	}
	if !pageData.ConfigView.Configured {
		t.Fatal("expected configView.configured to be true")
	}
	if !pageData.ConfigView.Enabled {
		t.Fatal("expected configView.enabled to be true")
	}
	if pageData.ConfigView.StartVersion != "v0.12.14" {
		t.Fatalf("expected configView.startVersion %q, got %q", "v0.12.14", pageData.ConfigView.StartVersion)
	}
	if pageData.ConfigView.LastSyncedVersion != "v0.12.15" {
		t.Fatalf("expected configView.lastSyncedVersion %q, got %q", "v0.12.15", pageData.ConfigView.LastSyncedVersion)
	}
	if pageData.ConfigView.IntervalDays != 7 {
		t.Fatalf("expected configView.intervalDays %d, got %d", 7, pageData.ConfigView.IntervalDays)
	}
	if pageData.ConfigView.RepoOwner != "QuantumNous" {
		t.Fatalf("expected configView.repoOwner %q, got %q", "QuantumNous", pageData.ConfigView.RepoOwner)
	}
	if pageData.ConfigView.RepoName != "new-api" {
		t.Fatalf("expected configView.repoName %q, got %q", "new-api", pageData.ConfigView.RepoName)
	}
	if pageData.ConfigView.Repo != "QuantumNous/new-api" {
		t.Fatalf("expected configView.repo %q, got %q", "QuantumNous/new-api", pageData.ConfigView.Repo)
	}
	if pageData.ConfigView.BaseBranch != "main" {
		t.Fatalf("expected configView.baseBranch %q, got %q", "main", pageData.ConfigView.BaseBranch)
	}
	if len(pageData.HistoryItems) < 1 {
		t.Fatalf("expected at least one history item, got %d", len(pageData.HistoryItems))
	}
	if pageData.HistoryItems[0].ID != latestCycle.Id {
		t.Fatalf("expected latest history item id %d, got %d", latestCycle.Id, pageData.HistoryItems[0].ID)
	}
	if pageData.HistoryItems[0].CycleCode != latestCycle.CycleCode {
		t.Fatalf("expected latest history item cycle code %q, got %q", latestCycle.CycleCode, pageData.HistoryItems[0].CycleCode)
	}
	if pageData.HistoryItems[0].UpdateSummary != latestCycle.Summary {
		t.Fatalf("expected latest history item summary %q, got %q", latestCycle.Summary, pageData.HistoryItems[0].UpdateSummary)
	}
	if pageData.HistoryItems[0].Title == "" {
		t.Fatal("expected latest history item title to be populated")
	}
	if pageData.HistoryItems[0].MergeStrategy == "" {
		t.Fatal("expected latest history item mergeStrategy to be populated")
	}
	if pageData.HistoryItems[0].DecisionStatus != latestCycle.DecisionStatus {
		t.Fatalf("expected latest history item decisionStatus %q, got %q", latestCycle.DecisionStatus, pageData.HistoryItems[0].DecisionStatus)
	}
	if pageData.SelectedDetail == nil {
		t.Fatal("expected selectedDetail to exist")
	}
	if pageData.SelectedDetail.ID != latestCycle.Id {
		t.Fatalf("expected selectedDetail.id %d, got %d", latestCycle.Id, pageData.SelectedDetail.ID)
	}
	if pageData.SelectedDetail.DecisionStatus != latestCycle.DecisionStatus {
		t.Fatalf("expected selectedDetail.decisionStatus %q, got %q", latestCycle.DecisionStatus, pageData.SelectedDetail.DecisionStatus)
	}
	if len(pageData.SelectedDetail.Actions) != 1 {
		t.Fatalf("expected selectedDetail.actions length %d, got %d", 1, len(pageData.SelectedDetail.Actions))
	}
	if pageData.SelectedDetail.Actions[0].ID != action.Id {
		t.Fatalf("expected selectedDetail.actions[0].id %d, got %d", action.Id, pageData.SelectedDetail.Actions[0].ID)
	}
	if pageData.SelectedDetail.Actions[0].Title != action.Title {
		t.Fatalf("expected selectedDetail.actions[0].title %q, got %q", action.Title, pageData.SelectedDetail.Actions[0].Title)
	}
	if pageData.SelectedDetail.Actions[0].Category != action.Category {
		t.Fatalf("expected selectedDetail.actions[0].category %q, got %q", action.Category, pageData.SelectedDetail.Actions[0].Category)
	}
	if pageData.SelectedDetail.Actions[0].Recommendation != action.Recommendation {
		t.Fatalf("expected selectedDetail.actions[0].recommendation %q, got %q", action.Recommendation, pageData.SelectedDetail.Actions[0].Recommendation)
	}
	if pageData.SelectedDetail.Actions[0].Priority != action.Priority {
		t.Fatalf("expected selectedDetail.actions[0].priority %q, got %q", action.Priority, pageData.SelectedDetail.Actions[0].Priority)
	}
	if pageData.SelectedDetail.Actions[0].Status != action.Status {
		t.Fatalf("expected selectedDetail.actions[0].status %q, got %q", action.Status, pageData.SelectedDetail.Actions[0].Status)
	}
	if pageData.SelectedDetail.Actions[0].TargetArea != action.TargetArea {
		t.Fatalf("expected selectedDetail.actions[0].targetArea %q, got %q", action.TargetArea, pageData.SelectedDetail.Actions[0].TargetArea)
	}
	if pageData.SelectedDetail.Actions[0].Note != action.Note {
		t.Fatalf("expected selectedDetail.actions[0].note %q, got %q", action.Note, pageData.SelectedDetail.Actions[0].Note)
	}
	if len(pageData.SelectedDetail.Contexts) != 1 {
		t.Fatalf("expected selectedDetail.contexts length %d, got %d", 1, len(pageData.SelectedDetail.Contexts))
	}
	if pageData.SelectedDetail.Contexts[0].ID != contextItem.Id {
		t.Fatalf("expected selectedDetail.contexts[0].id %d, got %d", contextItem.Id, pageData.SelectedDetail.Contexts[0].ID)
	}
	if pageData.SelectedDetail.Contexts[0].ContextType != contextItem.ContextType {
		t.Fatalf("expected selectedDetail.contexts[0].contextType %q, got %q", contextItem.ContextType, pageData.SelectedDetail.Contexts[0].ContextType)
	}
	if pageData.SelectedDetail.Contexts[0].Content != contextItem.Content {
		t.Fatalf("expected selectedDetail.contexts[0].content %q, got %q", contextItem.Content, pageData.SelectedDetail.Contexts[0].Content)
	}
	if pageData.SelectedDetail.Contexts[0].ContentMeta != contextItem.ContentMeta {
		t.Fatalf("expected selectedDetail.contexts[0].contentMeta %q, got %q", contextItem.ContentMeta, pageData.SelectedDetail.Contexts[0].ContentMeta)
	}
}

func TestGetUpstreamTrackingPageDataBuildsOverview(t *testing.T) {
	db := setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{
		"UpstreamTrackingStartVersion":      "v0.12.14",
		"UpstreamTrackingLastSyncedVersion": "v0.12.16",
	}
	common.UpstreamTrackingIntervalDays = 14

	cycle := &model.UpstreamTrackingCycle{
		CycleCode:          "cycle-overview",
		Status:             "completed",
		Summary:            "sync auth and relay fixes",
		RecommendationText: "merge after smoke test",
		AnalysisFinishedAt: 1720000000000,
	}
	if err := db.Create(cycle).Error; err != nil {
		t.Fatalf("failed to create cycle: %v", err)
	}

	pageData := getUpstreamTrackingPageDataForTest(t)

	if pageData.Overview.StartVersion != "v0.12.14" {
		t.Fatalf("expected startVersion %q, got %q", "v0.12.14", pageData.Overview.StartVersion)
	}
	if pageData.Overview.LastSyncedVersion != "v0.12.16" {
		t.Fatalf("expected lastSyncedVersion %q, got %q", "v0.12.16", pageData.Overview.LastSyncedVersion)
	}
	if pageData.Overview.IntervalDays != 14 {
		t.Fatalf("expected intervalDays %d, got %d", 14, pageData.Overview.IntervalDays)
	}
	if pageData.Overview.ExecutedAt != cycle.AnalysisFinishedAt {
		t.Fatalf("expected executedAt %d, got %d", cycle.AnalysisFinishedAt, pageData.Overview.ExecutedAt)
	}
	if pageData.Overview.UpdateSummary != cycle.Summary {
		t.Fatalf("expected updateSummary %q, got %q", cycle.Summary, pageData.Overview.UpdateSummary)
	}
	if pageData.Overview.ShouldMerge != "review" {
		t.Fatalf("expected shouldMerge %q, got %q", "review", pageData.Overview.ShouldMerge)
	}
	if pageData.Overview.MergeStrategy == "" {
		t.Fatal("expected mergeStrategy to be populated")
	}
	if pageData.Overview.TargetFiles == nil {
		t.Fatal("expected targetFiles to be initialized")
	}
	if pageData.Overview.TargetAreas == nil {
		t.Fatal("expected targetAreas to be initialized")
	}
	if pageData.Overview.MergeReason != cycle.RecommendationText {
		t.Fatalf("expected mergeReason %q, got %q", cycle.RecommendationText, pageData.Overview.MergeReason)
	}
	if pageData.Overview.Repo != "" {
		t.Fatalf("expected empty repo when repo config missing, got %q", pageData.Overview.Repo)
	}
}

func TestGetUpstreamTrackingPageDataBuildsHistory(t *testing.T) {
	db := setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{}

	latestCycle := &model.UpstreamTrackingCycle{
		CycleCode:          "cycle-history-1",
		Status:             "completed",
		Summary:            "latest update",
		RecommendationText: "review merge path",
		DecisionStatus:     "accepted",
		AnalysisFinishedAt: 1730000000000,
	}
	olderCycle := &model.UpstreamTrackingCycle{
		CycleCode:          "cycle-history-0",
		Status:             "completed",
		Summary:            "older update",
		RecommendationText: "",
		DecisionStatus:     "undecided",
		AnalysisFinishedAt: 1720000000000,
	}
	if err := db.Create(olderCycle).Error; err != nil {
		t.Fatalf("failed to create older cycle: %v", err)
	}
	if err := db.Create(latestCycle).Error; err != nil {
		t.Fatalf("failed to create latest cycle: %v", err)
	}

	pageData := getUpstreamTrackingPageDataForTest(t)

	if len(pageData.HistoryItems) != 2 {
		t.Fatalf("expected history items length %d, got %d", 2, len(pageData.HistoryItems))
	}
	if pageData.HistoryItems[0].ID != latestCycle.Id {
		t.Fatalf("expected latest item id %d, got %d", latestCycle.Id, pageData.HistoryItems[0].ID)
	}
	if pageData.HistoryItems[0].ExecutedAt != latestCycle.AnalysisFinishedAt {
		t.Fatalf("expected latest item executedAt %d, got %d", latestCycle.AnalysisFinishedAt, pageData.HistoryItems[0].ExecutedAt)
	}
	if pageData.HistoryItems[0].Title == "" {
		t.Fatal("expected history item title to be populated")
	}
	if pageData.HistoryItems[0].ShouldMerge != "review" {
		t.Fatalf("expected latest item shouldMerge %q, got %q", "review", pageData.HistoryItems[0].ShouldMerge)
	}
	if pageData.HistoryItems[0].MergeStrategy == "" {
		t.Fatal("expected history item mergeStrategy to be populated")
	}
	if pageData.HistoryItems[0].DecisionStatus != "accepted" {
		t.Fatalf("expected decisionStatus %q, got %q", "accepted", pageData.HistoryItems[0].DecisionStatus)
	}
}

func TestGetUpstreamTrackingPageDataKeepsFailedAnalysisVisible(t *testing.T) {
	db := setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{}

	cycle := &model.UpstreamTrackingCycle{
		CycleCode:           "cycle-failed-1",
		Status:              "failed",
		Summary:             "分析失败：未能生成有效评估结果",
		RecommendationLevel: "observe",
		RecommendationText:  "请先检查 compare 证据与模型输出后重试。",
		RiskSummary:         "分析输出解析失败: invalid character 'o' in literal null; compare fetch failed: timeout",
		AnalysisFinishedAt:  1735000000000,
	}
	if err := db.Create(cycle).Error; err != nil {
		t.Fatalf("failed to create failed cycle: %v", err)
	}

	pageData := getUpstreamTrackingPageDataForTest(t)

	if pageData.Overview.UpdateSummary != cycle.Summary {
		t.Fatalf("expected failed overview summary %q, got %q", cycle.Summary, pageData.Overview.UpdateSummary)
	}
	if pageData.Overview.ShouldMerge != "observe" {
		t.Fatalf("expected failed overview shouldMerge %q, got %q", "observe", pageData.Overview.ShouldMerge)
	}
	if !strings.Contains(pageData.Overview.RiskSummary, "分析输出解析失败") {
		t.Fatalf("expected failed overview risk summary to surface failure reason, got %q", pageData.Overview.RiskSummary)
	}
	if pageData.SelectedDetail == nil {
		t.Fatal("expected selectedDetail for failed cycle")
	}
	if pageData.SelectedDetail.Status != "failed" {
		t.Fatalf("expected selectedDetail status %q, got %q", "failed", pageData.SelectedDetail.Status)
	}
	if pageData.SelectedDetail.ShouldMerge != "observe" {
		t.Fatalf("expected selectedDetail shouldMerge %q, got %q", "observe", pageData.SelectedDetail.ShouldMerge)
	}
	if pageData.SelectedDetail.MergeStrategy != "observe_only" {
		t.Fatalf("expected selectedDetail mergeStrategy %q, got %q", "observe_only", pageData.SelectedDetail.MergeStrategy)
	}
	if !strings.Contains(pageData.SelectedDetail.RiskSummary, "compare fetch failed") {
		t.Fatalf("expected selectedDetail riskSummary to keep degradation notes, got %q", pageData.SelectedDetail.RiskSummary)
	}
}

func TestGetUpstreamTrackingPageDataReadsProductFieldsFromAnalysisResponse(t *testing.T) {
	db := setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{
		"UpstreamTrackingStartVersion":      "v0.12.14",
		"UpstreamTrackingLastSyncedVersion": "v0.12.18",
	}

	cycle := &model.UpstreamTrackingCycle{
		CycleCode:           "cycle-product-1",
		Status:              "completed",
		Summary:             "fallback summary",
		RecommendationLevel: "merge",
		RecommendationText:  "fallback merge reason",
		RiskSummary:         "fallback risk summary",
		AnalysisFinishedAt:  1740000000000,
	}
	if err := db.Create(cycle).Error; err != nil {
		t.Fatalf("failed to create cycle: %v", err)
	}

	analysisResponse := &model.UpstreamTrackingContext{
		CycleId:      cycle.Id,
		ContextType:  "analysis_response",
		Content:      `{"updateSummary":"来自产品化结果的更新摘要","hasSimilarLocalWork":true,"localWorkSummary":"本地已有类似 relay 收口","shouldMerge":"merge","mergeReason":"建议同步核心修复","mergeStrategy":"cherry_pick","mergePlanSummary":"先改 service，再补 controller 聚合","targetFiles":["service/upstream_tracking_service.go","controller/upstream_tracking.go"],"targetAreas":["service","controller"],"riskSummary":"compare 失败，基于提交保守判断","actions":[]}`,
		ContentMeta:  "",
	}
	if err := db.Create(analysisResponse).Error; err != nil {
		t.Fatalf("failed to create analysis_response context: %v", err)
	}

	pageData := getUpstreamTrackingPageDataForTest(t)

	if pageData.Overview.UpdateSummary != "来自产品化结果的更新摘要" {
		t.Fatalf("expected overview updateSummary from analysis_response, got %q", pageData.Overview.UpdateSummary)
	}
	if !pageData.Overview.HasSimilarLocalWork {
		t.Fatal("expected overview hasSimilarLocalWork from analysis_response")
	}
	if pageData.Overview.LocalWorkSummary != "本地已有类似 relay 收口" {
		t.Fatalf("expected overview localWorkSummary from analysis_response, got %q", pageData.Overview.LocalWorkSummary)
	}
	if pageData.Overview.MergeReason != "建议同步核心修复" {
		t.Fatalf("expected overview mergeReason from analysis_response, got %q", pageData.Overview.MergeReason)
	}
	if pageData.Overview.MergeStrategy != "cherry_pick" {
		t.Fatalf("expected overview mergeStrategy from analysis_response, got %q", pageData.Overview.MergeStrategy)
	}
	if pageData.Overview.MergePlanSummary != "先改 service，再补 controller 聚合" {
		t.Fatalf("expected overview mergePlanSummary from analysis_response, got %q", pageData.Overview.MergePlanSummary)
	}
	if len(pageData.Overview.TargetFiles) != 2 || pageData.Overview.TargetFiles[0] != "service/upstream_tracking_service.go" {
		t.Fatalf("expected overview targetFiles from analysis_response, got %#v", pageData.Overview.TargetFiles)
	}
	if len(pageData.Overview.TargetAreas) != 2 || pageData.Overview.TargetAreas[1] != "controller" {
		t.Fatalf("expected overview targetAreas from analysis_response, got %#v", pageData.Overview.TargetAreas)
	}
	if pageData.Overview.RiskSummary != "compare 失败，基于提交保守判断" {
		t.Fatalf("expected overview riskSummary from analysis_response, got %q", pageData.Overview.RiskSummary)
	}
	if pageData.SelectedDetail == nil {
		t.Fatal("expected selectedDetail to exist")
	}
	if pageData.SelectedDetail.UpdateSummary != "来自产品化结果的更新摘要" {
		t.Fatalf("expected selectedDetail updateSummary from analysis_response, got %q", pageData.SelectedDetail.UpdateSummary)
	}
	if !pageData.SelectedDetail.HasSimilarLocalWork {
		t.Fatal("expected selectedDetail hasSimilarLocalWork from analysis_response")
	}
	if pageData.SelectedDetail.LocalWorkSummary != "本地已有类似 relay 收口" {
		t.Fatalf("expected selectedDetail localWorkSummary from analysis_response, got %q", pageData.SelectedDetail.LocalWorkSummary)
	}
	if pageData.SelectedDetail.ShouldMerge != "merge" {
		t.Fatalf("expected selectedDetail shouldMerge from analysis_response, got %q", pageData.SelectedDetail.ShouldMerge)
	}
	if pageData.SelectedDetail.MergePlanSummary != "先改 service，再补 controller 聚合" {
		t.Fatalf("expected selectedDetail mergePlanSummary from analysis_response, got %q", pageData.SelectedDetail.MergePlanSummary)
	}
	if len(pageData.SelectedDetail.TargetFiles) != 2 {
		t.Fatalf("expected selectedDetail targetFiles from analysis_response, got %#v", pageData.SelectedDetail.TargetFiles)
	}
	if len(pageData.SelectedDetail.TargetAreas) != 2 {
		t.Fatalf("expected selectedDetail targetAreas from analysis_response, got %#v", pageData.SelectedDetail.TargetAreas)
	}
}

func TestGetUpstreamTrackingPageDataKeepsContextsForHistoricalProductRecovery(t *testing.T) {
	db := setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{}

	latestCycle := &model.UpstreamTrackingCycle{
		CycleCode:          "cycle-latest",
		Status:             "completed",
		Summary:            "latest summary",
		RecommendationText: "latest reason",
		AnalysisFinishedAt: 1741000000000,
	}
	historicalCycle := &model.UpstreamTrackingCycle{
		CycleCode:          "cycle-history-detail",
		Status:             "completed",
		Summary:            "historical summary",
		RecommendationText: "historical reason",
		AnalysisFinishedAt: 1740000000000,
	}
	if err := db.Create(historicalCycle).Error; err != nil {
		t.Fatalf("failed to create historical cycle: %v", err)
	}
	if err := db.Create(latestCycle).Error; err != nil {
		t.Fatalf("failed to create latest cycle: %v", err)
	}

	historicalContext := &model.UpstreamTrackingContext{
		CycleId:     historicalCycle.Id,
		ContextType: "analysis_response",
		Content:     `{"updateSummary":"历史周期产品化摘要","hasSimilarLocalWork":true,"localWorkSummary":"历史周期已做过类似优化","shouldMerge":"observe","mergeReason":"历史周期仅保守观察","mergeStrategy":"observe_only","mergePlanSummary":"历史周期等待后续复核","targetFiles":["web/src/components/upstreamtracking/UpstreamTrackingPage.jsx"],"targetAreas":["web"],"riskSummary":"历史周期 compare 证据不足"}`,
	}
	if err := db.Create(historicalContext).Error; err != nil {
		t.Fatalf("failed to create historical analysis_response: %v", err)
	}

	var contexts []*model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ?", historicalCycle.Id).Order("id asc").Find(&contexts).Error; err != nil {
		t.Fatalf("failed to query historical contexts: %v", err)
	}
	if len(contexts) != 1 || contexts[0].ContextType != "analysis_response" {
		t.Fatalf("expected historical cycle contexts to expose analysis_response, got %#v", contexts)
	}
}

func TestGetUpstreamTrackingCycleDetailReturnsProductFields(t *testing.T) {
	db := setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{}

	cycle := &model.UpstreamTrackingCycle{
		CycleCode:          "cycle-history-detail",
		Status:             "completed",
		Summary:            "historical summary",
		RecommendationText: "historical reason",
		AnalysisFinishedAt: 1740000000000,
		DecisionStatus:     "accepted",
		DecisionNote:       "reviewed",
	}
	if err := db.Create(cycle).Error; err != nil {
		t.Fatalf("failed to create cycle: %v", err)
	}

	action := &model.UpstreamTrackingAction{
		CycleId:        cycle.Id,
		Title:          "sync relay patch",
		Category:       "relay",
		Recommendation: "merge",
		Priority:       "high",
		Status:         "pending",
		TargetArea:     "relay/provider",
		Note:           "watch adapter layer",
	}
	if err := db.Create(action).Error; err != nil {
		t.Fatalf("failed to create action: %v", err)
	}

	analysisResponse := &model.UpstreamTrackingContext{
		CycleId:     cycle.Id,
		ContextType: "analysis_response",
		Content:     `{"updateSummary":"历史周期产品化摘要","hasSimilarLocalWork":true,"localWorkSummary":"历史周期已做过类似优化","shouldMerge":"observe","mergeReason":"历史周期仅保守观察","mergeStrategy":"observe_only","mergePlanSummary":"历史周期等待后续复核","targetFiles":["web/src/components/upstreamtracking/UpstreamTrackingPage.jsx"],"targetAreas":["web"],"riskSummary":"历史周期 compare 证据不足"}`,
	}
	if err := db.Create(analysisResponse).Error; err != nil {
		t.Fatalf("failed to create analysis_response: %v", err)
	}

	compareContext := &model.UpstreamTrackingContext{
		CycleId:      cycle.Id,
		ContextType:  "upstream_compare",
		Content:      "diff summary",
		ContentMeta:  `{"source":"upstream"}`,
	}
	if err := db.Create(compareContext).Error; err != nil {
		t.Fatalf("failed to create compare context: %v", err)
	}

	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Params = gin.Params{{Key: "id", Value: strconv.Itoa(cycle.Id)}}
	ctx.Request = httptest.NewRequest(http.MethodGet, "/api/upstreamtracking/cycles/1/detail", nil)

	GetUpstreamTrackingCycleDetail(ctx)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", recorder.Code)
	}

	var response upstreamTrackingDetailResponse
	if err := common.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("failed to decode detail response: %v", err)
	}
	if !response.Success {
		t.Fatalf("expected success response, got message: %s", response.Message)
	}
	if response.Data.ID != cycle.Id {
		t.Fatalf("expected detail id %d, got %d", cycle.Id, response.Data.ID)
	}
	if response.Data.UpdateSummary != "历史周期产品化摘要" {
		t.Fatalf("expected updateSummary from analysis_response, got %q", response.Data.UpdateSummary)
	}
	if !response.Data.HasSimilarLocalWork {
		t.Fatal("expected hasSimilarLocalWork from analysis_response")
	}
	if response.Data.LocalWorkSummary != "历史周期已做过类似优化" {
		t.Fatalf("expected localWorkSummary from analysis_response, got %q", response.Data.LocalWorkSummary)
	}
	if response.Data.MergePlanSummary != "历史周期等待后续复核" {
		t.Fatalf("expected mergePlanSummary from analysis_response, got %q", response.Data.MergePlanSummary)
	}
	if len(response.Data.TargetFiles) != 1 || response.Data.TargetFiles[0] != "web/src/components/upstreamtracking/UpstreamTrackingPage.jsx" {
		t.Fatalf("expected targetFiles from analysis_response, got %#v", response.Data.TargetFiles)
	}
	if len(response.Data.TargetAreas) != 1 || response.Data.TargetAreas[0] != "web" {
		t.Fatalf("expected targetAreas from analysis_response, got %#v", response.Data.TargetAreas)
	}
	if len(response.Data.Actions) != 1 || response.Data.Actions[0].ID != action.Id {
		t.Fatalf("expected actions in detail response, got %#v", response.Data.Actions)
	}
	if len(response.Data.Contexts) != 2 {
		t.Fatalf("expected contexts in detail response, got %#v", response.Data.Contexts)
	}
}

func TestGetUpstreamTrackingPageDataBuildsConfigView(t *testing.T) {
	setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{
		upstreamTrackingRepoOwnerKey:       "QuantumNous",
		upstreamTrackingRepoNameKey:        "new-api",
		upstreamTrackingBaseBranchKey:      "main",
		upstreamTrackingAnalysisTokenKey:   "secret-token-value",
		"UpstreamTrackingStartVersion":      "v0.12.14",
		"UpstreamTrackingLastSyncedVersion": "v0.12.17",
	}
	common.UpstreamTrackingIntervalDays = 30

	pageData := getUpstreamTrackingPageDataForTest(t)

	if pageData.ConfigView.StartVersion != "v0.12.14" {
		t.Fatalf("expected startVersion %q, got %q", "v0.12.14", pageData.ConfigView.StartVersion)
	}
	if pageData.ConfigView.LastSyncedVersion != "v0.12.17" {
		t.Fatalf("expected lastSyncedVersion %q, got %q", "v0.12.17", pageData.ConfigView.LastSyncedVersion)
	}
	if pageData.ConfigView.IntervalDays != 30 {
		t.Fatalf("expected intervalDays %d, got %d", 30, pageData.ConfigView.IntervalDays)
	}
	if !pageData.ConfigView.Configured {
		t.Fatal("expected configured to be true")
	}
	if pageData.ConfigView.RepoOwner != "QuantumNous" {
		t.Fatalf("expected repoOwner %q, got %q", "QuantumNous", pageData.ConfigView.RepoOwner)
	}
	if pageData.ConfigView.RepoName != "new-api" {
		t.Fatalf("expected repoName %q, got %q", "new-api", pageData.ConfigView.RepoName)
	}
	if pageData.ConfigView.BaseBranch != "main" {
		t.Fatalf("expected baseBranch %q, got %q", "main", pageData.ConfigView.BaseBranch)
	}
	if pageData.ConfigView.Repo != "QuantumNous/new-api" {
		t.Fatalf("expected repo %q, got %q", "QuantumNous/new-api", pageData.ConfigView.Repo)
	}
	if pageData.ConfigView.MaskedToken != "secret-...alue" {
		t.Fatalf("expected maskedToken %q, got %q", "secret-...alue", pageData.ConfigView.MaskedToken)
	}
}

func getUpstreamTrackingPageDataForTest(t *testing.T) upstreamTrackingPageResponse {
	t.Helper()

	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/api/upstreamtracking/page", nil)

	GetUpstreamTrackingPageData(ctx)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", recorder.Code)
	}

	var response upstreamTrackingPageAPIResponse
	if err := common.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("failed to decode api response: %v", err)
	}
	if !response.Success {
		t.Fatalf("expected success response, got message: %s", response.Message)
	}

	var pageData upstreamTrackingPageResponse
	if err := common.Unmarshal(response.Data, &pageData); err != nil {
		t.Fatalf("failed to decode page response: %v", err)
	}

	return pageData
}

func TestUpdateUpstreamTrackingConfigOnlyUpdatesProvidedFields(t *testing.T) {
	setupUpstreamTrackingControllerTestDB(t)
	common.OptionMap = map[string]string{
		upstreamTrackingRepoOwnerKey:     "QuantumNous",
		upstreamTrackingRepoNameKey:      "new-api",
		upstreamTrackingBaseBranchKey:    "main",
		upstreamTrackingProviderKey:      "deepseek",
		upstreamTrackingModelKey:         "deepseek-chat",
		upstreamTrackingBaseURLKey:       "https://api.example.com",
		upstreamTrackingAnalysisTokenKey: "existing-secret-token",
		upstreamTrackingEnabledKey:       "true",
		"UpstreamTrackingStartVersion":    "v0.12.14",
		"UpstreamTrackingLastSyncedVersion": "v0.12.15",
		upstreamTrackingScheduleModeKey:  "manual",
		upstreamTrackingAnalysisScopeKey: "commits-memory-code",
	}
	common.UpstreamTrackingIntervalDays = 9

	body := bytes.NewBufferString(`{"repoOwner":"AiLinkDog"}`)
	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest(http.MethodPut, "/api/upstreamtracking/config", body)
	ctx.Request.Header.Set("Content-Type", "application/json")

	UpdateUpstreamTrackingConfig(ctx)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", recorder.Code)
	}
	if got := getOptionValue(upstreamTrackingRepoOwnerKey); got != "AiLinkDog" {
		t.Fatalf("expected repo owner updated to %q, got %q", "AiLinkDog", got)
	}
	if got := getOptionValue(upstreamTrackingRepoNameKey); got != "new-api" {
		t.Fatalf("expected repo name to remain %q, got %q", "new-api", got)
	}
	if got := getOptionValue(upstreamTrackingAnalysisTokenKey); got != "existing-secret-token" {
		t.Fatalf("expected analysis token to remain unchanged, got %q", got)
	}
	if common.UpstreamTrackingIntervalDays != 9 {
		t.Fatalf("expected interval days to remain %d, got %d", 9, common.UpstreamTrackingIntervalDays)
	}

	var response upstreamTrackingConfigAPIResponse
	if err := common.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("failed to decode config response: %v", err)
	}
	if !response.Success {
		t.Fatalf("expected success response, got message: %s", response.Message)
	}
	if response.Data.MaskedToken != "existin...oken" {
		t.Fatalf("expected masked token %q, got %q", "existin...oken", response.Data.MaskedToken)
	}
}
