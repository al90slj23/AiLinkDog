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
import { Card, Empty, Typography } from '@douyinfe/semi-ui';

const StatusPublicEvents = () => (
  <Card>
    <Typography.Title heading={5}>最近事件</Typography.Title>
    <Empty description='暂无公开事件，后续任务接入真实公告流。' />
  </Card>
);

export default StatusPublicEvents;
