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
import { Button, Col, Input, Row, Select, Space, Tag, Typography } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';
import { OPERATION_MODE_OPTIONS } from './paramOverrideEditorModalConstants';
import {
  getModeDescription,
  getModePathLabel,
  getModePathPlaceholder,
  getOperationSummary,
} from './paramOverrideEditorModalDerived';

const { Text } = Typography;

const ParamOverrideEditorModalOperationHeaderSection = ({
  selectedOperation,
  selectedOperationIndex,
  meta,
  updateOperation,
  duplicateOperation,
  removeOperation,
}) => {
  const { t } = useTranslation();
  const mode = selectedOperation.mode || 'set';

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <Space>
          <Tag color='blue'>{`#${selectedOperationIndex + 1}`}</Tag>
          <Text strong>{getOperationSummary(selectedOperation, selectedOperationIndex)}</Text>
        </Space>
        <Space>
          <Button
            size='small'
            type='tertiary'
            onClick={() => duplicateOperation(selectedOperation.id)}
          >
            {t('复制')}
          </Button>
          <Button
            size='small'
            type='danger'
            theme='borderless'
            icon={<IconDelete />}
            aria-label={t('删除规则')}
            onClick={() => removeOperation(selectedOperation.id)}
          />
        </Space>
      </div>

      <Row gutter={12}>
        <Col xs={24} md={8}>
          <Text type='tertiary' size='small'>
            {t('操作类型')}
          </Text>
          <Select
            value={mode}
            optionList={OPERATION_MODE_OPTIONS}
            onChange={(nextMode) => updateOperation(selectedOperation.id, { mode: nextMode })}
            style={{ width: '100%' }}
          />
        </Col>
        {meta.path || meta.pathOptional ? (
          <Col xs={24} md={16}>
            <Text type='tertiary' size='small'>
              {meta.pathOptional ? t('目标路径（可选）') : t(getModePathLabel(mode))}
            </Text>
            <Input
              value={selectedOperation.path}
              placeholder={getModePathPlaceholder(mode)}
              onChange={(nextValue) => updateOperation(selectedOperation.id, { path: nextValue })}
            />
          </Col>
        ) : null}
      </Row>

      <Text type='tertiary' size='small' className='mt-1 block'>
        {getModeDescription(mode)}
      </Text>

      <div className='mt-2'>
        <Text type='tertiary' size='small'>
          {t('规则描述（可选）')}
        </Text>
        <Input
          value={selectedOperation.description || ''}
          placeholder={t('例如：清理工具参数，避免上游校验错误')}
          onChange={(nextValue) =>
            updateOperation(selectedOperation.id, { description: nextValue || '' })
          }
          maxLength={180}
          showClear
        />
        <Text type='tertiary' size='small' className='mt-1 block'>
          {`${String(selectedOperation.description || '').length}/180`}
        </Text>
      </div>
    </>
  );
};

export default ParamOverrideEditorModalOperationHeaderSection;
