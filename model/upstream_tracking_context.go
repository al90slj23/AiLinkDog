package model

type UpstreamTrackingContext struct {
	Id          int    `json:"id" gorm:"primaryKey;autoIncrement"`
	CycleId     int    `json:"cycle_id" gorm:"index;not null"`
	ContextType string `json:"context_type" gorm:"type:varchar(64);index;not null"`
	Content     string `json:"content" gorm:"type:text"`
	ContentMeta string `json:"content_meta" gorm:"type:text"`
	CreatedAt   int64  `json:"created_at" gorm:"autoCreateTime:milli"`
	UpdatedAt   int64  `json:"updated_at" gorm:"autoUpdateTime:milli"`
}
