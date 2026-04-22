package router

import (
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestReferralUserRoutesExist(t *testing.T) {
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
		{method: http.MethodGet, path: "/api/referral/statistics"},
		{method: http.MethodGet, path: "/api/referral/balance"},
		{method: http.MethodGet, path: "/api/referral/plans"},
		{method: http.MethodGet, path: "/api/referral/links"},
		{method: http.MethodPost, path: "/api/referral/links"},
		{method: http.MethodGet, path: "/api/referral/commissions"},
		{method: http.MethodGet, path: "/api/referral/invitees"},
		{method: http.MethodGet, path: "/api/referral/withdrawals"},
		{method: http.MethodPost, path: "/api/referral/withdrawals"},
	}

	for _, tc := range testCases {
		if _, ok := routes[tc.method+" "+tc.path]; !ok {
			t.Fatalf("expected route %s %s to exist", tc.method, tc.path)
		}
	}
}
