package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"
	"github.com/gin-gonic/gin"
)

type upstreamTrackingStoredProductResult struct {
	UpdateSummary       string   `json:"updateSummary"`
	HasSimilarLocalWork bool     `json:"hasSimilarLocalWork"`
	LocalWorkSummary    string   `json:"localWorkSummary"`
	ShouldMerge         string   `json:"shouldMerge"`
	MergeReason         string   `json:"mergeReason"`
	MergeStrategy       string   `json:"mergeStrategy"`
	MergePlanSummary    string   `json:"mergePlanSummary"`
	TargetFiles         []string `json:"targetFiles"`
	TargetAreas         []string `json:"targetAreas"`
	RiskSummary         string   `json:"riskSummary"`
}

const (
	upstreamTrackingEnabledKey       = "UpstreamTrackingEnabled"
	upstreamTrackingRepoOwnerKey     = "UpstreamTrackingRepoOwner"
	upstreamTrackingRepoNameKey      = "UpstreamTrackingRepoName"
	upstreamTrackingBaseBranchKey    = "UpstreamTrackingBaseBranch"
	upstreamTrackingProviderKey      = "UpstreamTrackingProvider"
	upstreamTrackingModelKey         = "UpstreamTrackingModel"
	upstreamTrackingBaseURLKey       = "UpstreamTrackingBaseUrl"
	upstreamTrackingAnalysisTokenKey = "UpstreamTrackingAnalysisToken"
	upstreamTrackingScheduleModeKey  = "UpstreamTrackingScheduleMode"
	upstreamTrackingAnalysisScopeKey = "UpstreamTrackingAnalysisScope"
)

func maskAnalysisToken(token string) string {
	token = strings.TrimSpace(token)
	if token == "" {
		return ""
	}
	if len(token) <= 10 {
		return token[:2] + "***"
	}
	return token[:7] + "..." + token[len(token)-4:]
}

func getOptionValue(key string) string {
	common.OptionMapRWMutex.RLock()
	defer common.OptionMapRWMutex.RUnlock()
	return common.OptionMap[key]
}

func buildUpstreamTrackingRepo(owner string, name string) string {
	owner = strings.TrimSpace(owner)
	name = strings.TrimSpace(name)
	switch {
	case owner != "" && name != "":
		return owner + "/" + name
	case owner != "":
		return owner
	default:
		return name
	}
}

func deriveUpstreamTrackingShouldMerge(cycle *model.UpstreamTrackingCycle) string {
	if cycle == nil {
		return "observe"
	}
	if normalized := strings.TrimSpace(cycle.RecommendationLevel); normalized != "" {
		return normalized
	}
	if strings.TrimSpace(cycle.RecommendationText) != "" {
		return "review"
	}
	return "observe"
}

func deriveUpstreamTrackingMergeStrategy(cycle *model.UpstreamTrackingCycle) string {
	if cycle == nil {
		return "observe_only"
	}
	if strings.EqualFold(strings.TrimSpace(cycle.Status), "failed") {
		return "observe_only"
	}
	if strings.TrimSpace(cycle.RecommendationText) != "" {
		return "manual_review"
	}
	return "observe_only"
}

func buildUpstreamTrackingConfigView() dto.UpstreamTrackingConfigView {
	analysisToken := getOptionValue(upstreamTrackingAnalysisTokenKey)
	repoOwner := getOptionValue(upstreamTrackingRepoOwnerKey)
	repoName := getOptionValue(upstreamTrackingRepoNameKey)
	return dto.UpstreamTrackingConfigView{
		Configured:        strings.TrimSpace(analysisToken) != "",
		Enabled:           strings.EqualFold(getOptionValue(upstreamTrackingEnabledKey), "true"),
		StartVersion:      getOptionValue("UpstreamTrackingStartVersion"),
		LastSyncedVersion: getOptionValue("UpstreamTrackingLastSyncedVersion"),
		IntervalDays:      common.UpstreamTrackingIntervalDays,
		RepoOwner:         repoOwner,
		RepoName:          repoName,
		Repo:              buildUpstreamTrackingRepo(repoOwner, repoName),
		BaseBranch:        getOptionValue(upstreamTrackingBaseBranchKey),
		Provider:          getOptionValue(upstreamTrackingProviderKey),
		Model:             getOptionValue(upstreamTrackingModelKey),
		BaseURL:           getOptionValue(upstreamTrackingBaseURLKey),
		ScheduleMode:      getOptionValue(upstreamTrackingScheduleModeKey),
		AnalysisScope:     getOptionValue(upstreamTrackingAnalysisScopeKey),
		MaskedToken:       maskAnalysisToken(analysisToken),
	}
}

func loadUpstreamTrackingStoredProductResult(contexts []*model.UpstreamTrackingContext) *upstreamTrackingStoredProductResult {
	for _, contextItem := range contexts {
		if contextItem == nil || contextItem.ContextType != "analysis_response" {
			continue
		}
		content := strings.TrimSpace(contextItem.Content)
		if content == "" {
			continue
		}
		var stored upstreamTrackingStoredProductResult
		if err := common.UnmarshalJsonStr(content, &stored); err != nil {
			continue
		}
		if stored.TargetFiles == nil {
			stored.TargetFiles = []string{}
		}
		if stored.TargetAreas == nil {
			stored.TargetAreas = []string{}
		}
		return &stored
	}
	return nil
}

func buildUpstreamTrackingOverviewView(configView dto.UpstreamTrackingConfigView, latestCycle *model.UpstreamTrackingCycle, productResult *upstreamTrackingStoredProductResult) dto.UpstreamTrackingOverviewView {
	overview := dto.UpstreamTrackingOverviewView{
		StartVersion:      configView.StartVersion,
		LastSyncedVersion: configView.LastSyncedVersion,
		IntervalDays:      configView.IntervalDays,
		Repo:              configView.Repo,
		BaseBranch:        configView.BaseBranch,
		ShouldMerge:       "observe",
		MergeStrategy:     "observe_only",
		TargetFiles:       []string{},
		TargetAreas:       []string{},
	}
	if latestCycle == nil {
		return overview
	}
	overview.ExecutedAt = latestCycle.AnalysisFinishedAt
	overview.UpdateSummary = latestCycle.Summary
	overview.MergeReason = latestCycle.RecommendationText
	overview.RiskSummary = latestCycle.RiskSummary
	overview.ShouldMerge = deriveUpstreamTrackingShouldMerge(latestCycle)
	overview.MergeStrategy = deriveUpstreamTrackingMergeStrategy(latestCycle)
	if productResult != nil {
		if strings.TrimSpace(productResult.UpdateSummary) != "" {
			overview.UpdateSummary = strings.TrimSpace(productResult.UpdateSummary)
		}
		overview.HasSimilarLocalWork = productResult.HasSimilarLocalWork
		overview.LocalWorkSummary = strings.TrimSpace(productResult.LocalWorkSummary)
		if strings.TrimSpace(productResult.ShouldMerge) != "" {
			overview.ShouldMerge = strings.TrimSpace(productResult.ShouldMerge)
		}
		if strings.TrimSpace(productResult.MergeReason) != "" {
			overview.MergeReason = strings.TrimSpace(productResult.MergeReason)
		}
		if strings.TrimSpace(productResult.MergeStrategy) != "" {
			overview.MergeStrategy = strings.TrimSpace(productResult.MergeStrategy)
		}
		overview.MergePlanSummary = strings.TrimSpace(productResult.MergePlanSummary)
		overview.TargetFiles = productResult.TargetFiles
		overview.TargetAreas = productResult.TargetAreas
		if strings.TrimSpace(productResult.RiskSummary) != "" {
			overview.RiskSummary = strings.TrimSpace(productResult.RiskSummary)
		}
	}
	return overview
}

func buildUpstreamTrackingHistoryItems(cycles []*model.UpstreamTrackingCycle) []dto.UpstreamTrackingHistoryItemView {
	historyItems := make([]dto.UpstreamTrackingHistoryItemView, 0, len(cycles))
	for _, cycle := range cycles {
		title := strings.TrimSpace(cycle.Summary)
		if title == "" {
			title = strings.TrimSpace(cycle.CycleCode)
		}
		historyItems = append(historyItems, dto.UpstreamTrackingHistoryItemView{
			ID:             cycle.Id,
			Title:          title,
			CycleCode:      cycle.CycleCode,
			Status:         cycle.Status,
			ExecutedAt:     cycle.AnalysisFinishedAt,
			UpdateSummary:  cycle.Summary,
			ShouldMerge:    deriveUpstreamTrackingShouldMerge(cycle),
			MergeStrategy:  deriveUpstreamTrackingMergeStrategy(cycle),
			DecisionStatus: cycle.DecisionStatus,
		})
	}
	return historyItems
}

func buildUpstreamTrackingSelectedDetail(cycle *model.UpstreamTrackingCycle, actions []*model.UpstreamTrackingAction, contexts []*model.UpstreamTrackingContext, productResult *upstreamTrackingStoredProductResult) *dto.UpstreamTrackingHistoryDetailView {
	if cycle == nil {
		return nil
	}

	actionViews := make([]dto.UpstreamTrackingActionView, 0, len(actions))
	for _, action := range actions {
		actionViews = append(actionViews, dto.UpstreamTrackingActionView{
			ID:             action.Id,
			Title:          action.Title,
			Category:       action.Category,
			Recommendation: action.Recommendation,
			Priority:       action.Priority,
			Status:         action.Status,
			TargetArea:     action.TargetArea,
			Note:           action.Note,
		})
	}
	contextViews := make([]dto.UpstreamTrackingContextView, 0, len(contexts))
	for _, context := range contexts {
		contextViews = append(contextViews, dto.UpstreamTrackingContextView{
			ID:          context.Id,
			ContextType: context.ContextType,
			Content:     context.Content,
			ContentMeta: context.ContentMeta,
		})
	}

	detail := &dto.UpstreamTrackingHistoryDetailView{
		ID:               cycle.Id,
		CycleCode:        cycle.CycleCode,
		Status:           cycle.Status,
		ExecutedAt:       cycle.AnalysisFinishedAt,
		UpdateSummary:    cycle.Summary,
		ShouldMerge:      deriveUpstreamTrackingShouldMerge(cycle),
		MergeReason:      cycle.RecommendationText,
		MergeStrategy:    deriveUpstreamTrackingMergeStrategy(cycle),
		MergePlanSummary: "",
		TargetFiles:      []string{},
		TargetAreas:      []string{},
		HasSimilarLocalWork: false,
		LocalWorkSummary:    "",
		RiskSummary:      cycle.RiskSummary,
		DecisionStatus:   cycle.DecisionStatus,
		DecisionNote:     cycle.DecisionNote,
		Actions:          actionViews,
		Contexts:         contextViews,
	}
	if productResult != nil {
		if strings.TrimSpace(productResult.UpdateSummary) != "" {
			detail.UpdateSummary = strings.TrimSpace(productResult.UpdateSummary)
		}
		detail.HasSimilarLocalWork = productResult.HasSimilarLocalWork
		detail.LocalWorkSummary = strings.TrimSpace(productResult.LocalWorkSummary)
		if strings.TrimSpace(productResult.ShouldMerge) != "" {
			detail.ShouldMerge = strings.TrimSpace(productResult.ShouldMerge)
		}
		if strings.TrimSpace(productResult.MergeReason) != "" {
			detail.MergeReason = strings.TrimSpace(productResult.MergeReason)
		}
		if strings.TrimSpace(productResult.MergeStrategy) != "" {
			detail.MergeStrategy = strings.TrimSpace(productResult.MergeStrategy)
		}
		detail.MergePlanSummary = strings.TrimSpace(productResult.MergePlanSummary)
		detail.TargetFiles = productResult.TargetFiles
		detail.TargetAreas = productResult.TargetAreas
		if strings.TrimSpace(productResult.RiskSummary) != "" {
			detail.RiskSummary = strings.TrimSpace(productResult.RiskSummary)
		}
	}
	return detail
}

func appendOptionalTrimmedUpdate(updates map[string]string, key string, value *string) {
	if value == nil {
		return
	}
	updates[key] = strings.TrimSpace(*value)
}

func GetUpstreamTrackingConfig(c *gin.Context) {
	analysisToken := getOptionValue(upstreamTrackingAnalysisTokenKey)
	response := dto.UpstreamTrackingConfigResponse{
		Configured:    strings.TrimSpace(analysisToken) != "",
		MaskedToken:   maskAnalysisToken(analysisToken),
		Enabled:       strings.EqualFold(getOptionValue(upstreamTrackingEnabledKey), "true"),
		RepoOwner:     getOptionValue(upstreamTrackingRepoOwnerKey),
		RepoName:      getOptionValue(upstreamTrackingRepoNameKey),
		BaseBranch:    getOptionValue(upstreamTrackingBaseBranchKey),
		Provider:      getOptionValue(upstreamTrackingProviderKey),
		Model:         getOptionValue(upstreamTrackingModelKey),
		BaseURL:       getOptionValue(upstreamTrackingBaseURLKey),
		StartVersion:  getOptionValue("UpstreamTrackingStartVersion"),
		LastSyncedVersion: getOptionValue("UpstreamTrackingLastSyncedVersion"),
		IntervalDays:  common.UpstreamTrackingIntervalDays,
		ScheduleMode:  getOptionValue(upstreamTrackingScheduleModeKey),
		AnalysisScope: getOptionValue(upstreamTrackingAnalysisScopeKey),
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": response})
}

func GetUpstreamTrackingPageData(c *gin.Context) {
	configView := buildUpstreamTrackingConfigView()
	pageData := dto.UpstreamTrackingPageDataResponse{
		Overview:     buildUpstreamTrackingOverviewView(configView, nil, nil),
		HistoryItems: []dto.UpstreamTrackingHistoryItemView{},
		ConfigView:   configView,
	}

	var cycles []*model.UpstreamTrackingCycle
	if err := model.DB.Order("id desc").Find(&cycles).Error; err == nil {
		pageData.HistoryItems = buildUpstreamTrackingHistoryItems(cycles)
		if len(cycles) > 0 {
			var actions []*model.UpstreamTrackingAction
			if err := model.DB.Where("cycle_id = ?", cycles[0].Id).Order("id asc").Find(&actions).Error; err != nil {
				c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
				return
			}
			var contexts []*model.UpstreamTrackingContext
			if err := model.DB.Where("cycle_id = ?", cycles[0].Id).Order("id asc").Find(&contexts).Error; err != nil {
				c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
				return
			}
			productResult := loadUpstreamTrackingStoredProductResult(contexts)
			pageData.Overview = buildUpstreamTrackingOverviewView(configView, cycles[0], productResult)
			pageData.SelectedDetail = buildUpstreamTrackingSelectedDetail(cycles[0], actions, contexts, productResult)
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": pageData})
}

func UpdateUpstreamTrackingConfig(c *gin.Context) {
	var req dto.UpstreamTrackingConfigUpdateRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的参数"})
		return
	}
	updates := map[string]string{}
	appendOptionalTrimmedUpdate(updates, upstreamTrackingRepoOwnerKey, req.RepoOwner)
	appendOptionalTrimmedUpdate(updates, upstreamTrackingRepoNameKey, req.RepoName)
	appendOptionalTrimmedUpdate(updates, upstreamTrackingBaseBranchKey, req.BaseBranch)
	appendOptionalTrimmedUpdate(updates, upstreamTrackingProviderKey, req.Provider)
	appendOptionalTrimmedUpdate(updates, upstreamTrackingModelKey, req.Model)
	appendOptionalTrimmedUpdate(updates, upstreamTrackingBaseURLKey, req.BaseURL)
	appendOptionalTrimmedUpdate(updates, "UpstreamTrackingStartVersion", req.StartVersion)
	appendOptionalTrimmedUpdate(updates, "UpstreamTrackingLastSyncedVersion", req.LastSyncedVersion)
	appendOptionalTrimmedUpdate(updates, upstreamTrackingScheduleModeKey, req.ScheduleMode)
	appendOptionalTrimmedUpdate(updates, upstreamTrackingAnalysisScopeKey, req.AnalysisScope)
	if req.Enabled != nil {
		updates[upstreamTrackingEnabledKey] = strconv.FormatBool(*req.Enabled)
	}
	if req.IntervalDays != nil {
		updates["UpstreamTrackingIntervalDays"] = strconv.Itoa(*req.IntervalDays)
	}
	if req.AnalysisToken != nil && strings.TrimSpace(*req.AnalysisToken) != "" {
		updates[upstreamTrackingAnalysisTokenKey] = strings.TrimSpace(*req.AnalysisToken)
	}
	for key, value := range updates {
		if err := model.UpdateOption(key, value); err != nil {
			c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
			return
		}
	}
	GetUpstreamTrackingConfig(c)
}

func GetUpstreamTrackingCycles(c *gin.Context) {
	var cycles []*model.UpstreamTrackingCycle
	if err := model.DB.Order("id desc").Find(&cycles).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": cycles})
}

func CreateUpstreamTrackingCycle(c *gin.Context) {
	var req dto.UpstreamTrackingCycleCreateRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的参数"})
		return
	}
	cycleCode := strings.TrimSpace(req.CycleCode)
	if cycleCode == "" {
		cycleCode = fmt.Sprintf("cycle-%d", time.Now().Unix())
	}
	cycle := &model.UpstreamTrackingCycle{CycleCode: cycleCode, Status: "pending", RepoOwner: getOptionValue(upstreamTrackingRepoOwnerKey), RepoName: getOptionValue(upstreamTrackingRepoNameKey), BaseBranch: getOptionValue(upstreamTrackingBaseBranchKey), AldBaseVersion: common.Version, AldBaseRevision: "", AnalysisProvider: getOptionValue(upstreamTrackingProviderKey), AnalysisModel: getOptionValue(upstreamTrackingModelKey), Summary: strings.TrimSpace(req.Summary), DecisionStatus: "undecided"}
	if err := model.DB.Create(cycle).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": cycle})
}

func GetUpstreamTrackingCycle(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的 id"})
		return
	}
	var cycle model.UpstreamTrackingCycle
	if err := model.DB.First(&cycle, id).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": cycle})
}

func GetUpstreamTrackingCycleDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的 id"})
		return
	}

	var cycle model.UpstreamTrackingCycle
	if err := model.DB.First(&cycle, id).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}

	var actions []*model.UpstreamTrackingAction
	if err := model.DB.Where("cycle_id = ?", id).Order("id asc").Find(&actions).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}

	var contexts []*model.UpstreamTrackingContext
	if err := model.DB.Where("cycle_id = ?", id).Order("id asc").Find(&contexts).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}

	productResult := loadUpstreamTrackingStoredProductResult(contexts)
	detail := buildUpstreamTrackingSelectedDetail(&cycle, actions, contexts, productResult)
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": detail})
}

func GetUpstreamTrackingCycleContexts(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的 id"})
		return
	}
	var contexts []*model.UpstreamTrackingContext
	if err := model.DB.Where("cycle_id = ?", id).Order("id asc").Find(&contexts).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": contexts})
}

func AnalyzeUpstreamTrackingCycle(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的 id"})
		return
	}
	cycle, err := service.RunUpstreamTrackingAnalysis(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error(), "data": cycle})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": cycle})
}

func DecideUpstreamTrackingCycle(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的 id"})
		return
	}
	var req dto.UpstreamTrackingDecisionRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的参数"})
		return
	}
	var cycle model.UpstreamTrackingCycle
	if err := model.DB.First(&cycle, id).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	cycle.DecisionStatus = strings.TrimSpace(req.DecisionStatus)
	cycle.DecisionNote = strings.TrimSpace(req.DecisionNote)
	if cycle.DecisionStatus == "" {
		cycle.DecisionStatus = "undecided"
	}
	if userId, ok := c.Get("id"); ok {
		cycle.DecisionBy = fmt.Sprintf("%v", userId)
	}
	if err := model.DB.Save(&cycle).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": cycle})
}

func GetUpstreamTrackingActions(c *gin.Context) {
	var actions []*model.UpstreamTrackingAction
	if err := model.DB.Order("id desc").Find(&actions).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": actions})
}

func CreateUpstreamTrackingAction(c *gin.Context) {
	var req dto.UpstreamTrackingActionCreateRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的参数"})
		return
	}
	action := &model.UpstreamTrackingAction{CycleId: req.CycleId, Title: strings.TrimSpace(req.Title), Category: strings.TrimSpace(req.Category), Recommendation: strings.TrimSpace(req.Recommendation), Priority: strings.TrimSpace(req.Priority), Status: strings.TrimSpace(req.Status), TargetArea: strings.TrimSpace(req.TargetArea), Note: strings.TrimSpace(req.Note)}
	if action.Status == "" {
		action.Status = "pending"
	}
	if err := model.DB.Create(action).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": action})
}

func UpdateUpstreamTrackingAction(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的 id"})
		return
	}
	var req dto.UpstreamTrackingActionUpdateRequest
	if err := common.DecodeJson(c.Request.Body, &req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的参数"})
		return
	}
	var action model.UpstreamTrackingAction
	if err := model.DB.First(&action, id).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	action.Title = strings.TrimSpace(req.Title)
	action.Category = strings.TrimSpace(req.Category)
	action.Recommendation = strings.TrimSpace(req.Recommendation)
	action.Priority = strings.TrimSpace(req.Priority)
	action.Status = strings.TrimSpace(req.Status)
	action.TargetArea = strings.TrimSpace(req.TargetArea)
	action.Note = strings.TrimSpace(req.Note)
	if err := model.DB.Save(&action).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "", "data": action})
}
