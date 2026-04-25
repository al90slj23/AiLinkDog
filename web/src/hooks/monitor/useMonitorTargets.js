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

function getStatusMeta(status) {
  switch (status) {
    case 'enabled':
    case 'operational':
    case 'success':
      return { text: '运行中', color: 'green' };
    case 'disabled':
      return { text: '已停用', color: 'grey' };
    case 'degraded':
      return { text: '降级', color: 'orange' };
    case 'outage':
    case 'failed':
      return { text: '异常', color: 'red' };
    default:
      return { text: status || '--', color: 'blue' };
  }
}

function normalizeTarget(item = {}) {
  const statusMeta = getStatusMeta(item.status);
  return {
    id: item.id,
    key: item.id,
    name: item.name || '未命名监控',
    channelType: item.channel_type || '--',
    model: item.model || '--',
    status: item.status || '',
    statusText: statusMeta.text,
    statusColor: statusMeta.color,
    tag: item.tag || '--',
    enabled: Boolean(item.enabled),
  };
}

export default function useMonitorTargets() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [targets, setTargets] = useState([]);

  const loadTargets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/api/monitor/user/targets', {
        skipErrorHandler: true,
      });
      if (!res.data?.success) {
        throw new Error(res.data?.message || '获取监控列表失败');
      }
      setTargets(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      const message = error?.message || '获取监控列表失败';
      setError(message);
      setTargets([]);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTargets();
  }, []);

  return {
    loading,
    error,
    items: useMemo(() => targets.map(normalizeTarget), [targets]),
    refresh: loadTargets,
  };
}
