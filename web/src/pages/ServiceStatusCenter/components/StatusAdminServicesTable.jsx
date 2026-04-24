import React from 'react';
import { Card, Empty, Space, Tag, Typography } from '@douyinfe/semi-ui';

const StatusAdminServicesTable = ({ rows }) => (
  <Card>
    <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
      <Typography.Title heading={5}>服务状态</Typography.Title>
      {rows.length === 0 ? (
        <Empty description='暂无服务状态数据' />
      ) : (
        rows.map((item) => (
          <div key={item.key}>
            <Typography.Text>{item.name}</Typography.Text>
            <Typography.Text type='secondary'> {item.sourceKey || '--'}</Typography.Text>
            <Tag color={item.statusColor} shape='circle'>
              {item.statusText}
            </Tag>
          </div>
        ))
      )}
    </Space>
  </Card>
);

export default StatusAdminServicesTable;
