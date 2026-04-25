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

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Col,
  Empty,
  Row,
  Skeleton,
  Table,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { formatQuota } from '../utils';

function formatPlanType(value, t) {
  if (value === 2) {
    return t('一次性买断');
  }

  if (value === 1) {
    return t('持续返利');
  }

  return t('未知');
}

function renderPlanStatus(value, t) {
  if (value === true) {
    return (
      <Tag color='green' shape='circle'>
        {t('启用中')}
      </Tag>
    );
  }

  if (value === false) {
    return (
      <Tag color='grey' shape='circle'>
        {t('已停用')}
      </Tag>
    );
  }

  return (
    <Tag color='white' shape='circle'>
      {t('未知')}
    </Tag>
  );
}

function pickStatisticValue(statistics, keys) {
  for (const key of keys) {
    const value = statistics?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return 0;
}

export default function ReferralOverviewSummary({
  loading = false,
  statistics = {},
  plans = [],
}) {
  const { t } = useTranslation();

  const overviewCards = [
    {
      title: t('活跃邀请人'),
      value: pickStatisticValue(statistics, ['active_referrers']),
    },
    {
      title: t('总邀请数'),
      value: pickStatisticValue(statistics, ['total_invites']),
    },
    {
      title: t('待处理提现'),
      value: pickStatisticValue(statistics, ['pending_withdrawals']),
    },
    {
      title: t('总返利支出'),
      value: formatQuota(
        pickStatisticValue(statistics, ['total_referral_payout']),
      ),
    },
  ];

  const dataSource = useMemo(() => {
    const overviewMap = new Map(
      (Array.isArray(statistics?.plan_overview)
        ? statistics.plan_overview
        : []
      ).map((item) => [Number(item.plan_id), item]),
    );

    return (Array.isArray(plans) ? plans : []).map((plan, index) => {
      const overview = overviewMap.get(Number(plan.id)) || {};
      return {
        key: plan.id || `overview-plan-${index}`,
        plan_id: plan.id,
        name: plan.name,
        plan_type: plan.plan_type,
        is_active: plan.is_active,
        selected_account_count: overview.selected_account_count ?? 0,
        level1_commission_quota: overview.level1_commission_quota ?? 0,
        level2_commission_quota: overview.level2_commission_quota ?? 0,
        total_commission_quota: overview.total_commission_quota ?? 0,
      };
    });
  }, [statistics, plans]);

  const columns = [
    {
      title: t('方案名称'),
      dataIndex: 'name',
      render: (_, record) =>
        record.name || (record.plan_id ? `#${record.plan_id}` : '--'),
    },
    {
      title: t('方案类型'),
      dataIndex: 'plan_type',
      render: (value) => formatPlanType(value, t),
    },
    {
      title: t('选择人数'),
      dataIndex: 'selected_account_count',
    },
    {
      title: t('一级返利累计'),
      dataIndex: 'level1_commission_quota',
      render: (value) => formatQuota(value ?? 0),
    },
    {
      title: t('二级返利累计'),
      dataIndex: 'level2_commission_quota',
      render: (value) => formatQuota(value ?? 0),
    },
    {
      title: t('总返利累计'),
      dataIndex: 'total_commission_quota',
      render: (value) => formatQuota(value ?? 0),
    },
    {
      title: t('状态'),
      dataIndex: 'is_active',
      render: (value) => renderPlanStatus(value, t),
    },
  ];

  return (
    <Card>
      <Typography.Title heading={5}>{t('方案运营概览')}</Typography.Title>
      <Typography.Text type='tertiary'>
        {t(
          '这里展示每个返利方案的选择情况与返利累计数据，返利方案的新增、编辑和启停仍在“返利方案”分栏处理。',
        )}
      </Typography.Text>

      <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
        {overviewCards.map((item) => (
          <Col
            span={6}
            key={item.title}
            xxl={6}
            xl={6}
            lg={12}
            md={12}
            sm={12}
            xs={24}
          >
            <Card bodyStyle={{ padding: 16 }}>
              <Typography.Text type='tertiary'>{item.title}</Typography.Text>
              <div style={{ marginTop: 8 }}>
                <Skeleton
                  loading={loading}
                  active
                  placeholder={
                    <Skeleton.Title style={{ width: 96, height: 28 }} />
                  }
                >
                  <Typography.Title heading={3} style={{ margin: 0 }}>
                    {item.value}
                  </Typography.Title>
                </Skeleton>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        empty={
          <Empty
            imageStyle={{ height: 80 }}
            description={t('暂无返利方案数据')}
          />
        }
      />
    </Card>
  );
}
