package router

import (
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/gin-gonic/gin"
)

func SetUpstreamTrackingRouter(apiRouter *gin.RouterGroup) {
	upstreamTrackingRoute := apiRouter.Group("/upstreamtracking")
	upstreamTrackingRoute.Use(middleware.CORS(), middleware.AdminAuth())
	{
		upstreamTrackingRoute.GET("/page", controller.GetUpstreamTrackingPageData)
		upstreamTrackingRoute.GET("/config", controller.GetUpstreamTrackingConfig)
		upstreamTrackingRoute.PUT("/config", controller.UpdateUpstreamTrackingConfig)
		upstreamTrackingRoute.GET("/cycles", controller.GetUpstreamTrackingCycles)
		upstreamTrackingRoute.POST("/cycles", controller.CreateUpstreamTrackingCycle)
		upstreamTrackingRoute.GET("/cycles/:id", controller.GetUpstreamTrackingCycle)
		upstreamTrackingRoute.GET("/cycles/:id/detail", controller.GetUpstreamTrackingCycleDetail)
		upstreamTrackingRoute.GET("/cycles/:id/contexts", controller.GetUpstreamTrackingCycleContexts)
		upstreamTrackingRoute.POST("/cycles/:id/analyze", controller.AnalyzeUpstreamTrackingCycle)
		upstreamTrackingRoute.POST("/cycles/:id/decision", controller.DecideUpstreamTrackingCycle)
		upstreamTrackingRoute.GET("/actions", controller.GetUpstreamTrackingActions)
		upstreamTrackingRoute.POST("/actions", controller.CreateUpstreamTrackingAction)
		upstreamTrackingRoute.PUT("/actions/:id", controller.UpdateUpstreamTrackingAction)
	}
}
