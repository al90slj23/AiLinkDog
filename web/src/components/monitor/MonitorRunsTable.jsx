import React from 'react';
import { Empty, Table, Typography } from '@douyinfe/semi-ui';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '状态', dataIndex: 'statusText', key: 'statusText' },
  { title: '耗时', dataIndex: 'durationText', key: 'durationText' },
  { title: '开始时间', dataIndex: 'startedAtText', key: 'startedAtText' },
  { title: '结束时间', dataIndex: 'finishedAtText', key: 'finishedAtText' },
];

export default function MonitorRunsTable({ items = [] }) {
  if (!items.length) {
    return <Empty description='暂无 runs 记录' />;
  }

  return (
    <>
      <Typography.Title heading={5}>Runs</Typography.Title>
      <Table dataSource={items} columns={columns} pagination={false} />
    </>
  );
}
