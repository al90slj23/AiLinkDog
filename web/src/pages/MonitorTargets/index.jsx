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
import {
  Banner,
  Button,
  Card,
  Empty,
  Space,
  Table,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom';
import useMonitorTargets from '../../hooks/monitor/useMonitorTargets';

export default function MonitorTargets() {
  const { loading, error, items } = useMonitorTargets();

  return (
    <div className='px-4 py-6 md:px-6'>
      <Space vertical spacing='large' style={{ width: '100%' }}>
        <Card
          title='我的监控'
          extra={
            <Link to='/console/monitor-targets/new'>
              <Button theme='solid'>新建监控</Button>
            </Link>
          }
        >
          <Typography.Paragraph>
            管理你自己的自定义监控目标，查看基础状态与详情。
          </Typography.Paragraph>
          {error ? <Banner type='danger' description={error} /> : null}
        </Card>

        {loading ? <Typography.Text>loading</Typography.Text> : null}

        <Card>
          {items.length ? (
            <Table
              dataSource={items}
              pagination={false}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  render: (text, record) => (
                    <Link to={`/console/monitor-targets/${record.id}`}>
                      {text}
                    </Link>
                  ),
                },
                { title: 'Channel Type', dataIndex: 'channelType' },
                { title: 'Model', dataIndex: 'model' },
                {
                  title: '当前状态',
                  dataIndex: 'statusText',
                  render: (text, record) => (
                    <Tag color={record.statusColor}>{text}</Tag>
                  ),
                },
                { title: 'Tag', dataIndex: 'tag' },
                {
                  title: '操作',
                  render: (_, record) => (
                    <Space>
                      <Link to={`/console/monitor-targets/${record.id}`}>
                        详情
                      </Link>
                      <Link to={`/console/monitor-targets/${record.id}/edit`}>
                        编辑
                      </Link>
                    </Space>
                  ),
                },
              ]}
            />
          ) : (
            <Empty description='暂无监控目标' />
          )}
        </Card>
      </Space>
    </div>
  );
}
