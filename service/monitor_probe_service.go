package service

import (
	"context"
	"net/http"
	"time"

	"github.com/QuantumNous/new-api/model"
)

type ProbeContext struct {
	Endpoint       string
	TimeoutSeconds int
}

type ProbeResult struct {
	Success        bool
	HTTPStatusCode int
	Latency        time.Duration
	CheckedAt      time.Time
	Error          string
	Summary        map[string]any
}

type ProbeExecutor interface {
	Execute(ctx context.Context, target model.MonitorTarget, probeCtx ProbeContext) ProbeResult
}

type ProbeExecutorFunc func(ctx context.Context, target model.MonitorTarget, probeCtx ProbeContext) ProbeResult

func (f ProbeExecutorFunc) Execute(ctx context.Context, target model.MonitorTarget, probeCtx ProbeContext) ProbeResult {
	return f(ctx, target, probeCtx)
}

var defaultProbeExecutor ProbeExecutor = ProbeExecutorFunc(func(ctx context.Context, target model.MonitorTarget, probeCtx ProbeContext) ProbeResult {
	start := time.Now()
	request, err := http.NewRequestWithContext(ctx, http.MethodHead, probeCtx.Endpoint, nil)
	if err != nil {
		return ProbeResult{CheckedAt: time.Now(), Error: err.Error()}
	}
	client := &http.Client{Timeout: time.Duration(probeCtx.TimeoutSeconds) * time.Second}
	resp, err := client.Do(request)
	if err != nil {
		return ProbeResult{CheckedAt: time.Now(), Error: err.Error()}
	}
	defer resp.Body.Close()
	success := resp.StatusCode >= http.StatusOK && resp.StatusCode < http.StatusBadRequest
	return ProbeResult{
		Success:        success,
		HTTPStatusCode: resp.StatusCode,
		Latency:        time.Since(start),
		CheckedAt:      time.Now(),
		Summary: map[string]any{
			"endpoint": probeCtx.Endpoint,
		},
	}
})

func resetProbeExecutorForTest(t interface{ Cleanup(func()) }, executor ProbeExecutor) {
	previous := defaultProbeExecutor
	defaultProbeExecutor = executor
	t.Cleanup(func() {
		defaultProbeExecutor = previous
	})
}

func BuildProbeContext(target model.MonitorTarget) ProbeContext {
	timeoutSeconds := 5
	if target.TimeoutSeconds > 0 {
		timeoutSeconds = target.TimeoutSeconds
	}
	endpoint := target.SourceName
	if endpoint == "" {
		endpoint = target.SourceKey
	}
	if target.BaseURL != "" {
		endpoint = target.BaseURL
	}
	if endpoint == "" {
		endpoint = "http://127.0.0.1"
	}
	return ProbeContext{Endpoint: endpoint, TimeoutSeconds: timeoutSeconds}
}

func DeriveMonitorServiceStatus(result ProbeResult) (model.MonitorServiceStatus, string, model.MonitorEventLevel) {
	if !result.Success {
		if result.HTTPStatusCode > 0 {
			return model.MonitorServiceStatusOutage, "Probe failed with HTTP status " + http.StatusText(result.HTTPStatusCode), model.MonitorEventLevelError
		}
		if result.Error != "" {
			return model.MonitorServiceStatusOutage, result.Error, model.MonitorEventLevelError
		}
		return model.MonitorServiceStatusOutage, "Probe failed", model.MonitorEventLevelError
	}
	if result.HTTPStatusCode >= http.StatusTooManyRequests {
		return model.MonitorServiceStatusDegraded, "Probe returned HTTP status " + http.StatusText(result.HTTPStatusCode), model.MonitorEventLevelWarning
	}
	if result.HTTPStatusCode >= http.StatusBadRequest {
		return model.MonitorServiceStatusOutage, "Probe returned HTTP status " + http.StatusText(result.HTTPStatusCode), model.MonitorEventLevelError
	}
	return model.MonitorServiceStatusOperational, "Probe returned HTTP status " + http.StatusText(result.HTTPStatusCode), model.MonitorEventLevelInfo
}
