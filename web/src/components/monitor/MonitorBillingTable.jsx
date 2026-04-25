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
import { Empty, Table, Typography } from '@douyinfe/semi-ui';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '消耗', dataIndex: 'costText', key: 'costText' },
  { title: 'Token', dataIndex: 'totalTokens', key: 'totalTokens' },
  { title: '时间', dataIndex: 'occurredAtText', key: 'occurredAtText' },
];

export default function MonitorBillingTable({ items = [] }) {
  if (!items.length) {
    return <Empty description='暂无 billing 记录' />;
  }

  return (
    <>
      <Typography.Title heading={5}>Billing</Typography.Title>
      <Table dataSource={items} columns={columns} pagination={false} />
    </>
  );
}
