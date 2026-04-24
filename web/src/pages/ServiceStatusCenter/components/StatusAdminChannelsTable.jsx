import React from 'react';
import { Card, Empty, Space, Tag, Typography } from '@douyinfe/semi-ui';

const StatusAdminChannelsTable = ({ rows }) => (
  <Card>
    <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
      <Typography.Title heading={5}>通道状态</Typography.Title>
      {rows.length === 0 ? (
        <Empty description='暂无通道状态数据' />
      ) : (
        rows.map((item) => (
          <div key={item.key}>
            <Typography.Text>{item.name}</Typography.Text>
            <Tag color={item.statusColor} shape='circle'>
              {item.statusText}
            </Tag>
            <Typography.Text type='secondary'> {item.sourceKey}</Typography.Text>
            <Typography.Text> {item.latencyText}</Typography.Text>
          </div>
        ))
      )}
    </Space>
  </Card>
);

export default StatusAdminChannelsTable;
