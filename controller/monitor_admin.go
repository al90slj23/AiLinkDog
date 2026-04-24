package controller

import (
	"context"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/service"
	"github.com/gin-gonic/gin"
)

func GetMonitorAdminOverview(c *gin.Context) {
	data, err := service.BuildMonitorAdminOverview(context.Background(), c.Query("window"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, data)
}

func SeedMonitorAdminTargets(c *gin.Context) {
	created, err := service.SeedPlatformMonitorTargets(context.Background())
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, gin.H{"created": created})
}

func RunMonitorAdminProbe(c *gin.Context) {
	if err := service.RunPlatformProbeCycle(context.Background()); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, gin.H{"ran": true})
}
