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
  Modal,
  Radio,
  Skeleton,
  Space,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { showError } from '../../helpers';

const formatPlanType = (planType, t) => {
  if (Number(planType) === 2) {
    return t('一次性买断');
  }
  return t('持续返利');
};

export default function ReferralPlanSelectCard({
  loading = false,
  plans = [],
  currentPlanId = 0,
  onSelectPlan,
}) {
  const { t } = useTranslation();
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [pendingPlanId, setPendingPlanId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const currentPlan = plans.find((plan) => plan.id === currentPlanId);
  const pendingPlan = plans.find((plan) => plan.id === pendingPlanId);
  const activePlans = useMemo(
    () => plans.filter((plan) => plan.is_active !== false),
    [plans],
  );

  const handleSelect = () => {
    if (!selectedPlanId) {
      showError(t('请选择返利方案'));
      return;
    }
    if (!onSelectPlan) {
      return;
    }

    setPendingPlanId(selectedPlanId);
  };

  const handleConfirmSelect = async () => {
    if (!pendingPlanId || !onSelectPlan) {
      return;
    }

    setSubmitting(true);
    try {
      await onSelectPlan(pendingPlanId);
      setPendingPlanId(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Skeleton.Title style={{ width: 160, height: 20 }} />
        <Skeleton.Paragraph rows={3} style={{ marginTop: 16 }} />
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
        }}
      >
        <div style={{ width: '100%' }}>
          <Typography.Title heading={6} style={{ margin: '0 0 4px' }}>
            {t('当前返利方案')}
          </Typography.Title>
          {currentPlanId > 0 ? (
            <Space vertical spacing={6} align='start'>
              <Typography.Text strong>
                {currentPlan?.name || `${t('方案')} #${currentPlanId}`}
              </Typography.Text>
              <Typography.Text type='tertiary'>
                {currentPlan?.description ||
                  t('当前账号已锁定返利方案，后续链接都会继承该方案。')}
              </Typography.Text>
            </Space>
          ) : activePlans.length > 0 ? (
            <Space
              vertical
              spacing={10}
              align='start'
              style={{ width: '100%' }}
            >
              <Typography.Text type='tertiary'>
                {t(
                  '请选择当前账号使用的返利方案。方案一旦锁定，将跟随账号生效。',
                )}
              </Typography.Text>
              <Radio.Group
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
              >
                <Space
                  vertical
                  spacing={8}
                  align='start'
                  style={{ width: '100%' }}
                >
                  {activePlans.map((plan) => (
                    <Card
                      key={plan.id}
                      bodyStyle={{ padding: 12 }}
                      style={{ width: '100%' }}
                    >
                      <Radio value={plan.id}>
                        <Space vertical spacing={4} align='start'>
                          <Typography.Text strong>{plan.name}</Typography.Text>
                          <Typography.Text type='secondary'>
                            {plan.description || t('未填写方案说明')}
                          </Typography.Text>
                          <Typography.Text type='tertiary'>
                            {t('分润')} {plan.profit_share_percent ?? 0}% / L1{' '}
                            {plan.level1_percent ?? 0}% / L2{' '}
                            {plan.level2_percent ?? 0}%
                          </Typography.Text>
                        </Space>
                      </Radio>
                    </Card>
                  ))}
                </Space>
              </Radio.Group>
              <Button
                type='primary'
                loading={submitting}
                onClick={handleSelect}
              >
                {t('锁定当前方案')}
              </Button>
            </Space>
          ) : (
            <Empty
              image={null}
              title={t('暂无可选返利方案')}
              description={t(
                '当前没有启用中的返利方案，请联系管理员检查配置。',
              )}
            />
          )}
        </div>
        <Tag color={currentPlanId > 0 ? 'green' : 'blue'} shape='circle'>
          {currentPlanId > 0 ? t('已锁定') : t('待选择')}
        </Tag>
      </div>
      <Modal
        title={t('确认选择返利方案')}
        visible={!!pendingPlanId}
        onCancel={() => setPendingPlanId(null)}
        onOk={handleConfirmSelect}
        confirmLoading={submitting}
        okText={t('确认选择')}
        cancelText={t('取消')}
      >
        {pendingPlan && (
          <Space vertical spacing={12} align='start' style={{ width: '100%' }}>
            <Typography.Title
              heading={6}
              style={{ margin: 0, color: 'var(--semi-color-warning)' }}
            >
              {t('重要提示')}
            </Typography.Title>
            <Typography.Text strong type='danger'>
              {t('返利方案一旦选择将永久生效，无法更改！')}
            </Typography.Text>
            <Card
              bodyStyle={{ padding: 12 }}
              style={{
                width: '100%',
                backgroundColor: 'var(--semi-color-fill-0)',
              }}
            >
              <Space
                vertical
                spacing={6}
                align='start'
                style={{ width: '100%' }}
              >
                <Typography.Text strong>{t('您选择的方案')}</Typography.Text>
                <Typography.Text>
                  {t('方案名称')}:{' '}
                  {pendingPlan.name || `${t('方案')} #${pendingPlan.id}`}
                </Typography.Text>
                <Typography.Text>
                  {t('方案类型')}: {formatPlanType(pendingPlan.plan_type, t)}
                </Typography.Text>
                <Typography.Text>
                  {t('一级返利')}: {pendingPlan.level1_percent ?? 0}%
                </Typography.Text>
                <Typography.Text>
                  {t('二级返利')}: {pendingPlan.level2_percent ?? 0}%
                </Typography.Text>
              </Space>
            </Card>
            <Typography.Text>
              {t('确认后，该方案将应用于您的所有邀请链接，且无法更改。')}
            </Typography.Text>
          </Space>
        )}
      </Modal>
    </Card>
  );
}
