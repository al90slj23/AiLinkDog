package controller

import (
	"context"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/service"
	"github.com/gin-gonic/gin"
)

func GetMonitorPublicSummary(c *gin.Context) {
	data, err := service.BuildMonitorPublicSummary(context.Background(), c.Query("window"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, data)
}
