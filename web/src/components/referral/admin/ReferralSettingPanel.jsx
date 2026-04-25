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

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Form,
  Skeleton,
  Space,
  Typography,
} from '@douyinfe/semi-ui';

export default function ReferralSettingPanel({ loading, setting, onSave }) {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({});

  useEffect(() => {
    setFormState({
      enabled: setting?.enabled ?? false,
      default_link_validity_days: setting?.default_link_validity_days ?? 0,
      allow_custom_link_validity: setting?.allow_custom_link_validity ?? true,
      min_withdrawal_amount: setting?.min_withdrawal_amount ?? 0,
      withdrawal_fee_percent: setting?.withdrawal_fee_percent ?? 0,
      withdrawal_fee_fixed: setting?.withdrawal_fee_fixed ?? 0,
      auto_approve_withdrawal: setting?.auto_approve_withdrawal ?? false,
      commission_cap_enabled: setting?.commission_cap_enabled ?? false,
      monthly_commission_cap: setting?.monthly_commission_cap ?? 0,
    });
  }, [setting]);

  return (
    <Card>
      <Space vertical spacing={16} style={{ width: '100%' }}>
        <div>
          <Typography.Title heading={5}>{t('返利配置')}</Typography.Title>
          <Typography.Text type='tertiary'>
            {t(
              '这里直接维护返利系统的全局参数，保存后按当前真实配置立即生效。',
            )}
          </Typography.Text>
        </div>

        <Skeleton
          loading={loading}
          active
          placeholder={<Skeleton.Paragraph rows={6} />}
        >
          <Form layout='vertical'>
            <Form.Switch
              field='enabled'
              label={t('启用邀请返利')}
              checked={formState.enabled}
              onChange={(value) =>
                setFormState((state) => ({ ...state, enabled: value }))
              }
            />
            <Form.InputNumber
              field='default_link_validity_days'
              label={t('默认链接有效期（天）')}
              value={formState.default_link_validity_days}
              onChange={(value) =>
                setFormState((state) => ({
                  ...state,
                  default_link_validity_days: Number(value || 0),
                }))
              }
            />
            <Form.Switch
              field='allow_custom_link_validity'
              label={t('允许用户自定义链接有效期')}
              checked={formState.allow_custom_link_validity}
              onChange={(value) =>
                setFormState((state) => ({
                  ...state,
                  allow_custom_link_validity: value,
                }))
              }
            />
            <Form.InputNumber
              field='min_withdrawal_amount'
              label={t('最低提现金额')}
              value={formState.min_withdrawal_amount}
              onChange={(value) =>
                setFormState((state) => ({
                  ...state,
                  min_withdrawal_amount: Number(value || 0),
                }))
              }
            />
            <Form.InputNumber
              field='withdrawal_fee_percent'
              label={t('提现手续费比例')}
              value={formState.withdrawal_fee_percent}
              onChange={(value) =>
                setFormState((state) => ({
                  ...state,
                  withdrawal_fee_percent: Number(value || 0),
                }))
              }
            />
            <Form.InputNumber
              field='withdrawal_fee_fixed'
              label={t('固定手续费')}
              value={formState.withdrawal_fee_fixed}
              onChange={(value) =>
                setFormState((state) => ({
                  ...state,
                  withdrawal_fee_fixed: Number(value || 0),
                }))
              }
            />
            <Form.Switch
              field='auto_approve_withdrawal'
              label={t('自动审核提现')}
              checked={formState.auto_approve_withdrawal}
              onChange={(value) =>
                setFormState((state) => ({
                  ...state,
                  auto_approve_withdrawal: value,
                }))
              }
            />
            <Form.Switch
              field='commission_cap_enabled'
              label={t('启用月度佣金上限')}
              checked={formState.commission_cap_enabled}
              onChange={(value) =>
                setFormState((state) => ({
                  ...state,
                  commission_cap_enabled: value,
                }))
              }
            />
            <Form.InputNumber
              field='monthly_commission_cap'
              label={t('月度佣金上限')}
              value={formState.monthly_commission_cap}
              onChange={(value) =>
                setFormState((state) => ({
                  ...state,
                  monthly_commission_cap: Number(value || 0),
                }))
              }
            />
          </Form>
        </Skeleton>

        <div>
          <Button
            theme='solid'
            type='primary'
            onClick={() => onSave?.(formState)}
          >
            {t('保存配置')}
          </Button>
        </div>
      </Space>
    </Card>
  );
}
