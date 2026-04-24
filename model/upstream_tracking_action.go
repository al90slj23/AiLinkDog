package model

type UpstreamTrackingAction struct {
	Id             int    `json:"id" gorm:"primaryKey;autoIncrement"`
	CycleId        int    `json:"cycle_id" gorm:"index;not null"`
	Title          string `json:"title" gorm:"type:varchar(255);not null"`
	Category       string `json:"category" gorm:"type:varchar(64)"`
	Recommendation string `json:"recommendation" gorm:"type:varchar(64)"`
	Priority       string `json:"priority" gorm:"type:varchar(32)"`
	Status         string `json:"status" gorm:"type:varchar(32);default:'pending'"`
	TargetArea     string `json:"target_area" gorm:"type:varchar(128)"`
	Note           string `json:"note" gorm:"type:text"`
	CreatedAt      int64  `json:"created_at" gorm:"autoCreateTime:milli"`
	UpdatedAt      int64  `json:"updated_at" gorm:"autoUpdateTime:milli"`
}
