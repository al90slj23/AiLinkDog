package controller_test

import (
	"github.com/QuantumNous/new-api/router"
	"github.com/gin-gonic/gin"
)

func setupReferralRouteRegistryRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	engine := gin.New()
	router.SetApiRouter(engine)
	return engine
}
