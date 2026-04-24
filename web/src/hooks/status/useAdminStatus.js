import { useEffect, useMemo, useState } from 'react';
import { API, showError } from '../../helpers';

export const DEFAULT_TIME_WINDOW = '24h';

export const TIME_WINDOW_OPTIONS = [
  { label: '24 小时', value: '24h' },
  { label: '7 天', value: '7d' },
  { label: '30 天', value: '30d' },
];

const VALID_TIME_WINDOWS = new Set(TIME_WINDOW_OPTIONS.map((item) => item.value));

const STATUS_META_MAP = {
  operational: { text: '正常', color: 'green', rank: 0 },
  degraded: { text: '降级', color: 'orange', rank: 1 },
  outage: { text: '故障', color: 'red', rank: 2 },
  maintenance: { text: '维护', color: 'blue', rank: 1 },
};

function toQueryString(search) {
  if (!search) {
    return '';
  }
  return search.startsWith('?') ? search : `?${search}`;
}

export function normalizeStatusWindow(value) {
  return VALID_TIME_WINDOWS.has(value) ? value : DEFAULT_TIME_WINDOW;
}

export function getInitialTimeWindow(search = '') {
  const params = new URLSearchParams(toQueryString(search));
  return normalizeStatusWindow(params.get('window'));
}

export function buildStatusQueryParams(windowValue) {
  const normalizedWindow = normalizeStatusWindow(windowValue);
  if (normalizedWindow === DEFAULT_TIME_WINDOW) {
    return {};
  }
  return { window: normalizedWindow };
}

function getStatusKey(rawStatus) {
  if (typeof rawStatus === 'string' && STATUS_META_MAP[rawStatus]) {
    return rawStatus;
  }
  return 'outage';
}

function formatTimestamp(value) {
  if (!value) {
    return '--';
  }
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }
  return date.toLocaleString('zh-CN', { hour12: false });
}

function normalizeTargets(targets = []) {
  return targets.map((target) => {
    const statusKey = getStatusKey(target?.status);
    const statusMeta = STATUS_META_MAP[statusKey] || STATUS_META_MAP.outage;
    return {
      key: target?.source_key || target?.id,
      name: target?.name || '未命名服务',
      sourceKey: target?.source_key || '--',
      visibility: target?.visibility || 'private',
      statusKey,
      statusText: statusMeta.text,
      statusColor: statusMeta.color,
      statusRank: statusMeta.rank,
    };
  });
}

function normalizeChannels(channels = []) {
  return channels.map((channel) => {
    const statusKey = getStatusKey(channel?.status);
    const statusMeta = STATUS_META_MAP[statusKey] || STATUS_META_MAP.outage;
    return {
      key: channel?.source_key || channel?.id,
      name: channel?.name || '未命名通道',
      sourceKey: channel?.source_key || '--',
      statusKey,
      statusText: statusMeta.text,
      statusColor: statusMeta.color,
      statusRank: statusMeta.rank,
      latencyText:
        typeof channel?.latency_ms === 'number' ? `${channel.latency_ms} ms` : '--',
      visibility: channel?.visibility || 'private',
    };
  });
}

function normalizeEvents(events = []) {
  return events.map((event, index) => ({
    key: event?.id || index,
    time: formatTimestamp(event?.occurred_at),
    title: event?.title || '未命名事件',
    levelText: event?.level || 'info',
    message: event?.message || '',
    source: event?.source || 'monitor',
  }));
}

function normalizeAnnouncements(announcements = []) {
  return announcements.map((announcement, index) => ({
    key: announcement?.id || index,
    content: announcement?.content || '未命名公告',
    type: announcement?.type || 'default',
    extra: announcement?.extra || '',
    publishDate: announcement?.publish_date || '',
  }));
}

function buildOverview(overview = {}) {
  const overallStatus = getStatusKey(overview?.overall_status);
  const overallMeta = STATUS_META_MAP[overallStatus] || STATUS_META_MAP.outage;
  return {
    totalServices: overview?.target_count || 0,
    affectedServices: overview?.affected_count || 0,
    averageLatency: typeof overview?.avg_latency_ms === 'number' ? `${overview.avg_latency_ms.toFixed(0)} ms` : '--',
    windowLabel: overview?.window || DEFAULT_TIME_WINDOW,
    overallStatus,
    overallStatusText: overallMeta.text,
    overallStatusColor: overallMeta.color,
    lastUpdatedAt: formatTimestamp(overview?.updated_at),
  };
}

function syncWindowToLocation(windowValue) {
  if (typeof window === 'undefined') {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  if (windowValue === DEFAULT_TIME_WINDOW) {
    params.delete('window');
  } else {
    params.set('window', windowValue);
  }
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
  window.history.replaceState(window.history.state, '', nextUrl);
}

export function useMonitorStatusData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState({ overview: {}, targets: [], channels: [], events: [], announcements: [] });
  const [windowValue, setWindowValue] = useState(() =>
    typeof window === 'undefined' ? DEFAULT_TIME_WINDOW : getInitialTimeWindow(window.location.search),
  );

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await API.get('/api/monitor/admin/overview', {
          params: buildStatusQueryParams(windowValue),
          skipErrorHandler: true,
        });
        if (!res.data?.success) {
          throw new Error(res.data?.message || '获取服务状态失败');
        }
        if (mounted) {
           setPayload(res.data?.data || { overview: {}, targets: [], channels: [], events: [], announcements: [] });
        }
      } catch (error) {
        if (mounted) {
          const message = error?.message || '获取服务状态失败';
          setError(message);
          setPayload({ overview: {}, targets: [], channels: [], events: [], announcements: [] });
          showError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    syncWindowToLocation(windowValue);
    loadStatus();

    return () => {
      mounted = false;
    };
  }, [windowValue]);

  const serviceRows = useMemo(() => normalizeTargets(payload.targets), [payload.targets]);
  const channelRows = useMemo(() => normalizeChannels(payload.channels), [payload.channels]);
  const events = useMemo(() => normalizeEvents(payload.events), [payload.events]);
  const announcements = useMemo(() => normalizeAnnouncements(payload.announcements), [payload.announcements]);
  const overview = useMemo(() => buildOverview(payload.overview), [payload.overview]);

  return {
    loading,
    error,
    windowValue,
    setWindowValue: (nextValue) => setWindowValue(normalizeStatusWindow(nextValue)),
    overview,
    serviceRows,
    channelRows,
    events,
    announcements,
  };
}

export default function useAdminStatus() {
  return useMonitorStatusData();
}
