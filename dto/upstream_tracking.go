package dto

type UpstreamTrackingConfigResponse struct {
	Configured    bool   `json:"configured"`
	MaskedToken   string `json:"maskedToken"`
	Enabled       bool   `json:"enabled"`
	RepoOwner     string `json:"repoOwner"`
	RepoName      string `json:"repoName"`
	BaseBranch    string `json:"baseBranch"`
	Provider      string `json:"provider"`
	Model         string `json:"model"`
	BaseURL       string `json:"baseUrl"`
	StartVersion  string `json:"startVersion"`
	LastSyncedVersion string `json:"lastSyncedVersion"`
	IntervalDays  int    `json:"intervalDays"`
	ScheduleMode  string `json:"scheduleMode"`
	AnalysisScope string `json:"analysisScope"`
}

type UpstreamTrackingConfigUpdateRequest struct {
	Enabled           *bool   `json:"enabled"`
	RepoOwner         *string `json:"repoOwner"`
	RepoName          *string `json:"repoName"`
	BaseBranch        *string `json:"baseBranch"`
	Provider          *string `json:"provider"`
	Model             *string `json:"model"`
	BaseURL           *string `json:"baseUrl"`
	StartVersion      *string `json:"startVersion"`
	LastSyncedVersion *string `json:"lastSyncedVersion"`
	IntervalDays      *int    `json:"intervalDays"`
	AnalysisToken     *string `json:"analysisToken"`
	ScheduleMode      *string `json:"scheduleMode"`
	AnalysisScope     *string `json:"analysisScope"`
}

type UpstreamTrackingCycleCreateRequest struct {
	CycleCode string `json:"cycleCode"`
	Summary   string `json:"summary"`
}

type UpstreamTrackingDecisionRequest struct {
	DecisionStatus string `json:"decisionStatus"`
	DecisionNote   string `json:"decisionNote"`
}

type UpstreamTrackingActionCreateRequest struct {
	CycleId        int    `json:"cycleId"`
	Title          string `json:"title"`
	Category       string `json:"category"`
	Recommendation string `json:"recommendation"`
	Priority       string `json:"priority"`
	Status         string `json:"status"`
	TargetArea     string `json:"targetArea"`
	Note           string `json:"note"`
}

type UpstreamTrackingActionUpdateRequest struct {
	Title          string `json:"title"`
	Category       string `json:"category"`
	Recommendation string `json:"recommendation"`
	Priority       string `json:"priority"`
	Status         string `json:"status"`
	TargetArea     string `json:"targetArea"`
	Note           string `json:"note"`
}

type UpstreamTrackingOverviewView struct {
	StartVersion        string   `json:"startVersion"`
	LastSyncedVersion   string   `json:"lastSyncedVersion"`
	IntervalDays        int      `json:"intervalDays"`
	Repo                string   `json:"repo"`
	BaseBranch          string   `json:"baseBranch"`
	ExecutedAt          int64    `json:"executedAt"`
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

type UpstreamTrackingHistoryItemView struct {
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

type UpstreamTrackingActionView struct {
	ID             int    `json:"id"`
	Title          string `json:"title"`
	Category       string `json:"category"`
	Recommendation string `json:"recommendation"`
	Priority       string `json:"priority"`
	Status         string `json:"status"`
	TargetArea     string `json:"targetArea"`
	Note           string `json:"note"`
}

type UpstreamTrackingContextView struct {
	ID          int    `json:"id"`
	ContextType string `json:"contextType"`
	Content     string `json:"content"`
	ContentMeta string `json:"contentMeta"`
}

type UpstreamTrackingHistoryDetailView struct {
	ID               int      `json:"id"`
	CycleCode        string   `json:"cycleCode"`
	Status           string   `json:"status"`
	ExecutedAt       int64    `json:"executedAt"`
	UpdateSummary    string   `json:"updateSummary"`
	HasSimilarLocalWork bool   `json:"hasSimilarLocalWork"`
	LocalWorkSummary string   `json:"localWorkSummary"`
	ShouldMerge      string   `json:"shouldMerge"`
	MergeReason      string   `json:"mergeReason"`
	MergeStrategy    string   `json:"mergeStrategy"`
	MergePlanSummary string   `json:"mergePlanSummary"`
	TargetFiles      []string `json:"targetFiles"`
	TargetAreas      []string `json:"targetAreas"`
	RiskSummary      string   `json:"riskSummary"`
	DecisionStatus   string   `json:"decisionStatus"`
	DecisionNote     string   `json:"decisionNote"`
	Actions          []UpstreamTrackingActionView  `json:"actions"`
	Contexts         []UpstreamTrackingContextView `json:"contexts"`
}

type UpstreamTrackingConfigView struct {
	Configured        bool   `json:"configured"`
	Enabled           bool   `json:"enabled"`
	StartVersion      string `json:"startVersion"`
	LastSyncedVersion string `json:"lastSyncedVersion"`
	IntervalDays      int    `json:"intervalDays"`
	RepoOwner         string `json:"repoOwner"`
	RepoName          string `json:"repoName"`
	Repo              string `json:"repo"`
	BaseBranch        string `json:"baseBranch"`
	Provider          string `json:"provider"`
	Model             string `json:"model"`
	BaseURL           string `json:"baseUrl"`
	ScheduleMode      string `json:"scheduleMode"`
	AnalysisScope     string `json:"analysisScope"`
	MaskedToken       string `json:"maskedToken"`
}

type UpstreamTrackingPageDataResponse struct {
	Overview       UpstreamTrackingOverviewView       `json:"overview"`
	HistoryItems   []UpstreamTrackingHistoryItemView  `json:"historyItems"`
	SelectedDetail *UpstreamTrackingHistoryDetailView `json:"selectedDetail"`
	ConfigView     UpstreamTrackingConfigView         `json:"configView"`
}
