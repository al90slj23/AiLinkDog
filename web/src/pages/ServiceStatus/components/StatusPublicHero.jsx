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
import { Banner, Typography } from '@douyinfe/semi-ui';

const StatusPublicHero = () => (
  <div>
    <Typography.Title style={{ marginBottom: 8 }}>
      ALD 服务状态
    </Typography.Title>
    <Typography.Paragraph type='secondary' style={{ marginBottom: 16 }}>
      这里将展示公开服务健康状态与事件公告，当前先提供最小页面骨架。
    </Typography.Paragraph>
    <Banner
      type='info'
      bordered
      fullMode={false}
      description='状态详情与事件数据将在后续任务接入。'
    />
  </div>
);

export default StatusPublicHero;
