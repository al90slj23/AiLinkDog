package router

import (
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestUpstreamTrackingRoutesExist(t *testing.T) {
	gin.SetMode(gin.TestMode)
	engine := gin.New()
	SetApiRouter(engine)

	routes := make(map[string]struct{}, len(engine.Routes()))
	for _, routeInfo := range engine.Routes() {
		routes[routeInfo.Method+" "+routeInfo.Path] = struct{}{}
	}

		testCases := []struct {
			method string
			path   string
		}{
			{method: http.MethodGet, path: "/api/upstreamtracking/page"},
			{method: http.MethodGet, path: "/api/upstreamtracking/config"},
			{method: http.MethodPut, path: "/api/upstreamtracking/config"},
			{method: http.MethodGet, path: "/api/upstreamtracking/cycles"},
			{method: http.MethodPost, path: "/api/upstreamtracking/cycles"},
			{method: http.MethodGet, path: "/api/upstreamtracking/cycles/:id"},
			{method: http.MethodGet, path: "/api/upstreamtracking/cycles/:id/detail"},
			{method: http.MethodGet, path: "/api/upstreamtracking/cycles/:id/contexts"},
			{method: http.MethodPost, path: "/api/upstreamtracking/cycles/:id/analyze"},
			{method: http.MethodPost, path: "/api/upstreamtracking/cycles/:id/decision"},
			{method: http.MethodGet, path: "/api/upstreamtracking/actions"},
		{method: http.MethodPost, path: "/api/upstreamtracking/actions"},
		{method: http.MethodPut, path: "/api/upstreamtracking/actions/:id"},
	}

	for _, tc := range testCases {
		if _, ok := routes[tc.method+" "+tc.path]; !ok {
			t.Fatalf("expected route %s %s to exist", tc.method, tc.path)
		}
	}
}
