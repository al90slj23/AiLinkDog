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
              <Typography.Text type='tertiary'>
                {item.occurredAtText}
              </Typography.Text>
            </div>
          </List.Item>
        )}
      />
    </>
  );
}
