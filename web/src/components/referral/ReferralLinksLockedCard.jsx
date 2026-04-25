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

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Empty,
  Input,
  InputNumber,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { showError } from '../../helpers';

function getLinkStatus(link, t) {
  if (link?.is_active === false) {
    return { label: t('已停用'), color: 'grey' };
  }
  if (link?.expired_at) {
    const expiredAt = new Date(link.expired_at);
    if (
      !Number.isNaN(expiredAt.getTime()) &&
      expiredAt.getTime() <= Date.now()
    ) {
      return { label: t('已过期'), color: 'orange' };
    }
  }
  return { label: t('生效中'), color: 'green' };
}

export default function ReferralLinksLockedCard({
  loading = false,
  links = [],
  currentPlanId = 0,
  currentPlan,
  onCreateLink,
}) {
  const { t } = useTranslation();
  const [channelNote, setChannelNote] = useState('');
  const [validityDays, setValidityDays] = useState(0);
  const [creating, setCreating] = useState(false);

  const dataSource = useMemo(
    () =>
      links.map((link, index) => ({
        key: link.id || `link-${index}`,
        ...link,
      })),
    [links],
  );

  const columns = [
    {
      title: t('邀请链接'),
      dataIndex: 'full_url',
      render: (_, record) => record.full_url || record.code || '--',
    },
    {
      title: t('渠道备注'),
      dataIndex: 'channel_note',
      render: (value) => value || t('未命名渠道'),
    },
    {
      title: t('状态'),
      dataIndex: 'is_active',
      render: (_, record) => {
        const status = getLinkStatus(record, t);
        return (
          <Tag color={status.color} shape='circle'>
            {status.label}
          </Tag>
        );
      },
    },
    {
      title: t('返利方案'),
      dataIndex: 'plan_name',
      render: (_, record) =>
        currentPlan?.name || `${t('方案')} #${record.plan_id || currentPlanId}`,
    },
  ];

  const handleCreate = async () => {
    if (!channelNote.trim()) {
      showError(t('请输入渠道备注'));
      return;
    }
    if (!onCreateLink) {
      return;
    }

    setCreating(true);
    try {
      await onCreateLink({
        channel_note: channelNote.trim(),
        validity_days: Number(validityDays || 0),
      });
      setChannelNote('');
      setValidityDays(0);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Skeleton.Title style={{ width: 180, height: 20 }} />
        <Skeleton.Paragraph rows={4} style={{ marginTop: 16 }} />
      </Card>
    );
  }

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <Typography.Title heading={6} style={{ margin: '0 0 4px' }}>
            {t('邀请链接')}
          </Typography.Title>
          <Typography.Text type='tertiary'>
            {t(
              '当前账号已锁定返利方案，后续创建的邀请链接都会继承该账号方案。',
            )}
          </Typography.Text>
        </div>
        <Tag color='green' shape='circle'>
          {currentPlan?.name || `${t('方案')} #${currentPlanId}`}
        </Tag>
      </div>

      {links.length > 0 ? (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          style={{ marginBottom: 16 }}
        />
      ) : (
        <Empty
          title={t('暂无邀请链接')}
          description={t(
            '你还没有创建邀请链接，可以先为不同分发渠道创建独立链接。',
          )}
        />
      )}

      <div style={{ marginTop: 16 }}>
        <Space vertical spacing={8} style={{ width: '100%' }} align='start'>
          <Input
            value={channelNote}
            onChange={setChannelNote}
            placeholder={t('请输入渠道备注，例如：小红书、公众号、微信群')}
            maxLength={128}
          />
          <InputNumber
            min={0}
            value={validityDays}
            onChange={(value) => setValidityDays(Number(value || 0))}
            placeholder={t('请输入有效期天数，0 表示长期有效')}
            suffix={t('天')}
            style={{ width: '100%' }}
          />
          <Button
            loading={creating}
            type='primary'
            theme='light'
            onClick={handleCreate}
          >
            {t('创建邀请链接')}
          </Button>
        </Space>
      </div>
    </Card>
  );
}
