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
import React from 'react';
import { Card, Select, Space, Tag, Typography } from '@douyinfe/semi-ui';
import { TIME_WINDOW_OPTIONS } from '../../../hooks/status/useAdminStatus';

const overviewItems = (overview) => [
  { label: '服务总数', value: overview.totalServices ?? 0 },
  { label: '受影响', value: overview.affectedServices ?? 0 },
  { label: '平均延迟', value: overview.averageLatency ?? '--' },
  { label: '当前状态', value: overview.overallStatusText ?? '--' },
];

const StatusAdminOverview = ({
  overview,
  windowValue,
  onWindowChange,
  error,
}) => (
  <Card>
    <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
      <Typography.Title heading={4} style={{ margin: 0 }}>
        ALD 服务状态中心
      </Typography.Title>
      <Typography.Text type='secondary'>
        面向管理员展示当前服务巡检结果，优先接入后端最小状态数据。
      </Typography.Text>
      <Select
        optionList={TIME_WINDOW_OPTIONS}
        value={windowValue}
        onChange={onWindowChange}
      />
      <Space wrap>
        {overviewItems(overview).map((item) => (
          <Tag key={item.label} color='blue' shape='circle'>
            {item.label} {item.value}
          </Tag>
        ))}
      </Space>
      <Typography.Text>
        最后更新时间：{overview.lastUpdatedAt || '--'}
      </Typography.Text>
      {error ? <Typography.Text type='danger'>{error}</Typography.Text> : null}
    </Space>
  </Card>
);

export default StatusAdminOverview;
