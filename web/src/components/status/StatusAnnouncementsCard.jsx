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
import { Card, Empty, Space, Tag, Typography } from '@douyinfe/semi-ui';

const announcementTypeColorMap = {
  default: 'grey',
  ongoing: 'blue',
  success: 'green',
  warning: 'orange',
  error: 'red',
};

export default function StatusAnnouncementsCard({
  announcements = [],
  title = '平台公告',
}) {
  return (
    <Card>
      <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
        <Typography.Title heading={5}>{title}</Typography.Title>
        {announcements.length === 0 ? (
          <Empty description='当前没有平台公告' />
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.key || announcement.id || announcement.content}
            >
              <Space spacing='small'>
                <Typography.Text>{announcement.content}</Typography.Text>
                {announcement.type ? (
                  <Tag
                    color={
                      announcementTypeColorMap[announcement.type] || 'grey'
                    }
                  >
                    {announcement.type}
                  </Tag>
                ) : null}
              </Space>
              {announcement.extra ? (
                <Typography.Text type='secondary'>
                  {' '}
                  {announcement.extra}
                </Typography.Text>
              ) : null}
              {announcement.publishDate ? (
                <Typography.Text type='secondary'>
                  {' '}
                  {announcement.publishDate}
                </Typography.Text>
              ) : null}
            </div>
          ))
        )}
      </Space>
    </Card>
  );
}
