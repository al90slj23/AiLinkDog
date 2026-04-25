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
import { formatQuota } from './utils';

function getUserStatusMeta(status, t) {
  if (Number(status) === 1) {
    return { label: t('正常'), color: 'green' };
  }
  return { label: t('已禁用'), color: 'red' };
}

export default function ReferralInviteeTable({
  loading = false,
  invitees = [],
}) {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('用户'),
      dataIndex: 'username',
      render: (_, record) =>
        record.display_name || record.username || `#${record.id || '--'}`,
    },
    {
      title: t('邮箱'),
      dataIndex: 'email',
      render: (value) => value || '--',
    },
    {
      title: t('当前返利额度'),
      dataIndex: 'aff_quota',
      render: (value) => formatQuota(value),
    },
    {
      title: t('累计返利额度'),
      dataIndex: 'aff_history_quota',
      render: (value) => formatQuota(value),
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      render: (value) => {
        const meta = getUserStatusMeta(value, t);
        return (
          <Tag color={meta.color} shape='circle'>
            {meta.label}
          </Tag>
        );
      },
    },
  ];

  const dataSource = (invitees || []).map((record, index) => ({
    key: record.id || `invitee-${index}`,
    ...record,
  }));

  return (
    <Card>
      <Typography.Title heading={5}>{t('邀请用户')}</Typography.Title>
      <Typography.Text type='tertiary'>
        {t(
          '这里展示真实通过 inviter_id 关联到当前用户的被邀请用户列表，用于核对邀请效果与后续佣金来源。',
        )}
      </Typography.Text>
      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        empty={
          <Empty imageStyle={{ height: 80 }} description={t('暂无邀请用户')} />
        }
      />
    </Card>
  );
}
