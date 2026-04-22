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

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Space, Tabs, Typography } from '@douyinfe/semi-ui';
import { API, showError, showSuccess } from '../../helpers';
import { useMinimumLoadingTime } from '../../hooks/common/useMinimumLoadingTime';
import ReferralOverviewCards from './ReferralOverviewCards';
import ReferralPlanSelectCard from './ReferralPlanSelectCard';
import ReferralLinksLockedCard from './ReferralLinksLockedCard';
import ReferralCommissionTable from './ReferralCommissionTable';
import ReferralInviteeTable from './ReferralInviteeTable';
import ReferralWithdrawalPanel from './ReferralWithdrawalPanel';

function ReferralLinksTabContent({
  loading,
  statistics,
  plans,
  links,
  onSelectPlan,
  onCreateLink,
}) {
  const currentPlanId = Number(statistics?.referral_plan_id || 0);
  const currentPlan = plans.find((plan) => Number(plan.id) === currentPlanId);

  return (
    <Space vertical spacing={16} style={{ width: '100%' }}>
      <Card>
        <Space vertical spacing={8} align='start'>
          <Typography.Text>{'查看返利余额、佣金明细、邀请链接和提现状态'}</Typography.Text>
          <Typography.Text type='tertiary'>
            {
              '返利根据后台配置的方案实时计算。持续返利按后续充值持续结算，一次性买断仅在首次储值时结算。'
            }
          </Typography.Text>
        </Space>
      </Card>
      <ReferralOverviewCards statistics={statistics} loading={loading} />
      <Card>
        <Typography.Text type='tertiary'>
          {
            '当前返利余额中的“可提现”和“待结算”会分开记录。持续返利方案通常先进入待结算余额，一次性买断方案可直接进入可提现余额。'
          }
        </Typography.Text>
      </Card>
      {currentPlanId > 0 ? (
        <ReferralLinksLockedCard
          loading={loading}
          links={links}
          currentPlanId={currentPlanId}
          currentPlan={currentPlan}
          onCreateLink={onCreateLink}
        />
      ) : (
        <ReferralPlanSelectCard
          loading={loading}
          plans={plans}
          currentPlanId={currentPlanId}
          onSelectPlan={onSelectPlan}
        />
      )}
    </Space>
  );
}

export default function ReferralCenterPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({});
  const [plans, setPlans] = useState([]);
  const [links, setLinks] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [invitees, setInvitees] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const showLoading = useMinimumLoadingTime(loading, 300);

  const loadReferralData = useCallback(async () => {
    setLoading(true);
    try {
      const [statisticsRes, plansRes, linksRes, commissionsRes, inviteesRes, withdrawalsRes] = await Promise.all([
        API.get('/api/referral/statistics'),
        API.get('/api/referral/plans'),
        API.get('/api/referral/links'),
        API.get('/api/referral/commissions'),
        API.get('/api/referral/invitees'),
        API.get('/api/referral/withdrawals'),
      ]);

      const responses = [statisticsRes, plansRes, linksRes, commissionsRes, inviteesRes, withdrawalsRes];
      const failedResponse = responses.find((res) => !res.data?.success);
      if (failedResponse) {
        showError(failedResponse.data?.message || t('加载邀请返利数据失败'));
        return;
      }

      setStatistics(statisticsRes.data?.data || {});
      setPlans(plansRes.data?.data || []);
      setLinks(linksRes.data?.data || []);
      setCommissions(Array.isArray(commissionsRes.data?.data) ? commissionsRes.data.data : []);
      setInvitees(Array.isArray(inviteesRes.data?.data) ? inviteesRes.data.data : []);
      setWithdrawals(Array.isArray(withdrawalsRes.data?.data) ? withdrawalsRes.data.data : []);
    } catch (error) {
      showError(error?.message || t('加载邀请返利数据失败'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadReferralData();
  }, [loadReferralData]);

  const handleSelectPlan = async (planId) => {
    const res = await API.post('/api/referral/plans/select', { plan_id: planId });
    if (!res.data?.success) {
      showError(res.data?.message || t('锁定返利方案失败'));
      return;
    }
    showSuccess(t('返利方案已锁定'));
    await loadReferralData();
  };

  const handleCreateLink = async (payload) => {
    const res = await API.post('/api/referral/links', payload);
    if (!res.data?.success) {
      showError(res.data?.message || t('创建邀请链接失败'));
      return;
    }
    showSuccess(t('邀请链接已创建'));
    await loadReferralData();
  };

  const handleCreateWithdrawal = async (payload) => {
    const res = await API.post('/api/referral/withdrawals', payload);
    if (!res.data?.success) {
      showError(res.data?.message || t('提交提现申请失败'));
      return;
    }
    showSuccess(t('提现申请已提交'));
    await loadReferralData();
  };

  const tabItems = [
    { itemKey: 'links', tab: t('邀请链接') },
    { itemKey: 'commissions', tab: t('佣金记录') },
    { itemKey: 'invitees', tab: t('邀请用户') },
    { itemKey: 'withdrawals', tab: t('提现管理') },
  ];

  return (
    <Space vertical spacing={16} style={{ width: '100%' }}>
      <div style={{ marginBottom: 4 }}>
        <Typography.Title heading={3} style={{ margin: 0 }}>
          {t('邀请返利中心')}
        </Typography.Title>
      </div>

      <Card bodyStyle={{ paddingTop: 8 }}>
        <Tabs type='line' defaultActiveKey='links'>
          {tabItems.map((item) => (
            <Tabs.TabPane tab={item.tab} itemKey={item.itemKey} key={item.itemKey}>
              {item.itemKey === 'links' ? (
                <ReferralLinksTabContent
                  loading={showLoading}
                  statistics={statistics}
                  plans={plans}
                  links={links}
                  onSelectPlan={handleSelectPlan}
                  onCreateLink={handleCreateLink}
                />
              ) : item.itemKey === 'commissions' ? (
                <ReferralCommissionTable loading={showLoading} commissions={commissions} />
              ) : item.itemKey === 'invitees' ? (
                <ReferralInviteeTable loading={showLoading} invitees={invitees} />
              ) : item.itemKey === 'withdrawals' ? (
                <ReferralWithdrawalPanel
                  loading={showLoading}
                  withdrawals={withdrawals}
                  statistics={statistics}
                  onCreateWithdrawal={handleCreateWithdrawal}
                />
              ) : (
                <Card />
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>
    </Space>
  );
}
