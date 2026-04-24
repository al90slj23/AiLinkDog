package router

import (
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestMonitorRoutesExist(t *testing.T) {
	gin.SetMode(gin.TestMode)
	engine := gin.New()
	SetApiRouter(engine)

	routes := make(map[string]struct{}, len(engine.Routes()))
	for _, routeInfo := range engine.Routes() {
		routes[routeInfo.Method+" "+routeInfo.Path] = struct{}{}
	}

	for _, route := range []string{
		http.MethodGet + " /api/monitor/public/summary",
		http.MethodGet + " /api/monitor/admin/overview",
		http.MethodPost + " /api/monitor/admin/seed",
		http.MethodPost + " /api/monitor/admin/probe/run",
		http.MethodGet + " /api/monitor/user/targets",
		http.MethodPost + " /api/monitor/user/targets",
		http.MethodGet + " /api/monitor/user/targets/:id",
		http.MethodPut + " /api/monitor/user/targets/:id",
		http.MethodDelete + " /api/monitor/user/targets/:id",
		http.MethodGet + " /api/monitor/user/targets/:id/runs",
		http.MethodGet + " /api/monitor/user/targets/:id/events",
		http.MethodGet + " /api/monitor/user/targets/:id/billing",
	} {
		_, ok := routes[route]
		require.Truef(t, ok, "expected route %s to exist", route)
	}
}
