package router

import (
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/gin-gonic/gin"
)

func SetMonitorRoutes(apiRouter *gin.RouterGroup) {
	monitorPublicRoute := apiRouter.Group("/monitor/public")
	{
		monitorPublicRoute.GET("/summary", controller.GetMonitorPublicSummary)
	}

	monitorAdminRoute := apiRouter.Group("/monitor/admin")
	monitorAdminRoute.Use(middleware.AdminAuth())
	{
		monitorAdminRoute.GET("/overview", controller.GetMonitorAdminOverview)
		monitorAdminRoute.POST("/seed", controller.SeedMonitorAdminTargets)
		monitorAdminRoute.POST("/probe/run", controller.RunMonitorAdminProbe)
	}

	monitorUserRoute := apiRouter.Group("/monitor/user")
	monitorUserRoute.Use(middleware.UserAuth())
	{
		monitorUserRoute.GET("/targets", controller.ListMonitorUserTargets)
		monitorUserRoute.POST("/targets", controller.CreateMonitorUserTarget)
		monitorUserRoute.GET("/targets/:id", controller.GetMonitorUserTargetDetail)
		monitorUserRoute.PUT("/targets/:id", controller.UpdateMonitorUserTarget)
		monitorUserRoute.DELETE("/targets/:id", controller.DeleteMonitorUserTarget)
		monitorUserRoute.GET("/targets/:id/runs", controller.ListMonitorUserTargetRuns)
		monitorUserRoute.GET("/targets/:id/events", controller.ListMonitorUserTargetEvents)
		monitorUserRoute.GET("/targets/:id/billing", controller.ListMonitorUserTargetBilling)
	}
}
