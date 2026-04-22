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
import { Banner, Card, Skeleton, Space, Tabs, Typography } from '@douyinfe/semi-ui';
import { API, showError, showSuccess } from '../../helpers';
import ReferralOverviewSummary from './admin/ReferralOverviewSummary';
import ReferralSettingPanel from './admin/ReferralSettingPanel';
import ReferralPlanTable from './admin/ReferralPlanTable';
import ReferralWithdrawalAuditTable from './admin/ReferralWithdrawalAuditTable';

export default function ReferralManagePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [processingWithdrawalId, setProcessingWithdrawalId] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [plans, setPlans] = useState([]);
  const [setting, setSetting] = useState({});
  const [withdrawals, setWithdrawals] = useState([]);

  const loadManageData = useCallback(async () => {
    setLoading(true);
    try {
      const [statisticsRes, plansRes, settingRes, withdrawalsRes] = await Promise.all([
        API.get('/api/referral/admin/statistics'),
        API.get('/api/referral/admin/plans'),
        API.get('/api/referral/admin/setting'),
        API.get('/api/referral/admin/withdrawals'),
      ]);

      const responses = [statisticsRes, plansRes, settingRes, withdrawalsRes];
      const failedResponse = responses.find((res) => !res.data?.success);
      if (failedResponse) {
        showError(failedResponse.data?.message || t('加载邀请返利管理数据失败'));
        return;
      }

      setStatistics(statisticsRes.data?.data || {});
      setPlans(Array.isArray(plansRes.data?.data) ? plansRes.data.data : []);
      setSetting(settingRes.data?.data || {});
      setWithdrawals(Array.isArray(withdrawalsRes.data?.data) ? withdrawalsRes.data.data : []);
    } catch (error) {
      showError(error?.message || t('加载邀请返利管理数据失败'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadManageData();
  }, [loadManageData]);

  const handleProcessWithdrawal = async (record, action) => {
    const withdrawalId = record?.id;
    if (!withdrawalId) {
      showError(t('提现记录缺少编号，无法处理'));
      return;
    }

    setProcessingWithdrawalId(withdrawalId);
    try {
      const adminRemark = action === 'reject' ? t('管理员已拒绝该提现申请') : t('管理员已通过该提现申请');
      const res = await API.post('/api/referral/admin/withdrawals/process', {
        withdrawal_id: withdrawalId,
        action,
        admin_remark: adminRemark,
      });
      if (!res.data?.success) {
        showError(res.data?.message || t('处理提现申请失败'));
        return;
      }

      showSuccess(res.data?.message || t('处理成功'));
      await loadManageData();
    } catch (error) {
      showError(error?.message || t('处理提现申请失败'));
    } finally {
      setProcessingWithdrawalId(null);
    }
  };

  const handleSaveSetting = async (payload) => {
    const res = await API.put('/api/referral/admin/setting', payload);
    if (!res.data?.success) {
      showError(res.data?.message || t('保存返利配置失败'));
      return;
    }
    showSuccess(t('返利配置已保存'));
    setSetting(res.data?.data || {});
  };

  const handleSavePlan = async (payload) => {
    const res = await API.put('/api/referral/admin/plans', payload);
    if (!res.data?.success) {
      showError(res.data?.message || t('保存返利方案失败'));
      return;
    }
    showSuccess(t('返利方案已更新'));
    await loadManageData();
  };

  const handleTogglePlan = async (plan) => {
    const res = await API.put('/api/referral/admin/plans', {
      ...plan,
      is_active: !plan.is_active,
    });
    if (!res.data?.success) {
      showError(res.data?.message || t('切换方案状态失败'));
      return;
    }
    showSuccess(plan.is_active ? t('方案已停用') : t('方案已启用'));
    await loadManageData();
  };

  const tabItems = [
    {
      itemKey: 'overview',
      tab: t('概览'),
      content: <ReferralOverviewSummary loading={loading} statistics={statistics} plans={plans} />,
    },
    {
      itemKey: 'plans',
      tab: t('返利方案'),
      content: (
        <ReferralPlanTable
          loading={loading}
          statistics={statistics}
          plans={plans}
          onSavePlan={handleSavePlan}
          onTogglePlan={handleTogglePlan}
        />
      ),
    },
    {
      itemKey: 'settings',
      tab: t('返利配置'),
      content: <ReferralSettingPanel loading={loading} setting={setting} onSave={handleSaveSetting} />,
    },
    {
      itemKey: 'withdrawals',
      tab: t('提现审核'),
      content: (
        <ReferralWithdrawalAuditTable
          loading={loading}
          withdrawals={withdrawals}
          processingWithdrawalId={processingWithdrawalId}
          onProcess={handleProcessWithdrawal}
        />
      ),
    },
  ];

  const overviewContent = (
    <Card>
      <Space vertical spacing={16} style={{ width: '100%' }}>
        <Typography.Text type='tertiary'>
          {t('概览页当前展示方案运营概览，返利方案、返利配置和提现审核在其他分栏继续维护。')}
        </Typography.Text>
        <ReferralOverviewSummary loading={loading} statistics={statistics} plans={plans} />
      </Space>
    </Card>
  );

  tabItems[0].content = overviewContent;

  return (
    <div style={{ marginTop: 60, padding: '0 8px' }}>
      <Space vertical spacing={16} style={{ width: '100%' }}>
        <Typography.Title heading={3} style={{ margin: 0 }}>
          {t('邀请返利管理')}
        </Typography.Title>

        <Card bodyStyle={{ padding: 16 }}>
          <Skeleton loading={loading} active placeholder={<Skeleton.Paragraph rows={1} />}>
            <Banner
              type='info'
              fullMode={false}
              description={t('这里统一处理返利系统配置、返利方案、平台统计与提现审核。')}
            />
          </Skeleton>
        </Card>

        <Tabs type='card' defaultActiveKey='overview'>
          {tabItems.map((item) => (
            <Tabs.TabPane tab={item.tab} itemKey={item.itemKey} key={item.itemKey}>
              {item.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Space>
    </div>
  );
}
