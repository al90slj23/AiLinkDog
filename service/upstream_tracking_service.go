package service

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
)

var upstreamTrackingGitHubAPIBaseURL = "https://api.github.com"
var upstreamTrackingGitHubRawBaseURL = "https://raw.githubusercontent.com"
var upstreamTrackingDeepSeekAPIBaseURL = ""
var upstreamTrackingLocalMemoryBaseDirs = []string{".", "..", "../.."}

type upstreamTrackingGitHubCommitItem struct {
	SHA     string `json:"sha"`
	HTMLURL string `json:"html_url"`
	Commit  struct {
		Message string `json:"message"`
		Author  struct {
			Name string `json:"name"`
			Date string `json:"date"`
		} `json:"author"`
	} `json:"commit"`
}

type upstreamTrackingGitHubCompareResponse struct {
	Files []struct {
		Filename string `json:"filename"`
		Status   string `json:"status"`
		Patch    string `json:"patch"`
	} `json:"files"`
}

type upstreamTrackingDeepSeekRequest struct {
	Model    string                          `json:"model"`
	Messages []upstreamTrackingDeepSeekMessage `json:"messages"`
}

type upstreamTrackingDeepSeekMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type upstreamTrackingDeepSeekResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

type UpstreamTrackingAnalysisResult struct {
	Summary             string                               `json:"summary"`
	RecommendationLevel string                               `json:"recommendation_level"`
	RecommendationText  string                               `json:"recommendation_text"`
	RiskSummary         string                               `json:"riskSummary"`
	UpdateSummary       string                               `json:"updateSummary"`
	HasSimilarLocalWork bool                                 `json:"hasSimilarLocalWork"`
	LocalWorkSummary    string                               `json:"localWorkSummary"`
	ShouldMerge         string                               `json:"shouldMerge"`
	MergeReason         string                               `json:"mergeReason"`
	MergeStrategy       string                               `json:"mergeStrategy"`
	MergePlanSummary    string                               `json:"mergePlanSummary"`
	TargetFiles         []string                             `json:"targetFiles"`
	TargetAreas         []string                             `json:"targetAreas"`
	Actions             []UpstreamTrackingAnalysisActionItem `json:"actions"`
}

type upstreamTrackingAnalysisRawResult struct {
	Summary             string                               `json:"summary"`
	RecommendationLevel string                               `json:"recommendation_level"`
	RecommendationText  string                               `json:"recommendation_text"`
	RiskSummary         string                               `json:"risk_summary"`
	UpdateSummary       string                               `json:"update_summary"`
	HasSimilarLocalWork *bool                                `json:"has_similar_local_work"`
	LocalWorkSummary    string                               `json:"local_work_summary"`
	ShouldMerge         string                               `json:"should_merge"`
	MergeReason         string                               `json:"merge_reason"`
	MergeStrategy       string                               `json:"merge_strategy"`
	MergePlanSummary    string                               `json:"merge_plan_summary"`
	TargetFilesRaw      any                                  `json:"target_files"`
	TargetAreasRaw      any                                  `json:"target_areas"`
	Actions             []UpstreamTrackingAnalysisActionItem `json:"actions"`
}

type UpstreamTrackingAnalysisActionItem struct {
	Title          string `json:"title"`
	Category       string `json:"category"`
	Recommendation string `json:"recommendation"`
	Priority       string `json:"priority"`
	Status         string `json:"status"`
	TargetArea     string `json:"target_area"`
	Note           string `json:"note"`
}

type upstreamTrackingMemorySnippet struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

func upstreamTrackingBoolPtr(value bool) *bool {
	return &value
}

var upstreamTrackingMemoryPaths = []string{
	".ai/L1#Overview/guide.md",
	".ai/L2#Index/toc.md",
	".ai/L3#Standards/standards/04.quality-06.page.md",
	".ai/L3#Standards/standards/02.backend-07.api.md",
	".ai/L5#Knowledge/upstream-tracking.md",
}

func getUpstreamTrackingOption(key string) string {
	common.OptionMapRWMutex.RLock()
	defer common.OptionMapRWMutex.RUnlock()
	return strings.TrimSpace(common.OptionMap[key])
}

func buildUpstreamTrackingGitHubURL(owner string, repo string, branch string) string {
	return fmt.Sprintf("%s/repos/%s/%s/commits?per_page=10&sha=%s", strings.TrimRight(upstreamTrackingGitHubAPIBaseURL, "/"), owner, repo, branch)
}

func buildUpstreamTrackingCompareURL(owner string, repo string, base string, head string) string {
	return fmt.Sprintf("%s/repos/%s/%s/compare/%s...%s", strings.TrimRight(upstreamTrackingGitHubAPIBaseURL, "/"), owner, repo, base, head)
}

func resolveUpstreamTrackingCompareRange(commits []upstreamTrackingGitHubCommitItem) (string, string, bool) {
	if len(commits) < 2 {
		return "", "", false
	}
	head := strings.TrimSpace(commits[0].SHA)
	base := strings.TrimSpace(commits[len(commits)-1].SHA)
	if head == "" || base == "" || head == base {
		return "", "", false
	}
	return base, head, true
}

func buildUpstreamTrackingGitHubRawURL(owner string, repo string, branch string, filePath string) string {
	escapedPath := strings.ReplaceAll(filePath, "#", "%23")
	return fmt.Sprintf("%s/%s/%s/%s/%s", strings.TrimRight(upstreamTrackingGitHubRawBaseURL, "/"), owner, repo, branch, escapedPath)
}

func buildUpstreamTrackingDeepSeekURL(baseURL string) string {
	resolvedBaseURL := strings.TrimSpace(baseURL)
	if resolvedBaseURL == "" {
		resolvedBaseURL = strings.TrimSpace(upstreamTrackingDeepSeekAPIBaseURL)
	}
	if resolvedBaseURL == "" {
		resolvedBaseURL = "https://api.deepseek.com"
	}
	return strings.TrimRight(resolvedBaseURL, "/") + "/chat/completions"
}

func fetchUpstreamTrackingCommits(ctx context.Context, owner string, repo string, branch string) ([]upstreamTrackingGitHubCommitItem, error) {
	url := buildUpstreamTrackingGitHubURL(owner, repo, branch)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "AiLinkDog-UpstreamTracking")
	client := GetHttpClient()
	if client == nil {
		client = http.DefaultClient
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= http.StatusBadRequest {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("github commits request failed: %d %s", resp.StatusCode, common.MaskSensitiveInfo(string(body)))
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var commits []upstreamTrackingGitHubCommitItem
	if err := common.Unmarshal(body, &commits); err != nil {
		return nil, err
	}
	return commits, nil
}

func fetchUpstreamTrackingRemoteMemory(ctx context.Context) ([]upstreamTrackingMemorySnippet, error) {
	const memoryOwner = "al90slj23"
	const memoryRepo = "AiLinkDog"
	const memoryBranch = "main"
	client := GetHttpClient()
	if client == nil {
		client = http.DefaultClient
	}
	results := make([]upstreamTrackingMemorySnippet, 0, len(upstreamTrackingMemoryPaths))
	for _, filePath := range upstreamTrackingMemoryPaths {
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, buildUpstreamTrackingGitHubRawURL(memoryOwner, memoryRepo, memoryBranch, filePath), nil)
		if err != nil {
			return nil, err
		}
		req.Header.Set("User-Agent", "AiLinkDog-UpstreamTracking")
		resp, err := client.Do(req)
		if err != nil {
			return nil, err
		}
		body, readErr := io.ReadAll(resp.Body)
		resp.Body.Close()
		if readErr != nil {
			return nil, readErr
		}
		if resp.StatusCode >= http.StatusBadRequest {
			return nil, fmt.Errorf("github raw memory request failed: %d %s", resp.StatusCode, common.MaskSensitiveInfo(string(body)))
		}
		results = append(results, upstreamTrackingMemorySnippet{Path: filePath, Content: strings.TrimSpace(string(body))})
	}
	return results, nil
}

func fetchUpstreamTrackingLocalMemory() ([]upstreamTrackingMemorySnippet, error) {
	results := make([]upstreamTrackingMemorySnippet, 0, len(upstreamTrackingMemoryPaths))
	loadedCount := 0
	for _, filePath := range upstreamTrackingMemoryPaths {
		resolvedPath, err := resolveUpstreamTrackingLocalMemoryPath(filePath)
		if err != nil {
			results = append(results, upstreamTrackingMemorySnippet{Path: filePath, Content: "[missing local memory context]"})
			continue
		}
		body, err := os.ReadFile(resolvedPath)
		if err != nil {
			results = append(results, upstreamTrackingMemorySnippet{Path: filePath, Content: "[missing local memory context]"})
			continue
		}
		loadedCount++
		results = append(results, upstreamTrackingMemorySnippet{Path: filePath, Content: strings.TrimSpace(string(body))})
	}
	if loadedCount == 0 {
		return nil, fmt.Errorf("no local memory snippets available")
	}
	return results, nil
}

func resolveUpstreamTrackingLocalMemoryPath(filePath string) (string, error) {
	for _, baseDir := range upstreamTrackingLocalMemoryBaseDirs {
		candidate := filePath
		if strings.TrimSpace(baseDir) != "" {
			candidate = strings.TrimRight(baseDir, "/") + "/" + filePath
		}
		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}
	}
	return "", fmt.Errorf("local memory file not found: %s", filePath)
}

func loadUpstreamTrackingMemorySnippets(ctx context.Context) ([]upstreamTrackingMemorySnippet, []string) {
	memorySnippets, err := fetchUpstreamTrackingRemoteMemory(ctx)
	if err == nil {
		return memorySnippets, nil
	}
	degradationNotes := []string{fmt.Sprintf("remote memory fetch failed: %s", err.Error())}
	localMemorySnippets, localErr := fetchUpstreamTrackingLocalMemory()
	if localErr == nil {
		degradationNotes = append(degradationNotes, "using local .ai fallback memory")
		return localMemorySnippets, degradationNotes
	}
	degradationNotes = append(degradationNotes, fmt.Sprintf("local memory fallback failed: %s", localErr.Error()))
	placeholders := make([]upstreamTrackingMemorySnippet, 0, len(upstreamTrackingMemoryPaths))
	for _, filePath := range upstreamTrackingMemoryPaths {
		placeholders = append(placeholders, upstreamTrackingMemorySnippet{Path: filePath, Content: "[missing memory context]"})
	}
	return placeholders, degradationNotes
}

func fetchUpstreamTrackingCompare(ctx context.Context, owner string, repo string, base string, head string) (*upstreamTrackingGitHubCompareResponse, error) {
	url := buildUpstreamTrackingCompareURL(owner, repo, base, head)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "AiLinkDog-UpstreamTracking")
	client := GetHttpClient()
	if client == nil {
		client = http.DefaultClient
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode >= http.StatusBadRequest {
		return nil, fmt.Errorf("github compare request failed: %d %s", resp.StatusCode, common.MaskSensitiveInfo(string(body)))
	}
	var compare upstreamTrackingGitHubCompareResponse
	if err := common.Unmarshal(body, &compare); err != nil {
		return nil, err
	}
	return &compare, nil
}

func buildUpstreamTrackingCompareSummary(compare *upstreamTrackingGitHubCompareResponse) string {
	if compare == nil || len(compare.Files) == 0 {
		return ""
	}
	var builder strings.Builder
	builder.WriteString("上游 compare 文件摘要：\n")
	for _, file := range compare.Files {
		builder.WriteString(fmt.Sprintf("- %s | %s\n", file.Filename, file.Status))
		if trimmedPatch := strings.TrimSpace(file.Patch); trimmedPatch != "" {
			builder.WriteString(trimmedPatch)
			builder.WriteString("\n")
		}
	}
	return builder.String()
}

func buildUpstreamTrackingPrompt(cycle *model.UpstreamTrackingCycle, commits []upstreamTrackingGitHubCommitItem, compareSummary string, memorySnippets []upstreamTrackingMemorySnippet) string {
	var builder strings.Builder
	builder.WriteString("你是 AiLinkDog 的上游治理分析助手。请根据以下 new-api 上游提交与当前 ALD 上下文，输出 JSON。\n")
	builder.WriteString("要求：\n")
	builder.WriteString("1. 只输出 JSON。\n")
	builder.WriteString("2. 不能建议直接复制全部代码。\n")
	builder.WriteString("3. 要明确指出建议同步、建议观察、风险点。\n\n")
	builder.WriteString(fmt.Sprintf("上游仓库：%s/%s\n", cycle.RepoOwner, cycle.RepoName))
	builder.WriteString(fmt.Sprintf("基线分支：%s\n", cycle.BaseBranch))
	builder.WriteString(fmt.Sprintf("ALD 当前版本：%s\n", cycle.AldBaseVersion))
	builder.WriteString("最近提交：\n")
	for _, commit := range commits {
		builder.WriteString(fmt.Sprintf("- %s | %s | %s\n", commit.SHA, commit.Commit.Author.Name, strings.TrimSpace(commit.Commit.Message)))
	}
	if strings.TrimSpace(compareSummary) != "" {
		builder.WriteString("\n")
		builder.WriteString(compareSummary)
	}
	if strings.TrimSpace(compareSummary) == "" {
		builder.WriteString("\n上游 compare 摘要：暂无，可结合提交信息与上下文保守判断。\n")
	}
	builder.WriteString("\nALD 远程记忆上下文：\n")
	for _, snippet := range memorySnippets {
		builder.WriteString(fmt.Sprintf("### %s\n%s\n", snippet.Path, snippet.Content))
	}
	builder.WriteString("\nJSON schema:\n")
	builder.WriteString(`{"update_summary":"","has_similar_local_work":false,"local_work_summary":"","should_merge":"observe","merge_reason":"","merge_strategy":"observe_only","merge_plan_summary":"","target_files":[],"target_areas":[],"risk_summary":"","actions":[{"title":"","category":"","recommendation":"","priority":"","status":"pending","target_area":"","note":""}]}`)
	return builder.String()
}

func normalizeUpstreamTrackingDecision(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "merge", "sync", "yes", "true", "recommended", "recommend":
		return "merge"
	case "skip", "ignore", "no", "false":
		return "skip"
	case "review", "observe", "watch", "maybe", "pending", "undecided", "":
		return "observe"
	default:
		return "observe"
	}
}

func normalizeUpstreamTrackingMergeStrategy(value string, shouldMerge string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "cherry_pick", "cherry-pick", "cherrypick":
		return "cherry_pick"
	case "manual_port", "manual-port", "manual":
		return "manual_port"
	case "follow_up", "follow-up", "defer":
		return "follow_up"
	case "observe_only", "observe-only", "observe":
		return "observe_only"
	case "skip":
		return "skip"
	}
	if shouldMerge == "merge" {
		return "manual_port"
	}
	if shouldMerge == "skip" {
		return "skip"
	}
	return "observe_only"
}

func normalizeUpstreamTrackingStringSlice(value any) []string {
	result := make([]string, 0)
	appendItem := func(item string) {
		trimmed := strings.TrimSpace(item)
		if trimmed == "" {
			return
		}
		for _, existing := range result {
			if existing == trimmed {
				return
			}
		}
		result = append(result, trimmed)
	}
	switch typed := value.(type) {
	case []any:
		for _, item := range typed {
			if text, ok := item.(string); ok {
				appendItem(text)
			}
		}
	case []string:
		for _, item := range typed {
			appendItem(item)
		}
	case string:
		for _, item := range strings.Split(typed, ",") {
			appendItem(item)
		}
	}
	return result
}

func normalizeUpstreamTrackingActions(actions []UpstreamTrackingAnalysisActionItem) []UpstreamTrackingAnalysisActionItem {
	normalized := make([]UpstreamTrackingAnalysisActionItem, 0, len(actions))
	for _, item := range actions {
		action := item
		action.Title = strings.TrimSpace(action.Title)
		action.Category = strings.TrimSpace(action.Category)
		action.Recommendation = strings.TrimSpace(action.Recommendation)
		action.Priority = strings.TrimSpace(action.Priority)
		action.Status = strings.TrimSpace(action.Status)
		action.TargetArea = strings.TrimSpace(action.TargetArea)
		action.Note = strings.TrimSpace(action.Note)
		if action.Status == "" {
			action.Status = "pending"
		}
		normalized = append(normalized, action)
	}
	return normalized
}

func normalizeUpstreamTrackingAnalysisResult(raw *upstreamTrackingAnalysisRawResult, degradationNotes []string) *UpstreamTrackingAnalysisResult {
	result := &UpstreamTrackingAnalysisResult{}
	if raw == nil {
		raw = &upstreamTrackingAnalysisRawResult{}
	}
	result.Actions = normalizeUpstreamTrackingActions(raw.Actions)
	result.UpdateSummary = strings.TrimSpace(raw.UpdateSummary)
	if result.UpdateSummary == "" {
		result.UpdateSummary = strings.TrimSpace(raw.Summary)
	}
	result.LocalWorkSummary = strings.TrimSpace(raw.LocalWorkSummary)
	if raw.HasSimilarLocalWork != nil {
		result.HasSimilarLocalWork = *raw.HasSimilarLocalWork
	}
	result.ShouldMerge = normalizeUpstreamTrackingDecision(raw.ShouldMerge)
	if result.ShouldMerge == "observe" {
		result.ShouldMerge = normalizeUpstreamTrackingDecision(raw.RecommendationLevel)
	}
	result.MergeReason = strings.TrimSpace(raw.MergeReason)
	if result.MergeReason == "" {
		result.MergeReason = strings.TrimSpace(raw.RecommendationText)
	}
	result.MergeStrategy = normalizeUpstreamTrackingMergeStrategy(raw.MergeStrategy, result.ShouldMerge)
	result.MergePlanSummary = strings.TrimSpace(raw.MergePlanSummary)
	result.TargetFiles = normalizeUpstreamTrackingStringSlice(raw.TargetFilesRaw)
	result.TargetAreas = normalizeUpstreamTrackingStringSlice(raw.TargetAreasRaw)
	for _, action := range result.Actions {
		if action.TargetArea != "" {
			result.TargetAreas = normalizeUpstreamTrackingStringSlice(append(result.TargetAreas, action.TargetArea))
		}
	}
	result.RiskSummary = strings.TrimSpace(raw.RiskSummary)
	if len(degradationNotes) > 0 {
		degradationText := strings.Join(degradationNotes, "; ")
		if result.RiskSummary == "" {
			result.RiskSummary = degradationText
		} else {
			result.RiskSummary = result.RiskSummary + "; " + degradationText
		}
	}
	result.Summary = result.UpdateSummary
	result.RecommendationLevel = result.ShouldMerge
	result.RecommendationText = result.MergeReason
	return result
}

func buildUpstreamTrackingFailedAnalysisResult(reason string, degradationNotes []string) *UpstreamTrackingAnalysisResult {
	trimmedReason := strings.TrimSpace(reason)
	if trimmedReason == "" {
		trimmedReason = "分析执行失败"
	}
	raw := &upstreamTrackingAnalysisRawResult{
		UpdateSummary:    "分析失败：未能生成有效评估结果",
		ShouldMerge:      "observe",
		MergeReason:      "本次分析未得到可直接执行的合并建议，请先查看失败记录并补充证据后重试。",
		MergeStrategy:    "observe_only",
		LocalWorkSummary: "当前没有足够的模型输出用于判断本地是否已有类似优化。",
		RiskSummary:      "分析输出解析失败: " + trimmedReason,
		TargetFilesRaw:   []string{},
		TargetAreasRaw:   []string{},
		Actions:          []UpstreamTrackingAnalysisActionItem{},
	}
	return normalizeUpstreamTrackingAnalysisResult(raw, degradationNotes)
}

func persistUpstreamTrackingAnalysisFailure(cycle *model.UpstreamTrackingCycle, commits []upstreamTrackingGitHubCommitItem, compareSummary string, memorySnippets []upstreamTrackingMemorySnippet, prompt string, reason string, degradationNotes []string) (*model.UpstreamTrackingCycle, error) {
	result := buildUpstreamTrackingFailedAnalysisResult(reason, degradationNotes)
	cycle.Status = "failed"
	cycle.Summary = strings.TrimSpace(result.UpdateSummary)
	cycle.RecommendationLevel = strings.TrimSpace(result.ShouldMerge)
	cycle.RecommendationText = strings.TrimSpace(result.MergeReason)
	cycle.RiskSummary = strings.TrimSpace(result.RiskSummary)
	cycle.AnalysisFinishedAt = time.Now().UnixMilli()
	if err := model.DB.Save(cycle).Error; err != nil {
		return cycle, err
	}
	if err := persistUpstreamTrackingContexts(cycle.Id, commits, compareSummary, memorySnippets, prompt, result); err != nil {
		return cycle, err
	}
	if err := replaceUpstreamTrackingActions(cycle.Id, result.Actions); err != nil {
		return cycle, err
	}
	return cycle, nil
}

func analyzeUpstreamTrackingWithDeepSeek(ctx context.Context, cycle *model.UpstreamTrackingCycle, prompt string) (*UpstreamTrackingAnalysisResult, error) {
	body, err := common.Marshal(upstreamTrackingDeepSeekRequest{Model: cycle.AnalysisModel, Messages: []upstreamTrackingDeepSeekMessage{{Role: "system", Content: "你是一个严格的上游治理评估助手。"}, {Role: "user", Content: prompt}}})
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, buildUpstreamTrackingDeepSeekURL(getUpstreamTrackingOption("UpstreamTrackingBaseUrl")), bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+getUpstreamTrackingOption("UpstreamTrackingAnalysisToken"))
	client := GetHttpClient()
	if client == nil {
		client = http.DefaultClient
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= http.StatusBadRequest {
		payload, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("deepseek request failed: %d %s", resp.StatusCode, common.MaskSensitiveInfo(string(payload)))
	}
	payload, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var response upstreamTrackingDeepSeekResponse
	if err := common.Unmarshal(payload, &response); err != nil {
		return nil, err
	}
	if len(response.Choices) == 0 {
		return nil, fmt.Errorf("deepseek returned empty choices")
	}
	content := strings.TrimSpace(response.Choices[0].Message.Content)
	var raw upstreamTrackingAnalysisRawResult
	if err := common.UnmarshalJsonStr(content, &raw); err != nil {
		return nil, err
	}
	return normalizeUpstreamTrackingAnalysisResult(&raw, nil), nil
}

func persistUpstreamTrackingContexts(cycleId int, commits []upstreamTrackingGitHubCommitItem, compareSummary string, memorySnippets []upstreamTrackingMemorySnippet, prompt string, result *UpstreamTrackingAnalysisResult) error {
	commitBytes, err := common.Marshal(commits)
	if err != nil {
		return err
	}
	memoryBytes, err := common.Marshal(memorySnippets)
	if err != nil {
		return err
	}
	resultBytes, err := common.Marshal(result)
	if err != nil {
		return err
	}
	contextTypes := []string{"upstream_commits", "upstream_compare", "ald_memory_context", "analysis_prompt", "analysis_response"}
	if err := model.DB.Where("cycle_id = ? AND context_type IN ?", cycleId, contextTypes).Delete(&model.UpstreamTrackingContext{}).Error; err != nil {
		return err
	}
	contexts := []model.UpstreamTrackingContext{{CycleId: cycleId, ContextType: "upstream_commits", Content: string(commitBytes)}, {CycleId: cycleId, ContextType: "upstream_compare", Content: compareSummary}, {CycleId: cycleId, ContextType: "ald_memory_context", Content: string(memoryBytes)}, {CycleId: cycleId, ContextType: "analysis_prompt", Content: prompt}, {CycleId: cycleId, ContextType: "analysis_response", Content: string(resultBytes)}}
	for _, item := range contexts {
		contextItem := item
		if err := model.DB.Create(&contextItem).Error; err != nil {
			return err
		}
	}
	return nil
}

func replaceUpstreamTrackingActions(cycleId int, actions []UpstreamTrackingAnalysisActionItem) error {
	if err := model.DB.Where("cycle_id = ?", cycleId).Delete(&model.UpstreamTrackingAction{}).Error; err != nil {
		return err
	}
	for _, item := range actions {
		action := &model.UpstreamTrackingAction{CycleId: cycleId, Title: item.Title, Category: item.Category, Recommendation: item.Recommendation, Priority: item.Priority, Status: item.Status, TargetArea: item.TargetArea, Note: item.Note}
		if action.Status == "" {
			action.Status = "pending"
		}
		if err := model.DB.Create(action).Error; err != nil {
			return err
		}
	}
	return nil
}

func RunUpstreamTrackingAnalysis(ctx context.Context, cycleId int) (*model.UpstreamTrackingCycle, error) {
	var cycle model.UpstreamTrackingCycle
	if err := model.DB.First(&cycle, cycleId).Error; err != nil {
		return nil, err
	}
	cycle.Status = "running"
	cycle.AnalysisStartedAt = time.Now().UnixMilli()
	if err := model.DB.Save(&cycle).Error; err != nil {
		return nil, err
	}
	commits, err := fetchUpstreamTrackingCommits(ctx, cycle.RepoOwner, cycle.RepoName, cycle.BaseBranch)
	if err != nil {
		cycle.Status = "failed"
		cycle.RiskSummary = err.Error()
		_ = model.DB.Save(&cycle).Error
		return nil, err
	}
	degradationNotes := make([]string, 0)
	compareSummary := ""
	compareBase, compareHead, hasCompareRange := resolveUpstreamTrackingCompareRange(commits)
	if hasCompareRange {
		compare, compareErr := fetchUpstreamTrackingCompare(ctx, cycle.RepoOwner, cycle.RepoName, compareBase, compareHead)
		if compareErr != nil {
			degradationNotes = append(degradationNotes, fmt.Sprintf("compare fetch failed: %s", compareErr.Error()))
		} else {
			compareSummary = buildUpstreamTrackingCompareSummary(compare)
		}
	} else {
		degradationNotes = append(degradationNotes, "compare skipped: insufficient commit range")
	}
	memorySnippets, memoryDegradationNotes := loadUpstreamTrackingMemorySnippets(ctx)
	if len(memoryDegradationNotes) > 0 {
		degradationNotes = append(degradationNotes, memoryDegradationNotes...)
	}
	prompt := buildUpstreamTrackingPrompt(&cycle, commits, compareSummary, memorySnippets)
	result, err := analyzeUpstreamTrackingWithDeepSeek(ctx, &cycle, prompt)
	if err != nil {
		failedCycle, persistErr := persistUpstreamTrackingAnalysisFailure(&cycle, commits, compareSummary, memorySnippets, prompt, err.Error(), degradationNotes)
		if persistErr != nil {
			return failedCycle, persistErr
		}
		return failedCycle, err
	}
	result = normalizeUpstreamTrackingAnalysisResult(&upstreamTrackingAnalysisRawResult{
		Summary:             result.Summary,
		RecommendationLevel: result.RecommendationLevel,
		RecommendationText:  result.RecommendationText,
		RiskSummary:         result.RiskSummary,
		UpdateSummary:       result.UpdateSummary,
		HasSimilarLocalWork: upstreamTrackingBoolPtr(result.HasSimilarLocalWork),
		LocalWorkSummary:    result.LocalWorkSummary,
		ShouldMerge:         result.ShouldMerge,
		MergeReason:         result.MergeReason,
		MergeStrategy:       result.MergeStrategy,
		MergePlanSummary:    result.MergePlanSummary,
		TargetFilesRaw:      result.TargetFiles,
		TargetAreasRaw:      result.TargetAreas,
		Actions:             result.Actions,
	}, degradationNotes)
	if result.UpdateSummary == "" {
		result.UpdateSummary = strings.TrimSpace(result.Summary)
	}
	cycle.Status = "completed"
	cycle.Summary = strings.TrimSpace(result.UpdateSummary)
	cycle.RecommendationLevel = strings.TrimSpace(result.ShouldMerge)
	cycle.RecommendationText = strings.TrimSpace(result.MergeReason)
	cycle.RiskSummary = strings.TrimSpace(result.RiskSummary)
	cycle.AnalysisFinishedAt = time.Now().UnixMilli()
	if cycle.RecommendationLevel == "" {
		cycle.RecommendationLevel = "observe"
	}
	if err := model.DB.Save(&cycle).Error; err != nil {
		return nil, err
	}
	if err := persistUpstreamTrackingContexts(cycle.Id, commits, compareSummary, memorySnippets, prompt, result); err != nil {
		return nil, err
	}
	if err := replaceUpstreamTrackingActions(cycle.Id, result.Actions); err != nil {
		return nil, err
	}
	return &cycle, nil
}
