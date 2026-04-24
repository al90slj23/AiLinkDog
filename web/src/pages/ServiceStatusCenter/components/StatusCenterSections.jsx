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
import { Card, Col, Row, Typography } from '@douyinfe/semi-ui';

const sectionItems = [
  {
    key: 'services',
    title: '服务状态',
    description: '服务清单与健康状态将在后续任务接入。',
  },
  {
    key: 'events',
    title: '事件记录',
    description: '公告与事件记录将在后续任务接入。',
  },
];

const StatusCenterSections = () => (
  <Row gutter={[16, 16]}>
    {sectionItems.map((item) => (
      <Col xs={24} md={12} key={item.key}>
        <Card>
          <Typography.Title heading={5}>{item.title}</Typography.Title>
          <Typography.Text type='secondary'>{item.description}</Typography.Text>
        </Card>
      </Col>
    ))}
  </Row>
);

export default StatusCenterSections;
