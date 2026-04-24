package model

import (
	"errors"

	"github.com/QuantumNous/new-api/common"

	"gorm.io/gorm"
)

type MonitorSourceType string

const (
	MonitorSourceTypePlatform MonitorSourceType = "platform"
	MonitorSourceTypeCustom   MonitorSourceType = "custom"
)

type MonitorVisibility string

const (
	MonitorVisibilityPublic  MonitorVisibility = "public"
	MonitorVisibilityPrivate MonitorVisibility = "private"
)

type MonitorLifecycleStatus string

const (
	MonitorLifecycleStatusEnabled  MonitorLifecycleStatus = "enabled"
	MonitorLifecycleStatusDisabled MonitorLifecycleStatus = "disabled"
)

type MonitorTarget struct {
	Id                   int                    `json:"id"`
	Name                 string                 `json:"name" gorm:"type:varchar(128);not null"`
	SourceType           MonitorSourceType      `json:"source_type" gorm:"type:varchar(32);not null;index:idx_monitor_target_source,priority:1"`
	OwnerUserID          *int                   `json:"owner_user_id,omitempty" gorm:"index:idx_monitor_target_owner_user_id"`
	Visibility           MonitorVisibility      `json:"visibility" gorm:"type:varchar(16);not null;index:idx_monitor_target_visibility"`
	SourceKey            string                 `json:"source_key" gorm:"type:varchar(128);not null;uniqueIndex:uk_monitor_target_source_key,priority:2"`
	SourceName           string                 `json:"source_name" gorm:"type:varchar(128);not null;default:''"`
	BaseURL              string                 `json:"base_url" gorm:"type:varchar(255);not null;default:''"`
	ChannelType          string                 `json:"channel_type" gorm:"type:varchar(64);not null;default:'internal-http'"`
	APIKeyEncrypted      string                 `json:"-" gorm:"column:api_key_encrypted;type:text;not null;default:''"`
	APIKeyMasked         string                 `json:"api_key,omitempty" gorm:"-"`
	Model                string                 `json:"model" gorm:"type:varchar(255);not null;default:''"`
	GroupName            string                 `json:"group_name" gorm:"type:varchar(64);not null;default:''"`
	Tag                  string                 `json:"tag" gorm:"type:varchar(64);not null;default:''"`
	ProbeIntervalSeconds int                    `json:"probe_interval_seconds" gorm:"not null;default:60"`
	Enabled              bool                   `json:"enabled" gorm:"not null;default:true"`
	TimeoutSeconds       int                    `json:"timeout_seconds" gorm:"not null;default:5"`
	Status               MonitorLifecycleStatus `json:"status" gorm:"type:varchar(16);not null;default:'enabled';index"`
	CreatedAt            int64                  `json:"created_at" gorm:"bigint"`
	UpdatedAt            int64                  `json:"updated_at" gorm:"bigint"`
}

func (MonitorTarget) TableName() string {
	return "monitor_targets"
}

func (t *MonitorTarget) BeforeCreate(tx *gorm.DB) error {
	now := common.GetTimestamp()
	t.CreatedAt = now
	t.UpdatedAt = now
	return t.validate()
}

func (t *MonitorTarget) BeforeUpdate(tx *gorm.DB) error {
	t.UpdatedAt = common.GetTimestamp()
	return t.validate()
}

func (t *MonitorTarget) validate() error {
	if t.Name == "" {
		return errors.New("monitor target name is required")
	}
	if t.SourceKey == "" {
		return errors.New("monitor target source key is required")
	}
	if t.SourceType != MonitorSourceTypePlatform && t.SourceType != MonitorSourceTypeCustom {
		return errors.New("monitor target source type must be platform or custom")
	}
	if t.SourceType == MonitorSourceTypeCustom {
		if t.OwnerUserID == nil || *t.OwnerUserID <= 0 {
			return errors.New("monitor target owner user id is required for custom source type")
		}
		if t.Visibility == "" {
			t.Visibility = MonitorVisibilityPrivate
		}
	} else {
		if t.OwnerUserID != nil {
			return errors.New("monitor target owner user id is only allowed for custom source type")
		}
		if t.Visibility == "" {
			t.Visibility = MonitorVisibilityPublic
		}
	}
	if t.Visibility != MonitorVisibilityPublic && t.Visibility != MonitorVisibilityPrivate {
		return errors.New("monitor target visibility must be public or private")
	}
	if t.SourceType == MonitorSourceTypeCustom && t.Visibility != MonitorVisibilityPrivate {
		return errors.New("custom monitor target visibility must be private")
	}
	if t.ChannelType == "" {
		t.ChannelType = "internal-http"
	}
	if t.ProbeIntervalSeconds <= 0 {
		t.ProbeIntervalSeconds = 60
	}
	if t.TimeoutSeconds <= 0 {
		t.TimeoutSeconds = 5
	}
	if t.Status == "" {
		t.Status = MonitorLifecycleStatusEnabled
	} else if t.Status != MonitorLifecycleStatusEnabled && t.Status != MonitorLifecycleStatusDisabled {
		return errors.New("monitor target status must be enabled or disabled")
	}
	return nil
}
