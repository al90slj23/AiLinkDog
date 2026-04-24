import React from 'react';
import { Card, Empty, Space, Typography } from '@douyinfe/semi-ui';

const StatusPublicEventsList = ({ events }) => (
  <Card>
    <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
      <Typography.Title heading={5}>最近事件</Typography.Title>
      {events.length === 0 ? (
        <Empty description='暂无公开事件' />
      ) : (
        events.map((event) => (
          <div key={event.key}>
            <Typography.Text>{event.title}</Typography.Text>
            <Typography.Text type='secondary'> {event.message}</Typography.Text>
            <Typography.Text type='secondary'> {event.time}</Typography.Text>
          </div>
        ))
      )}
    </Space>
  </Card>
);

export default StatusPublicEventsList;
