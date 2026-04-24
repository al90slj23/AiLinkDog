import React from 'react';
import { Card, Empty, Space, Tag, Typography } from '@douyinfe/semi-ui';

const announcementTypeColorMap = {
  default: 'grey',
  ongoing: 'blue',
  success: 'green',
  warning: 'orange',
  error: 'red',
};

export default function StatusAnnouncementsCard({ announcements = [], title = '平台公告' }) {
  return (
    <Card>
      <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
        <Typography.Title heading={5}>{title}</Typography.Title>
        {announcements.length === 0 ? (
          <Empty description='当前没有平台公告' />
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.key || announcement.id || announcement.content}>
              <Space spacing='small'>
                <Typography.Text>{announcement.content}</Typography.Text>
                {announcement.type ? (
                  <Tag color={announcementTypeColorMap[announcement.type] || 'grey'}>
                    {announcement.type}
                  </Tag>
                ) : null}
              </Space>
              {announcement.extra ? (
                <Typography.Text type='secondary'> {announcement.extra}</Typography.Text>
              ) : null}
              {announcement.publishDate ? (
                <Typography.Text type='secondary'> {announcement.publishDate}</Typography.Text>
              ) : null}
            </div>
          ))
        )}
      </Space>
    </Card>
  );
}
