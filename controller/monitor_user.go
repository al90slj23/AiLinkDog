package controller

import (
	"context"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/service"
	"github.com/gin-gonic/gin"
)

type monitorUserTargetRequest struct {
	Name                 string `json:"name"`
	ChannelType          string `json:"channel_type"`
	BaseURL              string `json:"base_url"`
	APIKey               string `json:"api_key"`
	Model                string `json:"model"`
	GroupName            string `json:"group_name"`
	Tag                  string `json:"tag"`
	ProbeIntervalSeconds int    `json:"probe_interval_seconds"`
	Enabled              bool   `json:"enabled"`
}

func ListMonitorUserTargets(c *gin.Context) {
	items, err := service.ListCustomMonitorTargets(c.GetInt("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, items)
}

func CreateMonitorUserTarget(c *gin.Context) {
	var req monitorUserTargetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiError(c, err)
		return
	}
	item, err := service.CreateCustomMonitorTarget(context.Background(), service.CreateCustomMonitorTargetInput{
		OwnerUserID:          c.GetInt("id"),
		Name:                 req.Name,
		ChannelType:          req.ChannelType,
		BaseURL:              req.BaseURL,
		APIKey:               req.APIKey,
		Model:                req.Model,
		GroupName:            req.GroupName,
		Tag:                  req.Tag,
		ProbeIntervalSeconds: req.ProbeIntervalSeconds,
		Enabled:              req.Enabled,
	})
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, item)
}

func UpdateMonitorUserTarget(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	var req monitorUserTargetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiError(c, err)
		return
	}
	item, err := service.UpdateCustomMonitorTarget(context.Background(), c.GetInt("id"), id, service.UpdateCustomMonitorTargetInput{
		Name:                 req.Name,
		BaseURL:              req.BaseURL,
		APIKey:               req.APIKey,
		Model:                req.Model,
		GroupName:            req.GroupName,
		Tag:                  req.Tag,
		ProbeIntervalSeconds: req.ProbeIntervalSeconds,
		Enabled:              req.Enabled,
	})
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, item)
}

func DeleteMonitorUserTarget(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	if err := service.DeleteCustomMonitorTarget(context.Background(), c.GetInt("id"), id); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, gin.H{"deleted": true})
}

func GetMonitorUserTargetDetail(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	item, err := service.GetCustomMonitorTarget(c.GetInt("id"), id)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, item)
}

func ListMonitorUserTargetRuns(c *gin.Context) {
	listMonitorUserArtifacts(c, service.ListCustomMonitorRuns)
}

func ListMonitorUserTargetEvents(c *gin.Context) {
	listMonitorUserArtifacts(c, service.ListCustomMonitorEvents)
}

func ListMonitorUserTargetBilling(c *gin.Context) {
	listMonitorUserArtifacts(c, service.ListCustomMonitorBillingRecords)
}

func listMonitorUserArtifacts[T any](c *gin.Context, fetcher func(int, int) ([]T, error)) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.ApiError(c, err)
		return
	}
	items, err := fetcher(c.GetInt("id"), id)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, items)
}
