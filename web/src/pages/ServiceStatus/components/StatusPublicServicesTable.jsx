import React from 'react';
import { Card, Empty, Space, Tag, Typography } from '@douyinfe/semi-ui';

const StatusPublicServicesTable = ({ rows }) => (
  <Card>
    <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
      <Typography.Title heading={5}>服务列表</Typography.Title>
      {rows.length === 0 ? (
        <Empty description='暂无公开服务状态' />
      ) : (
        rows.map((item) => (
          <div key={item.key}>
            <Typography.Text>{item.name}</Typography.Text>
            <Tag color={item.statusColor} shape='circle'>
              {item.statusText}
            </Tag>
            <Typography.Text type='secondary'>
              {' '}
              {item.sourceKey || '--'}
            </Typography.Text>
          </div>
        ))
      )}
    </Space>
  </Card>
);

export default StatusPublicServicesTable;
