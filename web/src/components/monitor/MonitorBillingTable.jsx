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
