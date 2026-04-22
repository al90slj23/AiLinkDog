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
import { useTranslation } from 'react-i18next';
import { Banner, Button, Card, Empty, Space, Table, Tag, Typography } from '@douyinfe/semi-ui';

function getStatusMeta(status, t) {
  switch (status) {
    case 'pending':
      return { label: t('待审核'), color: 'orange' };
    case 'approved':
      return { label: t('已通过'), color: 'green' };
    case 'rejected':
      return { label: t('已拒绝'), color: 'red' };
    case 'processing':
      return { label: t('处理中'), color: 'blue' };
    default:
      return { label: t('状态未知'), color: 'white' };
  }
}

function formatAmount(record) {
  const actualAmount = record?.actual_amount ?? record?.actualAmount;
  const fee = record?.fee;
  const amount = record?.amount;

  if (amount === null || amount === undefined) {
    return '--';
  }

  if (actualAmount === null || actualAmount === undefined) {
    return String(amount);
  }

  return `${amount} / ${actualAmount}` + (fee !== null && fee !== undefined ? ` (${fee})` : '');
}

function formatApplicant(record) {
  const displayName = record?.display_name || record?.displayName;
  const username = record?.user_name || record?.username;

  if (displayName && username) {
    return `${displayName} (${username})`;
  }
  if (displayName) {
    return displayName;
  }
  if (username) {
    return username;
  }
  return `#${record?.user_id || '--'}`;
}

function formatTimestamp(value) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

export default function ReferralWithdrawalAuditTable({
  loading,
  withdrawals,
  processingWithdrawalId,
  onProcess,
}) {
  const { t } = useTranslation();

  const dataSource = (withdrawals || []).map((record, index) => ({
    key: record.id || `withdrawal-${index}`,
    ...record,
  }));

  const columns = [
    {
      title: t('申请人'),
      dataIndex: 'user_id',
      render: (_, record) => formatApplicant(record),
    },
    {
      title: t('申请金额'),
      dataIndex: 'amount',
      render: (_, record) => formatAmount(record),
    },
    {
      title: t('收款方式'),
      dataIndex: 'payment_method',
      render: (_, record) => {
        const paymentName = record.payment_name ? ` / ${record.payment_name}` : '';
        return `${record.payment_method || '--'} / ${record.payment_account || '--'}${paymentName}`;
      },
    },
    {
      title: t('审核状态'),
      dataIndex: 'status',
      render: (status) => {
        const meta = getStatusMeta(status, t);
        return (
          <Tag color={meta.color} shape='circle'>
            {meta.label}
          </Tag>
        );
      },
    },
    {
      title: t('备注'),
      dataIndex: 'remark',
      render: (_, record) => record.admin_remark || record.remark || '--',
    },
    {
      title: t('申请时间'),
      dataIndex: 'created_at',
      render: (value) => formatTimestamp(value),
    },
    {
      title: t('操作'),
      dataIndex: 'action',
      render: (_, record) => {
        const pending = record.status === 'pending';
        const actionLoading = processingWithdrawalId === record.id;
        return (
          <Space>
            <Button
              theme='light'
              type='primary'
              disabled={!pending}
              loading={actionLoading}
              onClick={() => onProcess(record, 'approve')}
            >
              {t('通过')}
            </Button>
            <Button
              theme='light'
              type='danger'
              disabled={!pending}
              loading={actionLoading}
              onClick={() => onProcess(record, 'reject')}
            >
              {t('拒绝')}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Card>
      <Space vertical spacing={16} style={{ width: '100%' }}>
        <div>
          <Typography.Title heading={5}>{t('提现审核')}</Typography.Title>
          <Typography.Text type='tertiary'>
            {t('当前阶段展示真实提现申请列表，并提供最小审核处理入口。')}
          </Typography.Text>
        </div>

        <Banner
          type='info'
          fullMode={false}
          description={t('当前审核页直接展示真实提现申请，并支持最小通过/拒绝状态流转。')}
        />

        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={loading}
          empty={<Empty imageStyle={{ height: 80 }} description={t('暂无提现申请数据')} />}
        />
      </Space>
    </Card>
  );
}
