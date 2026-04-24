import React from 'react';
import { Banner, Card, Select, Space, Tag, Typography } from '@douyinfe/semi-ui';
import { TIME_WINDOW_OPTIONS } from '../../../hooks/status/usePublicStatus';

const StatusPublicOverview = ({ overview, windowValue, onWindowChange, error }) => (
  <Card>
    <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
      <Typography.Title style={{ margin: 0 }}>ALD 服务状态</Typography.Title>
      <Typography.Paragraph type='secondary' style={{ margin: 0 }}>
        展示公开服务健康状态，按后端当前可返回的最小字段进行渲染。
      </Typography.Paragraph>
      <Select optionList={TIME_WINDOW_OPTIONS} value={windowValue} onChange={onWindowChange} />
      <Space wrap>
        <Tag color={overview.overallStatusColor || 'red'} shape='circle'>
          当前状态 {overview.overallStatusText ?? '--'}
        </Tag>
        <Tag color='orange' shape='circle'>
          受影响 {overview.affectedServices ?? 0}
        </Tag>
        <Tag color='blue' shape='circle'>
          服务总数 {overview.totalServices ?? 0}
        </Tag>
        <Tag color='cyan' shape='circle'>
          平均延迟 {overview.averageLatency ?? '--'}
        </Tag>
      </Space>
      <Typography.Text>最后更新时间：{overview.lastUpdatedAt || '--'}</Typography.Text>
      <Banner
        type={error ? 'danger' : 'info'}
        bordered
        fullMode={false}
        description={error || '当前显示的是系统最新监控快照。'}
      />
    </Space>
  </Card>
);

export default StatusPublicOverview;
