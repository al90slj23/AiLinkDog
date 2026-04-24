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
import { Card, List, Tag, Typography } from '@douyinfe/semi-ui';

const services = [
  { name: 'API 网关', status: '待接入' },
  { name: '控制台', status: '待接入' },
];

const StatusPublicServiceList = () => (
  <Card>
    <Typography.Title heading={5}>服务列表</Typography.Title>
    <List
      dataSource={services}
      renderItem={(item) => (
        <List.Item
          main={item.name}
          extra={
            <Tag color='grey' shape='circle'>
              {item.status}
            </Tag>
          }
        />
      )}
    />
  </Card>
);

export default StatusPublicServiceList;
