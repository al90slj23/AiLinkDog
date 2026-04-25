/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, useMemo, useState } from 'react';
import { API, showError } from '../../helpers';
import {
  DEFAULT_TIME_WINDOW,
  TIME_WINDOW_OPTIONS,
  normalizeStatusWindow,
  getInitialTimeWindow,
  buildStatusQueryParams,
} from './useAdminStatus';

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

function getStatusMeta(status) {
  const statusMap = {
    operational: { text: '正常', color: 'green' },
    degraded: { text: '降级', color: 'orange' },
    outage: { text: '故障', color: 'red' },
    maintenance: { text: '维护', color: 'blue' },
  };
  return statusMap[status] || statusMap.outage;
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

export { TIME_WINDOW_OPTIONS };

export default function usePublicStatus() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState({
    overview: {},
    targets: [],
    events: [],
    announcements: [],
  });
  const [windowValue, setWindowValue] = useState(() =>
    typeof window === 'undefined'
      ? DEFAULT_TIME_WINDOW
      : getInitialTimeWindow(window.location.search),
  );

  useEffect(() => {
    let mounted = true;
    const loadStatus = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get('/api/monitor/public/summary', {
          params: buildStatusQueryParams(windowValue),
          skipErrorHandler: true,
        });
        if (!res.data?.success) {
          throw new Error(res.data?.message || '获取公开服务状态失败');
        }
        if (mounted) {
          setPayload(
            res.data?.data || {
              overview: {},
              targets: [],
              events: [],
              announcements: [],
            },
          );
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError?.message || '获取公开服务状态失败';
          setError(message);
          setPayload({
            overview: {},
            targets: [],
            events: [],
            announcements: [],
          });
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

  const overview = useMemo(() => {
    const status = payload?.overview?.overall_status || 'outage';
    const meta = getStatusMeta(status);
    return {
      overallStatus: status,
      overallStatusText: meta.text,
      overallStatusColor: meta.color,
      totalServices: payload?.overview?.target_count || 0,
      affectedServices: payload?.overview?.affected_count || 0,
      averageLatency:
        typeof payload?.overview?.avg_latency_ms === 'number'
          ? `${payload.overview.avg_latency_ms.toFixed(0)} ms`
          : '--',
      lastUpdatedAt: formatTimestamp(payload?.overview?.updated_at),
      windowLabel: payload?.overview?.window || DEFAULT_TIME_WINDOW,
    };
  }, [payload.overview]);

  const serviceRows = useMemo(
    () =>
      (payload.targets || []).map((target) => {
        const meta = getStatusMeta(target?.status);
        return {
          key: target?.source_key || target?.id,
          name: target?.name || '未命名服务',
          sourceKey: target?.source_key || '--',
          statusKey: target?.status || 'outage',
          statusText: meta.text,
          statusColor: meta.color,
        };
      }),
    [payload.targets],
  );

  const events = useMemo(
    () =>
      (payload.events || []).map((event, index) => ({
        key: event?.id || index,
        time: formatTimestamp(event?.occurred_at),
        title: event?.title || '未命名事件',
        levelText: event?.level || 'info',
        message: event?.message || '',
      })),
    [payload.events],
  );

  const announcements = useMemo(
    () =>
      (payload.announcements || []).map((announcement, index) => ({
        key: announcement?.id || index,
        content: announcement?.content || '未命名公告',
        type: announcement?.type || 'default',
        extra: announcement?.extra || '',
        publishDate: announcement?.publish_date || '',
      })),
    [payload.announcements],
  );

  return {
    loading,
    error,
    windowValue,
    setWindowValue: (nextValue) =>
      setWindowValue(normalizeStatusWindow(nextValue)),
    overview,
    serviceRows,
    events,
    announcements,
  };
}
