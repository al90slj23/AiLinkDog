package service

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type upstreamTrackingRoundTripperFunc func(req *http.Request) (*http.Response, error)

func (f upstreamTrackingRoundTripperFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}

func setupUpstreamTrackingServiceTestDB(t *testing.T) *gorm.DB {
	t.Helper()

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

	if err := db.AutoMigrate(&model.Option{}, &model.UpstreamTrackingCycle{}, &model.UpstreamTrackingContext{}, &model.UpstreamTrackingAction{}); err != nil {
		t.Fatalf("failed to migrate upstream tracking tables: %v", err)
	}

	t.Cleanup(func() {
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	})

	return db
}

func setUpstreamTrackingTestHTTPClient(t *testing.T, handler upstreamTrackingRoundTripperFunc) {
	t.Helper()
	previousClient := httpClient
	httpClient = &http.Client{Transport: handler}
	t.Cleanup(func() {
		httpClient = previousClient
	})
}

func seedUpstreamTrackingCycle(t *testing.T, db *gorm.DB) *model.UpstreamTrackingCycle {
	t.Helper()
	cycle := &model.UpstreamTrackingCycle{
		CycleCode:        "cycle-test-1",
		Status:           "pending",
		RepoOwner:        "QuantumNous",
		RepoName:         "new-api",
		BaseBranch:       "main",
		AldBaseVersion:   "v0.12.14",
		AnalysisProvider: "deepseek",
		AnalysisModel:    "deepseek-chat",
	}
	if err := db.Create(cycle).Error; err != nil {
		t.Fatalf("failed to create cycle: %v", err)
	}
	return cycle
}

func setUpstreamTrackingTestOptions(t *testing.T) {
	t.Helper()
	previousOptions := common.OptionMap
	common.OptionMapRWMutex.Lock()
	common.OptionMap = map[string]string{
		"UpstreamTrackingBaseUrl":       "https://deepseek.example.com",
		"UpstreamTrackingAnalysisToken": "test-token",
	}
	common.OptionMapRWMutex.Unlock()
	t.Cleanup(func() {
		common.OptionMapRWMutex.Lock()
		common.OptionMap = previousOptions
		common.OptionMapRWMutex.Unlock()
	})
}

func newUpstreamTrackingJSONResponse(statusCode int, body string) *http.Response {
	return &http.Response{
		StatusCode: statusCode,
		Header:     make(http.Header),
		Body:       io.NopCloser(strings.NewReader(body)),
	}
}

func TestRunUpstreamTrackingAnalysisBuildsProductResult(t *testing.T) {
	db := setupUpstreamTrackingServiceTestDB(t)
	setUpstreamTrackingTestOptions(t)
	cycle := seedUpstreamTrackingCycle(t, db)
	expectedComparePath := "/repos/QuantumNous/new-api/compare/oldest789...latest123"

	setUpstreamTrackingTestHTTPClient(t, func(req *http.Request) (*http.Response, error) {
		switch {
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/commits"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `[{"sha":"latest123","html_url":"https://github.com/QuantumNous/new-api/commit/latest123","commit":{"message":"feat: upstream update","author":{"name":"bot","date":"2026-04-24T00:00:00Z"}}},{"sha":"mid456","html_url":"https://github.com/QuantumNous/new-api/commit/mid456","commit":{"message":"refactor: middle change","author":{"name":"bot","date":"2026-04-23T00:00:00Z"}}},{"sha":"oldest789","html_url":"https://github.com/QuantumNous/new-api/commit/oldest789","commit":{"message":"fix: baseline bug","author":{"name":"bot","date":"2026-04-22T00:00:00Z"}}}]`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/compare/"):
			if req.URL.Path != expectedComparePath {
				return nil, fmt.Errorf("unexpected compare path: %s", req.URL.Path)
			}
			return newUpstreamTrackingJSONResponse(http.StatusOK, `{"files":[{"filename":"service/upstream_tracking_service.go","status":"modified","patch":"@@ -1 +1 @@"}]}`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "raw.githubusercontent.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, "memory snippet from remote"), nil
		case req.Method == http.MethodPost && strings.Contains(req.URL.Host, "deepseek.example.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `{"choices":[{"message":{"content":"{\"update_summary\":\"上游修复了同步策略\",\"has_similar_local_work\":true,\"local_work_summary\":\"本地已有接近的治理逻辑\",\"should_merge\":\"merge\",\"merge_reason\":\"修复与当前维护目标一致\",\"merge_strategy\":\"cherry_pick\",\"merge_plan_summary\":\"先同步服务层，再验证路由\",\"target_files\":[\"service/upstream_tracking_service.go\",\"controller/upstream_tracking.go\"],\"target_areas\":[\"service\",\"controller\"],\"risk_summary\":\"需要核对字段兼容性\",\"actions\":[{\"title\":\"同步服务层\",\"category\":\"backend\",\"recommendation\":\"apply\",\"priority\":\"high\",\"status\":\"pending\",\"target_area\":\"service\",\"note\":\"先做字段归一化\"}]}"}}]}`), nil
		default:
			return nil, fmt.Errorf("unexpected request: %s %s", req.Method, req.URL.String())
		}
	})

	updatedCycle, err := RunUpstreamTrackingAnalysis(context.Background(), cycle.Id)
	if err != nil {
		t.Fatalf("expected analysis to succeed, got error: %v", err)
	}
	if updatedCycle.Status != "completed" {
		t.Fatalf("expected cycle status completed, got %q", updatedCycle.Status)
	}
	if updatedCycle.Summary != "上游修复了同步策略" {
		t.Fatalf("expected cycle summary to use product update summary, got %q", updatedCycle.Summary)
	}
	if updatedCycle.RecommendationLevel != "merge" {
		t.Fatalf("expected normalized recommendation level %q, got %q", "merge", updatedCycle.RecommendationLevel)
	}
	if updatedCycle.RecommendationText != "修复与当前维护目标一致" {
		t.Fatalf("expected recommendation text to use merge reason, got %q", updatedCycle.RecommendationText)
	}
	if updatedCycle.RiskSummary != "需要核对字段兼容性" {
		t.Fatalf("expected cycle risk summary %q, got %q", "需要核对字段兼容性", updatedCycle.RiskSummary)
	}

	var analysisResponse model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "analysis_response").First(&analysisResponse).Error; err != nil {
		t.Fatalf("expected analysis_response context, got error: %v", err)
	}
	for _, expected := range []string{
		`"updateSummary":"上游修复了同步策略"`,
		`"hasSimilarLocalWork":true`,
		`"localWorkSummary":"本地已有接近的治理逻辑"`,
		`"shouldMerge":"merge"`,
		`"mergeReason":"修复与当前维护目标一致"`,
		`"mergeStrategy":"cherry_pick"`,
		`"mergePlanSummary":"先同步服务层，再验证路由"`,
		`"targetFiles":["service/upstream_tracking_service.go","controller/upstream_tracking.go"]`,
		`"targetAreas":["service","controller"]`,
		`"riskSummary":"需要核对字段兼容性"`,
	} {
		if !strings.Contains(analysisResponse.Content, expected) {
			t.Fatalf("expected analysis_response to contain %s, got %s", expected, analysisResponse.Content)
		}
	}
}

func TestRunUpstreamTrackingAnalysisFallsBackWhenMemoryFetchFails(t *testing.T) {
	db := setupUpstreamTrackingServiceTestDB(t)
	setUpstreamTrackingTestOptions(t)
	cycle := seedUpstreamTrackingCycle(t, db)
	previousMemoryPaths := upstreamTrackingMemoryPaths
	previousMemoryBaseDirs := upstreamTrackingLocalMemoryBaseDirs
	upstreamTrackingMemoryPaths = []string{".ai/L1#Overview/guide.md"}
	t.Cleanup(func() {
		upstreamTrackingMemoryPaths = previousMemoryPaths
		upstreamTrackingLocalMemoryBaseDirs = previousMemoryBaseDirs
	})
	upstreamTrackingLocalMemoryBaseDirs = []string{".", "..", filepath.Join("..", ".."), "/Volumes/RuiRui4TB/CloudBackup/Mac/code/github/al90slj23/AiLinkDog"}
	if _, err := os.ReadFile(filepath.Join("/Volumes/RuiRui4TB/CloudBackup/Mac/code/github/al90slj23/AiLinkDog", ".ai", "L1#Overview", "guide.md")); err != nil {
		t.Fatalf("failed to read local memory fixture: %v", err)
	}
	compareCalled := false

	setUpstreamTrackingTestHTTPClient(t, func(req *http.Request) (*http.Response, error) {
		switch {
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/commits"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `[{"sha":"abc123","html_url":"https://github.com/QuantumNous/new-api/commit/abc123","commit":{"message":"fix: upstream patch","author":{"name":"bot","date":"2026-04-24T00:00:00Z"}}}]`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/compare/"):
			compareCalled = true
			return newUpstreamTrackingJSONResponse(http.StatusInternalServerError, `{"message":"compare unavailable"}`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "raw.githubusercontent.com"):
			return newUpstreamTrackingJSONResponse(http.StatusNotFound, `not found`), nil
		case req.Method == http.MethodPost && strings.Contains(req.URL.Host, "deepseek.example.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `{"choices":[{"message":{"content":"{\"update_summary\":\"上游补丁可继续观察\",\"should_merge\":\"observe\",\"merge_reason\":\"远程记忆不完整，先保守观察\",\"merge_strategy\":\"observe_only\",\"risk_summary\":\"compare 与远程记忆抓取失败\"}"}}]}`), nil
		default:
			return nil, fmt.Errorf("unexpected request: %s %s", req.Method, req.URL.String())
		}
	})

	updatedCycle, err := RunUpstreamTrackingAnalysis(context.Background(), cycle.Id)
	if err != nil {
		t.Fatalf("expected analysis to continue with fallback, got error: %v", err)
	}
	if updatedCycle.Status != "completed" {
		t.Fatalf("expected cycle status completed, got %q", updatedCycle.Status)
	}
	if compareCalled {
		t.Fatal("expected single-commit analysis to skip compare request")
	}
	if !strings.Contains(updatedCycle.RiskSummary, "compare skipped: insufficient commit range") {
		t.Fatalf("expected risk summary to record skipped compare, got %q", updatedCycle.RiskSummary)
	}

	var memoryContext model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "ald_memory_context").First(&memoryContext).Error; err != nil {
		t.Fatalf("expected ald_memory_context to persist, got error: %v", err)
	}
	guidePrefix := "# AiLinkDog 项目概览"
	if !strings.Contains(memoryContext.Content, guidePrefix) {
		t.Fatalf("expected fallback memory context to include local guide snippet %q, got %s", guidePrefix, memoryContext.Content)
	}
	if !strings.Contains(updatedCycle.RiskSummary, "remote memory fetch failed") {
		t.Fatalf("expected risk summary to keep degradation marker, got %q", updatedCycle.RiskSummary)
	}
}

func TestRunUpstreamTrackingAnalysisNormalizesMissingFields(t *testing.T) {
	db := setupUpstreamTrackingServiceTestDB(t)
	setUpstreamTrackingTestOptions(t)
	cycle := seedUpstreamTrackingCycle(t, db)
	expectedComparePath := "/repos/QuantumNous/new-api/compare/base222...head111"

	setUpstreamTrackingTestHTTPClient(t, func(req *http.Request) (*http.Response, error) {
		switch {
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/commits"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `[{"sha":"head111","html_url":"https://github.com/QuantumNous/new-api/commit/head111","commit":{"message":"chore: docs","author":{"name":"bot","date":"2026-04-24T00:00:00Z"}}},{"sha":"base222","html_url":"https://github.com/QuantumNous/new-api/commit/base222","commit":{"message":"docs: prior","author":{"name":"bot","date":"2026-04-23T00:00:00Z"}}}]`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/compare/"):
			if req.URL.Path != expectedComparePath {
				return nil, fmt.Errorf("unexpected compare path: %s", req.URL.Path)
			}
			return newUpstreamTrackingJSONResponse(http.StatusOK, `{"files":[]}`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "raw.githubusercontent.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, "memory snippet from remote"), nil
		case req.Method == http.MethodPost && strings.Contains(req.URL.Host, "deepseek.example.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `{"choices":[{"message":{"content":"{\"summary\":\"旧模型只给了摘要\",\"recommendation_level\":\"maybe\",\"recommendation_text\":\"先看一轮\",\"actions\":[{\"title\":\"观察\",\"target_area\":\"docs\"}]}"}}]}`), nil
		default:
			return nil, fmt.Errorf("unexpected request: %s %s", req.Method, req.URL.String())
		}
	})

	updatedCycle, err := RunUpstreamTrackingAnalysis(context.Background(), cycle.Id)
	if err != nil {
		t.Fatalf("expected analysis to succeed, got error: %v", err)
	}
	if updatedCycle.Status != "completed" {
		t.Fatalf("expected cycle status completed, got %q", updatedCycle.Status)
	}

	var analysisResponse model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "analysis_response").First(&analysisResponse).Error; err != nil {
		t.Fatalf("expected analysis_response context, got error: %v", err)
	}
	for _, expected := range []string{
		`"updateSummary":"旧模型只给了摘要"`,
		`"hasSimilarLocalWork":false`,
		`"localWorkSummary":""`,
		`"shouldMerge":"observe"`,
		`"mergeStrategy":"observe_only"`,
		`"mergePlanSummary":""`,
		`"targetFiles":[]`,
		`"targetAreas":["docs"]`,
		`"riskSummary":""`,
	} {
		if !strings.Contains(analysisResponse.Content, expected) {
			t.Fatalf("expected normalized analysis_response to contain %s, got %s", expected, analysisResponse.Content)
		}
	}
	if updatedCycle.RecommendationLevel != "observe" {
		t.Fatalf("expected normalized recommendation level %q, got %q", "observe", updatedCycle.RecommendationLevel)
	}
}

func TestRunUpstreamTrackingAnalysisPersistsFailureRecordWhenModelAnalysisFails(t *testing.T) {
	db := setupUpstreamTrackingServiceTestDB(t)
	setUpstreamTrackingTestOptions(t)
	cycle := seedUpstreamTrackingCycle(t, db)

	setUpstreamTrackingTestHTTPClient(t, func(req *http.Request) (*http.Response, error) {
		switch {
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/commits"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `[{"sha":"head111","html_url":"https://github.com/QuantumNous/new-api/commit/head111","commit":{"message":"feat: upstream update","author":{"name":"bot","date":"2026-04-24T00:00:00Z"}}},{"sha":"base222","html_url":"https://github.com/QuantumNous/new-api/commit/base222","commit":{"message":"fix: previous baseline","author":{"name":"bot","date":"2026-04-23T00:00:00Z"}}}]`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/compare/"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `{"files":[{"filename":"controller/upstream_tracking.go","status":"modified"}]}`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "raw.githubusercontent.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, "memory snippet from remote"), nil
		case req.Method == http.MethodPost && strings.Contains(req.URL.Host, "deepseek.example.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `{"choices":[{"message":{"content":"not-json-response"}}]}`), nil
		default:
			return nil, fmt.Errorf("unexpected request: %s %s", req.Method, req.URL.String())
		}
	})

	updatedCycle, err := RunUpstreamTrackingAnalysis(context.Background(), cycle.Id)
	if err == nil {
		t.Fatal("expected analysis error to be returned")
	}
	if updatedCycle == nil {
		t.Fatal("expected failed cycle record to be returned")
	}
	if updatedCycle.Status != "failed" {
		t.Fatalf("expected cycle status failed, got %q", updatedCycle.Status)
	}
	if !strings.Contains(updatedCycle.Summary, "分析失败") {
		t.Fatalf("expected failure summary to be productized, got %q", updatedCycle.Summary)
	}
	if !strings.Contains(updatedCycle.RiskSummary, "分析输出解析失败") {
		t.Fatalf("expected risk summary to include analysis failure marker, got %q", updatedCycle.RiskSummary)
	}

	var analysisResponse model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "analysis_response").First(&analysisResponse).Error; err != nil {
		t.Fatalf("expected failed analysis_response context, got error: %v", err)
	}
	for _, expected := range []string{
		`"updateSummary":"分析失败：未能生成有效评估结果"`,
		`"shouldMerge":"observe"`,
		`"mergeStrategy":"observe_only"`,
		`"riskSummary":"分析输出解析失败`,
	} {
		if !strings.Contains(analysisResponse.Content, expected) {
			t.Fatalf("expected failure analysis_response to contain %s, got %s", expected, analysisResponse.Content)
		}
	}
	var promptContext model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "analysis_prompt").First(&promptContext).Error; err != nil {
		t.Fatalf("expected analysis_prompt context to persist before failure, got error: %v", err)
	}
}

func TestRunUpstreamTrackingAnalysisKeepsCompareFailureInCompletedRecord(t *testing.T) {
	db := setupUpstreamTrackingServiceTestDB(t)
	setUpstreamTrackingTestOptions(t)
	cycle := seedUpstreamTrackingCycle(t, db)
	expectedComparePath := "/repos/QuantumNous/new-api/compare/base222...head111"
	compareCalled := false

	setUpstreamTrackingTestHTTPClient(t, func(req *http.Request) (*http.Response, error) {
		switch {
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/commits"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `[{"sha":"head111","html_url":"https://github.com/QuantumNous/new-api/commit/head111","commit":{"message":"feat: upstream patch","author":{"name":"bot","date":"2026-04-24T00:00:00Z"}}},{"sha":"base222","html_url":"https://github.com/QuantumNous/new-api/commit/base222","commit":{"message":"fix: prior baseline","author":{"name":"bot","date":"2026-04-23T00:00:00Z"}}}]`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "api.github.com") && strings.Contains(req.URL.Path, "/compare/"):
			compareCalled = true
			if req.URL.Path != expectedComparePath {
				return nil, fmt.Errorf("unexpected compare path: %s", req.URL.Path)
			}
			return newUpstreamTrackingJSONResponse(http.StatusInternalServerError, `{"message":"compare unavailable"}`), nil
		case req.Method == http.MethodGet && strings.Contains(req.URL.Host, "raw.githubusercontent.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, "memory snippet from remote"), nil
		case req.Method == http.MethodPost && strings.Contains(req.URL.Host, "deepseek.example.com"):
			return newUpstreamTrackingJSONResponse(http.StatusOK, `{"choices":[{"message":{"content":"{\"update_summary\":\"compare 失败时仍完成评估\",\"has_similar_local_work\":false,\"local_work_summary\":\"暂无明显重复优化\",\"should_merge\":\"observe\",\"merge_reason\":\"缺少 compare 证据，先保守观察\",\"merge_strategy\":\"observe_only\",\"merge_plan_summary\":\"等待 compare 恢复后复核\",\"target_files\":[\"controller/upstream_tracking.go\"],\"target_areas\":[\"controller\"],\"risk_summary\":\"基于提交记录保守判断\"}"}}]}`), nil
		default:
			return nil, fmt.Errorf("unexpected request: %s %s", req.Method, req.URL.String())
		}
	})

	updatedCycle, err := RunUpstreamTrackingAnalysis(context.Background(), cycle.Id)
	if err != nil {
		t.Fatalf("expected analysis to continue when compare fails, got error: %v", err)
	}
	if !compareCalled {
		t.Fatal("expected compare request to be attempted")
	}
	if updatedCycle.Status != "completed" {
		t.Fatalf("expected cycle status completed, got %q", updatedCycle.Status)
	}
	if !strings.Contains(updatedCycle.RiskSummary, "compare fetch failed") {
		t.Fatalf("expected cycle risk summary to retain compare failure, got %q", updatedCycle.RiskSummary)
	}

	var analysisResponse model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "analysis_response").First(&analysisResponse).Error; err != nil {
		t.Fatalf("expected analysis_response context, got error: %v", err)
	}
	for _, expected := range []string{
		`"updateSummary":"compare 失败时仍完成评估"`,
		`"mergePlanSummary":"等待 compare 恢复后复核"`,
		`"targetFiles":["controller/upstream_tracking.go"]`,
		`"targetAreas":["controller"]`,
		`compare fetch failed`,
	} {
		if !strings.Contains(analysisResponse.Content, expected) {
			t.Fatalf("expected compare failure analysis_response to contain %s, got %s", expected, analysisResponse.Content)
		}
	}

	var compareContext model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "upstream_compare").First(&compareContext).Error; err != nil {
		t.Fatalf("expected upstream_compare context, got error: %v", err)
	}
	if compareContext.Content != "" {
		t.Fatalf("expected upstream_compare content to stay empty on compare failure, got %q", compareContext.Content)
	}
}

func TestRunUpstreamTrackingAnalysisReplacesExistingContextsOnRerun(t *testing.T) {
	db := setupUpstreamTrackingServiceTestDB(t)
	originalGitHubBase := upstreamTrackingGitHubAPIBaseURL
	originalGitHubRawBase := upstreamTrackingGitHubRawBaseURL
	originalDeepSeekBase := upstreamTrackingDeepSeekAPIBaseURL
	originalLocalMemoryDirs := upstreamTrackingLocalMemoryBaseDirs
	defer func() {
		upstreamTrackingGitHubAPIBaseURL = originalGitHubBase
		upstreamTrackingGitHubRawBaseURL = originalGitHubRawBase
		upstreamTrackingDeepSeekAPIBaseURL = originalDeepSeekBase
		upstreamTrackingLocalMemoryBaseDirs = originalLocalMemoryDirs
	}()

	var deepSeekResponses int
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case strings.Contains(r.URL.Path, "/commits"):
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`[
				{"sha":"latest111","html_url":"https://example.com/1","commit":{"message":"latest commit","author":{"name":"bot","date":"2026-04-24T00:00:00Z"}}},
				{"sha":"base222","html_url":"https://example.com/2","commit":{"message":"base commit","author":{"name":"bot","date":"2026-04-23T00:00:00Z"}}}
			]`))
		case strings.Contains(r.URL.Path, "/compare/"):
			w.Header().Set("Content-Type", "application/json")
			_, _ = w.Write([]byte(`{"files":[{"filename":"service/upstream_tracking_service.go","status":"modified","patch":"+ new patch"}]}`))
		case strings.Contains(r.URL.Path, "/chat/completions"):
			deepSeekResponses++
			w.Header().Set("Content-Type", "application/json")
			if deepSeekResponses == 1 {
				_, _ = w.Write([]byte(`{"choices":[{"message":{"content":"{\"update_summary\":\"first summary\",\"has_similar_local_work\":false,\"local_work_summary\":\"\",\"should_merge\":\"observe\",\"merge_reason\":\"first reason\",\"merge_strategy\":\"observe_only\",\"merge_plan_summary\":\"first plan\",\"target_files\":[\"first.go\"],\"target_areas\":[\"first\"],\"risk_summary\":\"first risk\",\"actions\":[]}"}}]}`))
			} else {
				_, _ = w.Write([]byte(`{"choices":[{"message":{"content":"{\"update_summary\":\"second summary\",\"has_similar_local_work\":true,\"local_work_summary\":\"second local\",\"should_merge\":\"merge\",\"merge_reason\":\"second reason\",\"merge_strategy\":\"manual_port\",\"merge_plan_summary\":\"second plan\",\"target_files\":[\"second.go\"],\"target_areas\":[\"second\"],\"risk_summary\":\"second risk\",\"actions\":[]}"}}]}`))
			}
		default:
			w.Header().Set("Content-Type", "text/plain")
			_, _ = w.Write([]byte("# memory"))
		}
	}))
	defer server.Close()

	upstreamTrackingGitHubAPIBaseURL = server.URL
	upstreamTrackingGitHubRawBaseURL = server.URL
	upstreamTrackingDeepSeekAPIBaseURL = server.URL
	upstreamTrackingLocalMemoryBaseDirs = []string{t.TempDir()}
	common.OptionMap = map[string]string{
		"UpstreamTrackingBaseUrl":       server.URL,
		"UpstreamTrackingAnalysisToken": "sk-test",
	}

	cycle := &model.UpstreamTrackingCycle{
		CycleCode:        "cycle-rerun",
		Status:           "pending",
		RepoOwner:        "QuantumNous",
		RepoName:         "new-api",
		BaseBranch:       "main",
		AldBaseVersion:   "v0.12.14",
		AnalysisProvider: "deepseek",
		AnalysisModel:    "deepseek-chat",
	}
	if err := db.Create(cycle).Error; err != nil {
		t.Fatalf("failed to create cycle: %v", err)
	}

	if _, err := RunUpstreamTrackingAnalysis(context.Background(), cycle.Id); err != nil {
		t.Fatalf("first analysis failed: %v", err)
	}
	if _, err := RunUpstreamTrackingAnalysis(context.Background(), cycle.Id); err != nil {
		t.Fatalf("second analysis failed: %v", err)
	}

	var responseContexts []model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "analysis_response").Order("id asc").Find(&responseContexts).Error; err != nil {
		t.Fatalf("failed to query analysis_response contexts: %v", err)
	}
	if len(responseContexts) != 1 {
		t.Fatalf("expected exactly one analysis_response after rerun, got %d", len(responseContexts))
	}
	if !strings.Contains(responseContexts[0].Content, "second summary") {
		t.Fatalf("expected latest analysis_response content, got %s", responseContexts[0].Content)
	}

	var compareContexts []model.UpstreamTrackingContext
	if err := db.Where("cycle_id = ? AND context_type = ?", cycle.Id, "upstream_compare").Find(&compareContexts).Error; err != nil {
		t.Fatalf("failed to query upstream_compare contexts: %v", err)
	}
	if len(compareContexts) != 1 {
		t.Fatalf("expected exactly one upstream_compare after rerun, got %d", len(compareContexts))
	}
}
