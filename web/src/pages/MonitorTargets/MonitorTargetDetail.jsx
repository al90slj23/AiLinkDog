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
  Col,
  Descriptions,
  Row,
  Space,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MonitorBillingTable from '../../components/monitor/MonitorBillingTable';
import MonitorEventsList from '../../components/monitor/MonitorEventsList';
import MonitorRunsTable from '../../components/monitor/MonitorRunsTable';
import useMonitorTargetDetail from '../../hooks/monitor/useMonitorTargetDetail';

export default function MonitorTargetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, target, runs, events, billing } =
    useMonitorTargetDetail(id);

  const descriptionData = [
    { key: 'name', value: target.name },
    { key: 'channel', value: target.channelType },
    { key: 'model', value: target.model },
    { key: 'group', value: target.groupName },
    { key: 'tag', value: target.tag },
    { key: 'baseUrl', value: target.baseUrl },
    { key: 'interval', value: `${target.probeIntervalSeconds || 0} 秒` },
  ];

  return (
    <div className='px-4 py-6 md:px-6'>
      <Space vertical spacing='large' style={{ width: '100%' }}>
        <Card
          title='监控详情'
          extra={
            <Space>
              <Link to={`/console/monitor-targets/${id}/edit`}>
                <Button theme='solid'>编辑</Button>
              </Link>
              <Button onClick={() => navigate('/console/monitor-targets')}>
                返回列表
              </Button>
            </Space>
          }
        >
          {error ? <Banner type='danger' description={error} /> : null}
          {loading ? <Typography.Text>loading</Typography.Text> : null}
          {!loading ? (
            <Space vertical align='start' style={{ width: '100%' }}>
              <div>
                <Typography.Text strong>当前状态：</Typography.Text>
                <Tag color={target.statusColor}>{target.statusText}</Tag>
              </div>
              <Descriptions data={descriptionData} />
            </Space>
          ) : null}
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card>
              <MonitorRunsTable items={runs} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <MonitorEventsList items={events} />
            </Card>
          </Col>
        </Row>

        <Card>
          <MonitorBillingTable items={billing} />
        </Card>
      </Space>
    </div>
  );
}
