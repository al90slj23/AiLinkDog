package service

import (
	"context"

	"github.com/QuantumNous/new-api/model"
	"gorm.io/gorm"
)

var platformMonitorSeeds = []model.MonitorTarget{
	{
		Name:       "API Gateway",
		SourceType: model.MonitorSourceTypePlatform,
		Visibility: model.MonitorVisibilityPublic,
		SourceKey:  "gateway-core",
		SourceName: "gateway-core",
		BaseURL:    "http://127.0.0.1:3000/",
		Status:     model.MonitorLifecycleStatusEnabled,
	},
	{
		Name:       "Console",
		SourceType: model.MonitorSourceTypePlatform,
		Visibility: model.MonitorVisibilityPrivate,
		SourceKey:  "console-core",
		SourceName: "console-core",
		BaseURL:    "http://127.0.0.1:3000/console",
		Status:     model.MonitorLifecycleStatusEnabled,
	},
	{
		Name:       "Default Model Routing",
		SourceType: model.MonitorSourceTypePlatform,
		Visibility: model.MonitorVisibilityPrivate,
		SourceKey:  "default-model-routing",
		SourceName: "default-model-routing",
		BaseURL:    "http://127.0.0.1:3000/api/status",
		Status:     model.MonitorLifecycleStatusEnabled,
	},
}

func SeedPlatformMonitorTargets(ctx context.Context) (int, error) {
	_ = ctx
	created := 0
	for _, seed := range platformMonitorSeeds {
		var existing model.MonitorTarget
		err := model.DB.Where("source_key = ?", seed.SourceKey).First(&existing).Error
		if err == nil {
			continue
		}
		if err != nil && err != gorm.ErrRecordNotFound {
			return created, err
		}
		if err := model.DB.Create(&seed).Error; err != nil {
			return created, err
		}
		created++
	}
	return created, nil
}
