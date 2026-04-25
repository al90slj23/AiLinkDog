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
import {
  Col,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { SYNC_TARGET_TYPE_OPTIONS } from './paramOverrideEditorModalConstants';

const { Text } = Typography;

const ParamOverrideEditorModalSyncFieldsSection = ({
  selectedOperationId,
  syncFromTarget,
  syncToTarget,
  updateOperation,
  buildSyncTargetSpec,
}) => {
  const { t } = useTranslation();

  return (
    <div className='mt-2'>
      <Text type='tertiary' size='small'>
        {t('同步端点')}
      </Text>
      <Row gutter={12} style={{ marginTop: 6 }}>
        <Col xs={24} md={12}>
          <Text type='tertiary' size='small'>
            {t('来源端点')}
          </Text>
          <div className='flex gap-2'>
            <Select
              value={syncFromTarget?.type || 'json'}
              optionList={SYNC_TARGET_TYPE_OPTIONS}
              style={{ width: 120 }}
              onChange={(nextType) =>
                updateOperation(selectedOperationId, {
                  from: buildSyncTargetSpec(
                    nextType,
                    syncFromTarget?.key || '',
                  ),
                })
              }
            />
            <Input
              value={syncFromTarget?.key || ''}
              placeholder='session_id'
              onChange={(nextKey) =>
                updateOperation(selectedOperationId, {
                  from: buildSyncTargetSpec(
                    syncFromTarget?.type || 'json',
                    nextKey,
                  ),
                })
              }
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Text type='tertiary' size='small'>
            {t('目标端点')}
          </Text>
          <div className='flex gap-2'>
            <Select
              value={syncToTarget?.type || 'json'}
              optionList={SYNC_TARGET_TYPE_OPTIONS}
              style={{ width: 120 }}
              onChange={(nextType) =>
                updateOperation(selectedOperationId, {
                  to: buildSyncTargetSpec(nextType, syncToTarget?.key || ''),
                })
              }
            />
            <Input
              value={syncToTarget?.key || ''}
              placeholder='prompt_cache_key'
              onChange={(nextKey) =>
                updateOperation(selectedOperationId, {
                  to: buildSyncTargetSpec(
                    syncToTarget?.type || 'json',
                    nextKey,
                  ),
                })
              }
            />
          </div>
        </Col>
      </Row>
      <Space wrap style={{ marginTop: 8 }}>
        <Tag
          size='small'
          color='cyan'
          className='cursor-pointer'
          onClick={() =>
            updateOperation(selectedOperationId, {
              from: 'header:session_id',
              to: 'json:prompt_cache_key',
            })
          }
        >
          {'header:session_id -> json:prompt_cache_key'}
        </Tag>
        <Tag
          size='small'
          color='cyan'
          className='cursor-pointer'
          onClick={() =>
            updateOperation(selectedOperationId, {
              from: 'json:prompt_cache_key',
              to: 'header:session_id',
            })
          }
        >
          {'json:prompt_cache_key -> header:session_id'}
        </Tag>
      </Space>
    </div>
  );
};

export default ParamOverrideEditorModalSyncFieldsSection;
