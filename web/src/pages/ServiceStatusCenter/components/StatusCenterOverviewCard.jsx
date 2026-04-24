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
import { Card, Space, Tag, Typography } from '@douyinfe/semi-ui';

const StatusCenterOverviewCard = () => (
  <Card>
    <Space vertical align='start' spacing='medium' style={{ width: '100%' }}>
      <Typography.Title heading={4} style={{ margin: 0 }}>
        ALD 服务状态中心
      </Typography.Title>
      <Typography.Text>状态总览</Typography.Text>
      <Typography.Text type='secondary'>
        当前为管理后台骨架页，后续任务再接入真实状态数据与操作能力。
      </Typography.Text>
      <Tag color='blue' shape='circle'>
        骨架占位
      </Tag>
    </Space>
  </Card>
);

export default StatusCenterOverviewCard;
