package dto

type MonitorStatusOverviewDTO struct {
	OverallStatus string  `json:"overall_status"`
	TargetCount   int     `json:"target_count"`
	AffectedCount int     `json:"affected_count"`
	AvgLatencyMs  float64 `json:"avg_latency_ms"`
	UpdatedAt     int64   `json:"updated_at"`
	Window        string  `json:"window"`
}

type MonitorStatusTargetDTO struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	SourceType string `json:"source_type"`
	Visibility string `json:"visibility"`
	SourceKey  string `json:"source_key"`
	SourceName string `json:"source_name"`
	Status     string `json:"status"`
}

type MonitorStatusSnapshotDTO struct {
	ID            int    `json:"id"`
	TargetID      int    `json:"target_id"`
	RunID         int    `json:"run_id"`
	Status        string `json:"status"`
	StatusMessage string `json:"status_message"`
	OccurredAt    int64  `json:"occurred_at"`
	CheckedAt     int64  `json:"checked_at"`
	LatencyMs     int    `json:"latency_ms"`
}

type MonitorStatusEventDTO struct {
	ID         int    `json:"id"`
	TargetID   int    `json:"target_id"`
	RunID      *int   `json:"run_id,omitempty"`
	Level      string `json:"level"`
	Title      string `json:"title"`
	Message    string `json:"message"`
	OccurredAt int64  `json:"occurred_at"`
	Source     string `json:"source,omitempty"`
}

type MonitorStatusAnnouncementDTO struct {
	ID          int    `json:"id"`
	Content     string `json:"content"`
	PublishDate string `json:"publish_date,omitempty"`
	Type        string `json:"type,omitempty"`
	Extra       string `json:"extra,omitempty"`
}

type MonitorStatusChannelDTO struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Status     string `json:"status"`
	LatencyMs  int    `json:"latency_ms"`
	SourceKey  string `json:"source_key"`
	Visibility string `json:"visibility"`
}

type MonitorAdminOverviewDTO struct {
	Overview      MonitorStatusOverviewDTO      `json:"overview"`
	Targets       []MonitorStatusTargetDTO      `json:"targets"`
	Channels      []MonitorStatusChannelDTO     `json:"channels"`
	Events        []MonitorStatusEventDTO       `json:"events"`
	Announcements []MonitorStatusAnnouncementDTO `json:"announcements,omitempty"`
}

type MonitorPublicSummaryDTO struct {
	Overview      MonitorStatusOverviewDTO       `json:"overview"`
	Targets       []MonitorStatusTargetDTO       `json:"targets"`
	Events        []MonitorStatusEventDTO        `json:"events"`
	Announcements []MonitorStatusAnnouncementDTO `json:"announcements,omitempty"`
}
