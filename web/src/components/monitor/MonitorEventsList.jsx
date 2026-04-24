import React from 'react';
import { Empty, List, Tag, Typography } from '@douyinfe/semi-ui';

export default function MonitorEventsList({ items = [] }) {
  if (!items.length) {
    return <Empty description='暂无 events 记录' />;
  }

  return (
    <>
      <Typography.Title heading={5}>Events</Typography.Title>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <div>
              <Tag color={item.levelColor}>{item.levelText}</Tag>
              <Typography.Text strong style={{ marginLeft: 8 }}>
                {item.title}
              </Typography.Text>
              <div>{item.message}</div>
              <Typography.Text type='tertiary'>{item.occurredAtText}</Typography.Text>
            </div>
          </List.Item>
        )}
      />
    </>
  );
}
