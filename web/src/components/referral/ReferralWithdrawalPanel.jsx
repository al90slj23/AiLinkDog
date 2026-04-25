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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Empty,
  Input,
  InputNumber,
  Space,
  Table,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { showError } from '../../helpers';
import { formatDateTime, formatQuota, getWithdrawalStatusMeta } from './utils';

export default function ReferralWithdrawalPanel({
  loading = false,
  withdrawals = [],
  statistics = {},
  onCreateWithdrawal,
}) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [paymentName, setPaymentName] = useState('');
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dataSource = (withdrawals || []).map((record, index) => ({
    key: record.id || `withdrawal-${index}`,
    ...record,
  }));

  const columns = [
    {
      title: t('申请金额'),
      dataIndex: 'amount',
      render: (_, record) =>
        `${formatQuota(record.amount)} / ${formatQuota(record.actual_amount)}`,
    },
    {
      title: t('手续费'),
      dataIndex: 'fee',
      render: (value) => formatQuota(value),
    },
    {
      title: t('收款方式'),
      dataIndex: 'payment_method',
      render: (_, record) =>
        `${record.payment_method || '--'} / ${record.payment_account || '--'}`,
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      render: (value) => {
        const meta = getWithdrawalStatusMeta(value, t);
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
      render: (_, record) => record.remark || record.admin_remark || '--',
    },
    {
      title: t('申请时间'),
      dataIndex: 'created_at',
      render: (value) => formatDateTime(value),
    },
  ];

  const handleSubmit = async () => {
    if (Number(amount || 0) <= 0) {
      showError(t('请输入有效提现金额'));
      return;
    }
    if (!paymentMethod.trim()) {
      showError(t('请输入收款方式'));
      return;
    }
    if (!paymentAccount.trim()) {
      showError(t('请输入收款账号'));
      return;
    }
    if (!onCreateWithdrawal) {
      return;
    }

    setSubmitting(true);
    try {
      await onCreateWithdrawal({
        amount: Number(amount || 0),
        payment_method: paymentMethod.trim(),
        payment_account: paymentAccount.trim(),
        payment_name: paymentName.trim(),
        remark: remark.trim(),
      });
      setAmount(0);
      setPaymentMethod('');
      setPaymentAccount('');
      setPaymentName('');
      setRemark('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Space vertical spacing={16} style={{ width: '100%' }}>
      <Card>
        <Typography.Title heading={5}>{t('提现申请')}</Typography.Title>
        <Typography.Text type='tertiary'>
          {t(
            '当前可提现余额会基于 statistics.withdrawable_balance 展示，提交后会真实写入 referral_withdrawals。',
          )}
        </Typography.Text>
        <div style={{ marginTop: 12 }}>
          <Typography.Text>{`${t('当前可提现余额')}: ${formatQuota(statistics?.withdrawable_balance ?? 0)}`}</Typography.Text>
        </div>
        <Space
          vertical
          spacing={8}
          style={{ width: '100%', marginTop: 16 }}
          align='start'
        >
          <InputNumber
            min={0}
            value={amount}
            onChange={(value) => setAmount(Number(value || 0))}
            placeholder={t('请输入提现金额')}
            style={{ width: '100%' }}
          />
          <Input
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder={t('请输入收款方式，例如：支付宝、微信、银行卡')}
          />
          <Input
            value={paymentAccount}
            onChange={setPaymentAccount}
            placeholder={t('请输入收款账号')}
          />
          <Input
            value={paymentName}
            onChange={setPaymentName}
            placeholder={t('请输入收款人姓名，可选')}
          />
          <Input
            value={remark}
            onChange={setRemark}
            placeholder={t('请输入申请备注，可选')}
            maxLength={255}
          />
          <Button
            type='primary'
            theme='light'
            loading={submitting}
            onClick={handleSubmit}
          >
            {t('提交提现申请')}
          </Button>
        </Space>
      </Card>

      <Card>
        <Typography.Title heading={5}>{t('提现记录')}</Typography.Title>
        <Table
          style={{ marginTop: 16 }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={loading}
          empty={
            <Empty
              imageStyle={{ height: 80 }}
              description={t('暂无提现记录')}
            />
          }
        />
      </Card>
    </Space>
  );
}
