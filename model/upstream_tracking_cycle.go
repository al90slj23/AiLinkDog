package model

type UpstreamTrackingCycle struct {
	Id                  int    `json:"id" gorm:"primaryKey;autoIncrement"`
	CycleCode           string `json:"cycle_code" gorm:"type:varchar(64);uniqueIndex;not null"`
	Status              string `json:"status" gorm:"type:varchar(32);not null;default:'pending'"`
	RepoOwner           string `json:"repo_owner" gorm:"type:varchar(128);not null"`
	RepoName            string `json:"repo_name" gorm:"type:varchar(128);not null"`
	BaseBranch          string `json:"base_branch" gorm:"type:varchar(128);not null"`
	UpstreamBaseSHA     string `json:"upstream_base_sha" gorm:"type:varchar(64)"`
	UpstreamHeadSHA     string `json:"upstream_head_sha" gorm:"type:varchar(64)"`
	AldBaseVersion      string `json:"ald_base_version" gorm:"type:varchar(64)"`
	AldBaseRevision     string `json:"ald_base_revision" gorm:"type:varchar(128)"`
	AnalysisProvider    string `json:"analysis_provider" gorm:"type:varchar(64)"`
	AnalysisModel       string `json:"analysis_model" gorm:"type:varchar(128)"`
	Summary             string `json:"summary" gorm:"type:text"`
	RecommendationLevel string `json:"recommendation_level" gorm:"type:varchar(32)"`
	RecommendationText  string `json:"recommendation_text" gorm:"type:text"`
	RiskSummary         string `json:"risk_summary" gorm:"type:text"`
	DecisionStatus      string `json:"decision_status" gorm:"type:varchar(32);default:'undecided'"`
	DecisionBy          string `json:"decision_by" gorm:"type:varchar(128)"`
	DecisionNote        string `json:"decision_note" gorm:"type:text"`
	AnalysisStartedAt   int64  `json:"analysis_started_at"`
	AnalysisFinishedAt  int64  `json:"analysis_finished_at"`
	CreatedAt           int64  `json:"created_at" gorm:"autoCreateTime:milli"`
	UpdatedAt           int64  `json:"updated_at" gorm:"autoUpdateTime:milli"`
}
