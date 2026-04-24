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
import usePublicStatus from '../../hooks/status/usePublicStatus';
import StatusAnnouncementsCard from '../../components/status/StatusAnnouncementsCard';
import StatusPublicOverview from './components/StatusPublicOverview';
import StatusPublicServicesTable from './components/StatusPublicServicesTable';
import StatusPublicEventsList from './components/StatusPublicEventsList';

const ServiceStatus = () => {
  const {
    loading,
    error,
    windowValue,
    setWindowValue,
    overview,
    serviceRows,
    events,
    announcements,
  } = usePublicStatus();

  return (
    <div className='mx-auto max-w-6xl px-4 py-8 md:px-6'>
      <Space vertical spacing='large' style={{ width: '100%' }}>
        <StatusPublicOverview
          overview={overview}
          windowValue={windowValue}
          onWindowChange={setWindowValue}
          error={error}
        />
        {loading ? <Typography.Text>loading</Typography.Text> : null}
        <StatusAnnouncementsCard announcements={announcements} title='平台公告' />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <StatusPublicServicesTable rows={serviceRows} />
          </Col>
          <Col xs={24} md={12}>
            <StatusPublicEventsList events={events} />
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default ServiceStatus;
