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
import { Col, Row, Space, Typography } from '@douyinfe/semi-ui';
import useAdminStatus from '../../hooks/status/useAdminStatus';
import StatusAnnouncementsCard from '../../components/status/StatusAnnouncementsCard';
import StatusAdminOverview from './components/StatusAdminOverview';
import StatusAdminServicesTable from './components/StatusAdminServicesTable';
import StatusAdminChannelsTable from './components/StatusAdminChannelsTable';
import StatusAdminEventsList from './components/StatusAdminEventsList';

const ServiceStatusCenter = () => {
  const {
    loading,
    error,
    windowValue,
    setWindowValue,
    overview,
    serviceRows,
    channelRows,
    events,
    announcements,
  } = useAdminStatus();

  return (
    <div className='px-4 py-6 md:px-6'>
      <Space vertical spacing='large' style={{ width: '100%' }}>
        <StatusAdminOverview
          overview={overview}
          windowValue={windowValue}
          onWindowChange={setWindowValue}
          error={error}
        />
        {loading ? <Typography.Text>loading</Typography.Text> : null}
        <StatusAnnouncementsCard announcements={announcements} title='平台公告' />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <StatusAdminServicesTable rows={serviceRows} />
          </Col>
          <Col xs={24} md={12}>
            <StatusAdminChannelsTable rows={channelRows} />
          </Col>
        </Row>
        <StatusAdminEventsList events={events} />
      </Space>
    </div>
  );
};

export default ServiceStatusCenter;
