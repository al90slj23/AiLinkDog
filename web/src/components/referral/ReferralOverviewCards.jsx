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
import { Card, Col, Row, Skeleton, Typography } from '@douyinfe/semi-ui';
import { renderNumber, renderQuota } from '../../helpers';

export default function ReferralOverviewCards({
  statistics = {},
  loading = false,
}) {
  const { t } = useTranslation();

  const overviewItems = [
    {
      title: t('总收益'),
      value: renderQuota(
        statistics.total_earnings ?? statistics.aff_history_quota ?? 0,
      ),
    },
    {
      title: t('可提现'),
      value: renderQuota(
        statistics.withdrawable_balance ?? statistics.aff_quota ?? 0,
      ),
    },
    {
      title: t('待结算'),
      value: renderQuota(statistics.pending_balance ?? 0),
    },
    {
      title: t('邀请人数'),
      value: renderNumber(
        statistics.invitee_count ??
          statistics.total_invites ??
          statistics.aff_count ??
          0,
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {overviewItems.map((item) => (
        <Col xs={24} sm={12} lg={6} key={item.title}>
          <Card>
            <Typography.Text type='tertiary'>{item.title}</Typography.Text>
            <Typography.Title heading={4} style={{ margin: '8px 0 0' }}>
              {loading ? (
                <Skeleton.Title
                  style={{ width: 96, height: 28, marginTop: 2 }}
                />
              ) : (
                item.value
              )}
            </Typography.Title>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
