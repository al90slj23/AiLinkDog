import { useEffect, useMemo, useState } from 'react';
import { API, showError } from '../../helpers';

function formatTimestamp(seconds) {
  if (!seconds) {
    return '--';
  }
  const value = Number(seconds);
  if (!Number.isFinite(value)) {
    return '--';
  }
  return new Date(value * 1000).toLocaleString('zh-CN', { hour12: false });
}

function formatMicros(value, currency = 'USD') {
  if (typeof value !== 'number') {
    return '--';
  }
  const amount = value / 1000000;
  if (currency.toUpperCase() === 'USD') {
    return `$${amount.toFixed(6)}`;
  }
  return `${amount.toFixed(6)} ${currency}`;
}

function getStatusMeta(status) {
  switch (status) {
    case 'enabled':
    case 'operational':
      return { text: '运行中', color: 'green' };
    case 'disabled':
      return { text: '已停用', color: 'grey' };
    case 'degraded':
      return { text: '降级', color: 'orange' };
    case 'outage':
    case 'failed':
      return { text: '异常', color: 'red' };
    case 'success':
      return { text: '成功', color: 'green' };
    case 'info':
      return { text: '信息', color: 'blue' };
    case 'warning':
      return { text: '告警', color: 'orange' };
    case 'error':
      return { text: '错误', color: 'red' };
    default:
      return { text: status || '--', color: 'blue' };
  }
}

function normalizeTarget(target = {}) {
  const statusMeta = getStatusMeta(target.status);
  return {
    id: target.id,
    name: target.name || '未命名监控',
    channelType: target.channel_type || '--',
    baseUrl: target.base_url || '--',
    model: target.model || '--',
    groupName: target.group_name || '--',
    tag: target.tag || '--',
    probeIntervalSeconds: target.probe_interval_seconds || 0,
    status: target.status || '',
    statusText: statusMeta.text,
    statusColor: statusMeta.color,
    enabled: Boolean(target.enabled),
  };
}

function normalizeRun(item = {}) {
  const statusMeta = getStatusMeta(item.status);
  return {
    id: item.id,
    status: item.status || '',
    statusText: statusMeta.text,
    statusColor: statusMeta.color,
    startedAtText: formatTimestamp(item.started_at),
    finishedAtText: formatTimestamp(item.finished_at),
    durationText:
      typeof item.duration_ms === 'number' ? `${item.duration_ms} ms` : '--',
  };
}

function normalizeEvent(item = {}) {
  const levelMeta = getStatusMeta(item.level);
  return {
    id: item.id,
    level: item.level || '',
    levelText: levelMeta.text,
    levelColor: levelMeta.color,
    title: item.title || '未命名事件',
    message: item.message || '--',
    occurredAtText: formatTimestamp(item.occurred_at),
  };
}

function normalizeBilling(item = {}) {
  return {
    id: item.id,
    provider: item.provider || '--',
    modelName: item.model_name || '--',
    requestType: item.request_type || '--',
    totalTokens:
      typeof item.total_tokens === 'number'
        ? item.total_tokens.toLocaleString()
        : '--',
    costText: formatMicros(item.cost_amount_micros, item.currency || 'USD'),
    occurredAtText: formatTimestamp(item.occurred_at),
  };
}

export default function useMonitorTargetDetail(id) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState({ target: null, runs: [], events: [], billing: [] });

  const loadDetail = async () => {
    if (!id) {
      setDetail({ target: null, runs: [], events: [], billing: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [targetRes, runsRes, eventsRes, billingRes] = await Promise.all([
        API.get(`/api/monitor/user/targets/${id}`, { skipErrorHandler: true }),
        API.get(`/api/monitor/user/targets/${id}/runs`, { skipErrorHandler: true }),
        API.get(`/api/monitor/user/targets/${id}/events`, { skipErrorHandler: true }),
        API.get(`/api/monitor/user/targets/${id}/billing`, { skipErrorHandler: true }),
      ]);

      const responses = [targetRes, runsRes, eventsRes, billingRes];
      const failed = responses.find((res) => !res.data?.success);
      if (failed) {
        throw new Error(failed.data?.message || '获取监控详情失败');
      }

      setDetail({
        target: targetRes.data?.data || null,
        runs: Array.isArray(runsRes.data?.data) ? runsRes.data.data : [],
        events: Array.isArray(eventsRes.data?.data) ? eventsRes.data.data : [],
        billing: Array.isArray(billingRes.data?.data) ? billingRes.data.data : [],
      });
    } catch (error) {
      const message = error?.message || '获取监控详情失败';
      setError(message);
      setDetail({ target: null, runs: [], events: [], billing: [] });
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  return {
    loading,
    error,
    target: useMemo(() => normalizeTarget(detail.target || {}), [detail.target]),
    runs: useMemo(() => detail.runs.map(normalizeRun), [detail.runs]),
    events: useMemo(() => detail.events.map(normalizeEvent), [detail.events]),
    billing: useMemo(() => detail.billing.map(normalizeBilling), [detail.billing]),
    refresh: loadDetail,
  };
}
