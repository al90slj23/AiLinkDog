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
import { Card, Empty, Table, Tag, Typography } from '@douyinfe/semi-ui';
import { formatDateTime, formatQuota, getCommissionStatusMeta } from './utils';

export default function ReferralCommissionTable({
  loading = false,
  commissions = [],
}) {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('邀请用户'),
      dataIndex: 'invitee_user_id',
      render: (value) => (value ? `#${value}` : '--'),
    },
    {
      title: t('充值金额'),
      dataIndex: 'top_up_amount',
      render: (value) => formatQuota(value),
    },
    {
      title: t('佣金额度'),
      dataIndex: 'commission_quota',
      render: (value) => formatQuota(value),
    },
    {
      title: t('层级'),
      dataIndex: 'level',
      render: (value) => (value ? `${t('第')} ${value} ${t('级')}` : '--'),
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      render: (value) => {
        const meta = getCommissionStatusMeta(value, t);
        return (
          <Tag color={meta.color} shape='circle'>
            {meta.label}
          </Tag>
        );
      },
    },
    {
      title: t('创建时间'),
      dataIndex: 'created_at',
      render: (value) => formatDateTime(value),
    },
  ];

  const dataSource = (commissions || []).map((record, index) => ({
    key: record.id || `commission-${index}`,
    ...record,
  }));

  return (
    <Card>
      <Typography.Title heading={5}>{t('佣金记录')}</Typography.Title>
      <Typography.Text type='tertiary'>
        {t(
          '当前阶段直接展示 referral_commissions 中与当前用户关联的真实记录；若暂未接入完整生成链路，这里会显示为空表。',
        )}
      </Typography.Text>
      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        empty={
          <Empty imageStyle={{ height: 80 }} description={t('暂无佣金记录')} />
        }
      />
    </Card>
  );
}
