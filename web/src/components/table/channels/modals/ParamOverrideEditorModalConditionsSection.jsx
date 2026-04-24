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
import { Button, Col, Collapse, Input, Row, Select, Space, Switch, Tag, Typography } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';
import { CONDITION_MODE_OPTIONS } from './paramOverrideEditorModalConstants';

const { Text } = Typography;

const ParamOverrideEditorModalConditionsSection = ({
  selectedOperation,
  conditions,
  selectedConditionKeys,
  updateOperation,
  addCondition,
  updateCondition,
  removeCondition,
  expandAllSelectedConditions,
  collapseAllSelectedConditions,
  handleConditionCollapseChange,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className='mt-3 rounded-xl p-3'
      style={{
        background: 'rgba(127, 127, 127, 0.08)',
      }}
    >
      <div className='flex items-center justify-between mb-2'>
        <Space align='center'>
          <Text>{t('条件规则')}</Text>
          <Select
            value={selectedOperation.logic || 'OR'}
            optionList={[
              { label: t('满足任一条件（OR）'), value: 'OR' },
              { label: t('必须全部满足（AND）'), value: 'AND' },
            ]}
            size='small'
            style={{ width: 180 }}
            onChange={(nextValue) => updateOperation(selectedOperation.id, { logic: nextValue })}
          />
        </Space>
        <Space spacing={6}>
          <Button size='small' type='tertiary' onClick={expandAllSelectedConditions}>
            {t('全部展开')}
          </Button>
          <Button size='small' type='tertiary' onClick={collapseAllSelectedConditions}>
            {t('全部收起')}
          </Button>
          <Button icon={<IconPlus />} size='small' onClick={() => addCondition(selectedOperation.id)}>
            {t('新增条件')}
          </Button>
        </Space>
      </div>

      {conditions.length === 0 ? (
        <Text type='tertiary' size='small'>
          {t('没有条件时，默认总是执行该操作。')}
        </Text>
      ) : (
        <Collapse
          keepDOM
          activeKey={selectedConditionKeys}
          onChange={(activeKeys) => handleConditionCollapseChange(selectedOperation.id, activeKeys)}
        >
          {conditions.map((condition, conditionIndex) => (
            <Collapse.Panel
              key={condition.id}
              itemKey={condition.id}
              header={
                <Space spacing={8}>
                  <Tag size='small'>{`C${conditionIndex + 1}`}</Tag>
                  <Text type='tertiary' size='small'>
                    {condition.path || t('未设置路径')}
                  </Text>
                </Space>
              }
            >
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <Text type='tertiary' size='small'>
                    {t('条件项设置')}
                  </Text>
                  <Button
                    theme='borderless'
                    type='danger'
                    icon={<IconDelete />}
                    size='small'
                    onClick={() => removeCondition(selectedOperation.id, condition.id)}
                  >
                    {t('删除条件')}
                  </Button>
                </div>
                <Row gutter={12}>
                  <Col xs={24} md={10}>
                    <Text type='tertiary' size='small'>
                      {t('字段路径')}
                    </Text>
                    <Input
                      value={condition.path}
                      placeholder='model'
                      onChange={(nextValue) =>
                        updateCondition(selectedOperation.id, condition.id, { path: nextValue })
                      }
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Text type='tertiary' size='small'>
                      {t('匹配方式')}
                    </Text>
                    <Select
                      value={condition.mode}
                      optionList={CONDITION_MODE_OPTIONS}
                      onChange={(nextValue) =>
                        updateCondition(selectedOperation.id, condition.id, { mode: nextValue })
                      }
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col xs={24} md={6}>
                    <Text type='tertiary' size='small'>
                      {t('匹配值')}
                    </Text>
                    <Input
                      value={condition.value_text}
                      placeholder='gpt'
                      onChange={(nextValue) =>
                        updateCondition(selectedOperation.id, condition.id, { value_text: nextValue })
                      }
                    />
                  </Col>
                </Row>
                <div className='mt-2 flex flex-wrap gap-3'>
                  <div className='flex items-center gap-2'>
                    <Text type='tertiary' size='small'>
                      {t('条件取反')}
                    </Text>
                    <Switch
                      checked={Boolean(condition.invert)}
                      checkedText={t('开')}
                      uncheckedText={t('关')}
                      onChange={(nextValue) =>
                        updateCondition(selectedOperation.id, condition.id, { invert: nextValue })
                      }
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <Text type='tertiary' size='small'>
                      {t('字段缺失视为命中')}
                    </Text>
                    <Switch
                      checked={Boolean(condition.pass_missing_key)}
                      checkedText={t('开')}
                      uncheckedText={t('关')}
                      onChange={(nextValue) =>
                        updateCondition(selectedOperation.id, condition.id, {
                          pass_missing_key: nextValue,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default ParamOverrideEditorModalConditionsSection;
