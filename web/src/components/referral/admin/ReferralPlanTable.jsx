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
  Banner,
  Button,
  Card,
  Col,
  Empty,
  Divider,
  Input,
  InputNumber,
  Modal,
  Radio,
  RadioGroup,
  Row,
  Skeleton,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';

function pickStatisticValue(statistics, keys) {
  for (const key of keys) {
    const value = statistics?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return 0;
}

function formatStatisticValue(value) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  return value;
}

function formatPercent(value) {
  if (value === null || value === undefined || value === '') {
    return '--';
  }

  return `${value}%`;
}

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

function calculateActualRebate(plan, level) {
  const minProfit = Number(plan?.min_channel_profit || 0);
  const profitShare = Number(plan?.profit_share_percent || 0);
  const levelPercent = Number(level === 1 ? plan?.level1_percent || 0 : plan?.level2_percent || 0);
  return (((minProfit / 100) * (profitShare / 100) * (levelPercent / 100)) * 100).toFixed(2);
}

function calculateUserActualGain(plan) {
  return `${calculateActualRebate(plan, 1)}% / ${calculateActualRebate(plan, 2)}%`;
}

function calculateReferralBase(plan, amount = 100) {
  return (Number(plan?.min_channel_profit || 0) / 100) * amount;
}

function calculateReferralPool(plan, amount = 100) {
  return calculateReferralBase(plan, amount) * (Number(plan?.profit_share_percent || 0) / 100);
}

function calculateReferralMoney(plan, level, amount = 100) {
  const pool = calculateReferralPool(plan, amount);
  const levelPercent = Number(level === 1 ? plan?.level1_percent || 0 : plan?.level2_percent || 0);
  return (pool * levelPercent) / 100;
}

function defaultPlanPreset(planType) {
  if (planType === 2) {
    return {
      profit_share_percent: 20,
      min_channel_profit: 20,
      level1_percent: 80,
      level2_percent: 20,
    };
  }

  return {
    profit_share_percent: 50,
    min_channel_profit: 20,
    level1_percent: 80,
    level2_percent: 20,
  };
}

function renderPlanStateText(value, t) {
  if (value === true) {
    return t('当前方案处于启用状态，用户可以继续选择和使用。');
  }

  if (value === false) {
    return t('当前方案已停用，已有历史记录不受影响，但新用户无法再选择。');
  }

  return t('当前方案状态未明确，请保存后再次确认。');
}

function planThemeColor(planType) {
  if (planType === 2) {
    return {
      background: 'rgba(var(--semi-orange-0), 1)',
      border: 'var(--semi-color-warning)',
    };
  }

  return {
    background: 'rgba(var(--semi-blue-0), 1)',
    border: 'var(--semi-color-info)',
  };
}

function getRatioFieldHelp(t) {
  return [
    {
      title: t('最低利润率'),
      description: t('用于定义利润基数。以充值 100 元为例，最低利润率 20% 表示先按 20 元利润作为返利计算基础。'),
    },
    {
      title: t('利润分配比例'),
      description: t('表示从利润基数中拿出多少作为真实返利池。例如利润基数 20 元、利润分配比例 80%，则返利池为 16 元。'),
    },
    {
      title: t('一级返利占比'),
      description: t('用于分配返利池中的一级部分。默认与二级返利占比合计固定为 100%。'),
    },
    {
      title: t('二级返利占比'),
      description: t('用于分配返利池中的二级部分。一级与二级会联动，确保总和始终为 100%。'),
    },
  ];
}

export default function ReferralPlanTable({
  loading,
  statistics,
  plans,
  onSavePlan,
  onTogglePlan,
  readOnly = false,
}) {
  const { t } = useTranslation();
  const [editingPlan, setEditingPlan] = useState(null);
  const [savingPlan, setSavingPlan] = useState(false);
  const ratioFieldHelp = useMemo(() => getRatioFieldHelp(t), [t]);

  const dataSource = useMemo(
    () => (plans || []).map((plan, index) => ({ key: plan.id || `plan-${index}`, ...plan })),
    [plans],
  );

  const columns = [
    {
      title: t('方案名称'),
      dataIndex: 'name',
      render: (_, record) => record.name || (record.id ? `#${record.id}` : '--'),
    },
    {
      title: t('方案类型'),
      dataIndex: 'plan_type',
      render: (value) => formatPlanType(value, t),
    },
    {
      title: t('利润分配'),
      dataIndex: 'profit_share_percent',
      render: (value) => formatPercent(value),
    },
    {
      title: t('一级返利占比'),
      dataIndex: 'level1_percent',
      render: (value) => formatPercent(value),
    },
    {
      title: t('二级返利占比'),
      dataIndex: 'level2_percent',
      render: (value) => formatPercent(value),
    },
    {
      title: t('最低利润率'),
      dataIndex: 'min_channel_profit',
      render: (value) => formatPercent(value),
    },
    {
      title: t('用户实际获得'),
      dataIndex: 'actual_rebate',
      render: (_, record) => calculateUserActualGain(record),
    },
    {
      title: t('状态'),
      dataIndex: 'is_active',
      render: (value) => renderPlanStatus(value, t),
    },
    ...(!readOnly
      ? [
          {
            title: t('操作'),
            dataIndex: 'action',
            render: (_, record) => (
              <Space>
                <Button theme='light' onClick={() => setEditingPlan({ ...record })}>
                  {t('编辑')}
                </Button>
                <Button
                  theme='light'
                  type={record.is_active ? 'danger' : 'primary'}
                  onClick={() => onTogglePlan?.(record)}
                >
                  {record.is_active ? t('停用') : t('启用')}
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  const overviewItems = [
    {
      label: t('活跃邀请人'),
      value: formatStatisticValue(pickStatisticValue(statistics, ['active_referrers'])),
    },
    {
      label: t('总邀请数'),
      value: formatStatisticValue(pickStatisticValue(statistics, ['total_invites'])),
    },
    {
      label: t('待处理提现'),
      value: formatStatisticValue(pickStatisticValue(statistics, ['pending_withdrawals'])),
    },
    {
      label: t('总返利支出'),
      value: formatStatisticValue(pickStatisticValue(statistics, ['total_referral_payout'])),
    },
  ];

  const handleSave = async () => {
    if (!editingPlan || !onSavePlan) {
      return;
    }
    setSavingPlan(true);
    try {
      await onSavePlan(editingPlan);
      setEditingPlan(null);
    } finally {
      setSavingPlan(false);
    }
  };

  const handleCreate = () => {
    setEditingPlan({
      id: 0,
      name: t('新方案'),
      description: '',
      plan_type: 1,
      is_active: true,
      profit_share_percent: 0,
      min_channel_profit: 0,
      level1_percent: 0,
      level2_percent: 0,
    });
  };

  const handleApplyPreset = () => {
    if (!editingPlan) {
      return;
    }

    const preset = defaultPlanPreset(editingPlan.plan_type);
    setEditingPlan((state) => ({
      ...state,
      ...preset,
    }));
  };

  const handleLevel1Change = (value) => {
    const level1 = Math.min(100, Math.max(0, Number(value || 0)));
    setEditingPlan((state) => ({
      ...state,
      level1_percent: level1,
      level2_percent: 100 - level1,
    }));
  };

  const handleLevel2Change = (value) => {
    const level2 = Math.min(100, Math.max(0, Number(value || 0)));
    setEditingPlan((state) => ({
      ...state,
      level2_percent: level2,
      level1_percent: 100 - level2,
    }));
  };

  return (
    <Card>
      <Typography.Title heading={5}>{t('返利方案')}</Typography.Title>
      {!readOnly && (
        <div style={{ marginBottom: 16 }}>
          <Button type='primary' onClick={handleCreate}>
            {t('新增返利方案')}
          </Button>
        </div>
      )}

      <Row gutter={16} style={{ marginBottom: 16 }}>
        {overviewItems.map((item) => (
          <Col span={6} key={item.label} xxl={6} xl={6} lg={12} md={12} sm={12} xs={24}>
            <Card bodyStyle={{ padding: 16 }}>
              <Typography.Text type='tertiary'>{item.label}</Typography.Text>
              <div style={{ marginTop: 8 }}>
                <Skeleton
                  loading={loading}
                  active
                  placeholder={<Skeleton.Title style={{ width: 72, height: 28 }} />}
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
        empty={<Empty imageStyle={{ height: 80 }} description={t('暂无返利方案数据')} />}
      />

      {!readOnly && (
        <Modal
          title={editingPlan?.id ? t('编辑返利方案') : t('新增返利方案')}
          visible={!!editingPlan}
          onCancel={() => setEditingPlan(null)}
          onOk={handleSave}
          confirmLoading={savingPlan}
          okText={t('保存')}
          cancelText={t('取消')}
          width={1040}
        >
          {editingPlan && (
            <Space vertical spacing={16} style={{ width: '100%' }}>
              <Banner
                type='warning'
                fullMode={false}
                description={t('修改方案参数只会影响后续新产生的返利记录，已产生的返利仍按历史快照结算。')}
              />

              <Row gutter={16}>
                <Col span={7}>
                  <Card bodyStyle={{ padding: 16, background: 'var(--semi-color-fill-0)' }}>
                    <Space vertical spacing={12} style={{ width: '100%' }}>
                      <Typography.Text strong>{t('参数说明')}</Typography.Text>
                      {ratioFieldHelp.map((item) => (
                        <div key={item.title}>
                          <Typography.Text strong>{item.title}</Typography.Text>
                          <Typography.Paragraph style={{ margin: '6px 0 0' }} type='secondary'>
                            {item.description}
                          </Typography.Paragraph>
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>

                <Col span={10}>
                  <Space vertical spacing={16} style={{ width: '100%' }}>
                    <Card bodyStyle={{ padding: 16 }}>
                      <Space vertical spacing={8} style={{ width: '100%' }}>
                        <Typography.Text strong>{t('方案基础信息')}</Typography.Text>
                        <div>
                          <Typography.Text type='secondary'>{t('方案名称')}</Typography.Text>
                          <Input
                            value={editingPlan.name || ''}
                            placeholder={t('请输入方案名称')}
                            onChange={(value) =>
                              setEditingPlan((state) => ({ ...state, name: value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text type='secondary'>{t('方案说明')}</Typography.Text>
                          <Input
                            value={editingPlan.description || ''}
                            placeholder={t('请输入方案说明')}
                            onChange={(value) =>
                              setEditingPlan((state) => ({ ...state, description: value }))
                            }
                          />
                        </div>
                        <div>
                          <Typography.Text type='secondary'>{t('方案类型')}</Typography.Text>
                          <div style={{ marginTop: 8 }}>
                            <RadioGroup
                              value={editingPlan.plan_type}
                              onChange={(event) =>
                                setEditingPlan((state) => ({
                                  ...state,
                                  plan_type: Number(event.target.value),
                                }))
                              }
                            >
                              <Radio value={1}>{t('持续返利')}</Radio>
                              <Radio value={2}>{t('一次性买断')}</Radio>
                            </RadioGroup>
                          </div>
                        </div>
                        <div>
                          <Typography.Text type='secondary'>{t('方案状态')}</Typography.Text>
                          <div style={{ marginTop: 8 }}>
                            <Space align='center'>
                              <Switch
                                checked={!!editingPlan.is_active}
                                onChange={(value) =>
                                  setEditingPlan((state) => ({ ...state, is_active: value }))
                                }
                              />
                              {renderPlanStatus(editingPlan.is_active, t)}
                            </Space>
                          </div>
                        </div>
                      </Space>
                    </Card>

                    <Card bodyStyle={{ padding: 16 }}>
                      <Space vertical spacing={8} style={{ width: '100%' }}>
                        <Space align='center' style={{ justifyContent: 'space-between', width: '100%' }}>
                          <Typography.Text strong>{t('返利比例配置')}</Typography.Text>
                          <Button theme='light' type='tertiary' onClick={handleApplyPreset}>
                            {t('恢复建议值')}
                          </Button>
                        </Space>
                        <Typography.Text type='tertiary'>
                          {t('一级/二级返利占比固定合计为 100%，修改其中一个值时，另一个值会自动联动。')}
                        </Typography.Text>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Typography.Text type='secondary'>{t('利润分配比例 (%)')}</Typography.Text>
                            <InputNumber
                              style={{ width: '100%' }}
                              value={editingPlan.profit_share_percent}
                              min={0}
                              max={100}
                              onChange={(value) =>
                                setEditingPlan((state) => ({
                                  ...state,
                                  profit_share_percent: Number(value || 0),
                                }))
                              }
                            />
                          </Col>
                          <Col span={12}>
                            <Typography.Text type='secondary'>{t('最低利润率 (%)')}</Typography.Text>
                            <InputNumber
                              style={{ width: '100%' }}
                              value={editingPlan.min_channel_profit}
                              min={0}
                              max={100}
                              onChange={(value) =>
                                setEditingPlan((state) => ({
                                  ...state,
                                  min_channel_profit: Number(value || 0),
                                }))
                              }
                            />
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Typography.Text type='secondary'>{t('一级返利占比 (%)')}</Typography.Text>
                            <InputNumber
                              style={{ width: '100%' }}
                              value={editingPlan.level1_percent}
                              min={0}
                              max={100}
                              onChange={handleLevel1Change}
                            />
                          </Col>
                          <Col span={12}>
                            <Typography.Text type='secondary'>{t('二级返利占比 (%)')}</Typography.Text>
                            <InputNumber
                              style={{ width: '100%' }}
                              value={editingPlan.level2_percent}
                              min={0}
                              max={100}
                              onChange={handleLevel2Change}
                            />
                          </Col>
                        </Row>
                        <Typography.Text type='tertiary'>
                          {t('当前分配')}: L1 {editingPlan.level1_percent || 0}% / L2 {editingPlan.level2_percent || 0}% = 100%
                        </Typography.Text>
                      </Space>
                    </Card>
                  </Space>
                </Col>

                <Col span={7}>
                  <Space vertical spacing={16} style={{ width: '100%' }}>
                    <Card
                      bodyStyle={{ padding: 16, background: planThemeColor(editingPlan.plan_type).background }}
                      style={{ borderColor: planThemeColor(editingPlan.plan_type).border }}
                    >
                      <Space vertical spacing={8} style={{ width: '100%' }}>
                        <Typography.Text strong>{t('方案预览')}</Typography.Text>
                        <Typography.Text>{editingPlan.name || t('未命名方案')}</Typography.Text>
                        <Typography.Text type='tertiary'>
                          {formatPlanType(editingPlan.plan_type, t)}
                        </Typography.Text>
                        {renderPlanStatus(editingPlan.is_active, t)}
                        <Typography.Text type='secondary'>
                          {editingPlan.description || t('未填写方案说明')}
                        </Typography.Text>
                      </Space>
                    </Card>

                    <Card bodyStyle={{ padding: 16, background: 'var(--semi-color-fill-0)' }}>
                      <Space vertical spacing={8} style={{ width: '100%' }}>
                        <Typography.Text strong>{t('返利预览')}</Typography.Text>
                        <Typography.Text type='secondary'>
                          {editingPlan.description || t('未填写方案说明')}
                        </Typography.Text>
                        <Typography.Text type='tertiary'>
                          {renderPlanStateText(editingPlan.is_active, t)}
                        </Typography.Text>
                        <Divider margin='8px' />
                        <Typography.Text strong>{t('按充值 100 元示例')}</Typography.Text>
                        <Typography.Text>
                          {t('利润基数')}: 100 x {Number(editingPlan.min_channel_profit || 0)}% = {calculateReferralBase(editingPlan, 100).toFixed(2)}
                        </Typography.Text>
                        <Typography.Text>
                          {t('返利池')}: {calculateReferralBase(editingPlan, 100).toFixed(2)} x {Number(editingPlan.profit_share_percent || 0)}% = {calculateReferralPool(editingPlan, 100).toFixed(2)}
                        </Typography.Text>
                        <Typography.Text>
                          {t('一级返利')}: {calculateReferralPool(editingPlan, 100).toFixed(2)} x {Number(editingPlan.level1_percent || 0)}% = {calculateReferralMoney(editingPlan, 1, 100).toFixed(2)}
                        </Typography.Text>
                        <Typography.Text>
                          {t('二级返利')}: {calculateReferralPool(editingPlan, 100).toFixed(2)} x {Number(editingPlan.level2_percent || 0)}% = {calculateReferralMoney(editingPlan, 2, 100).toFixed(2)}
                        </Typography.Text>
                        <Typography.Text type='secondary'>
                          {t('对应百分比')}: L1 {calculateActualRebate(editingPlan, 1)}% / L2 {calculateActualRebate(editingPlan, 2)}%
                        </Typography.Text>
                        <Button theme='light' type='tertiary' onClick={handleApplyPreset}>
                          {t('恢复建议值')}
                        </Button>
                      </Space>
                    </Card>
                  </Space>
                </Col>
              </Row>

            </Space>
          )}
        </Modal>
      )}
    </Card>
  );
}
