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
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';
import { CONDITION_MODE_OPTIONS } from './paramOverrideEditorModalConstants';

const { Text } = Typography;

const ParamOverrideEditorModalPruneObjectsSection = ({
  selectedOperationId,
  pruneObjectsDraft,
  updatePruneObjectsDraft,
  addPruneRule,
  updatePruneRule,
  removePruneRule,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className='mt-2 rounded-xl p-3'
      style={{
        background: 'var(--semi-color-bg-1)',
        border: '1px solid var(--semi-color-border)',
      }}
    >
      <div className='flex items-center justify-between mb-2'>
        <Text strong>{t('对象清理规则')}</Text>
        <Space spacing={6} align='center'>
          <Text type='tertiary' size='small'>
            {t('模式')}
          </Text>
          <Button
            size='small'
            type={pruneObjectsDraft.simpleMode ? 'primary' : 'tertiary'}
            onClick={() => updatePruneObjectsDraft(selectedOperationId, { simpleMode: true })}
          >
            {t('简洁')}
          </Button>
          <Button
            size='small'
            type={pruneObjectsDraft.simpleMode ? 'tertiary' : 'primary'}
            onClick={() => updatePruneObjectsDraft(selectedOperationId, { simpleMode: false })}
          >
            {t('高级')}
          </Button>
        </Space>
      </div>

      <Text type='tertiary' size='small'>
        {t('类型（常用）')}
      </Text>
      <Input
        value={pruneObjectsDraft.typeText}
        placeholder='redacted_thinking'
        onChange={(nextValue) => updatePruneObjectsDraft(selectedOperationId, { typeText: nextValue })}
      />

      {pruneObjectsDraft.simpleMode ? (
        <Text type='tertiary' size='small' className='mt-2 block'>
          {t('简洁模式：按 type 全量清理对象，例如 redacted_thinking。')}
        </Text>
      ) : (
        <>
          <Row gutter={12} style={{ marginTop: 10 }}>
            <Col xs={24} md={12}>
              <Text type='tertiary' size='small'>
                {t('逻辑')}
              </Text>
              <Select
                value={pruneObjectsDraft.logic}
                optionList={[
                  { label: t('全部满足（AND）'), value: 'AND' },
                  { label: t('任一满足（OR）'), value: 'OR' },
                ]}
                style={{ width: '100%' }}
                onChange={(nextValue) =>
                  updatePruneObjectsDraft(selectedOperationId, { logic: nextValue || 'AND' })
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <Text type='tertiary' size='small'>
                {t('递归策略')}
              </Text>
              <Space spacing={6} style={{ marginTop: 2 }}>
                <Button
                  size='small'
                  type={pruneObjectsDraft.recursive ? 'primary' : 'tertiary'}
                  onClick={() => updatePruneObjectsDraft(selectedOperationId, { recursive: true })}
                >
                  {t('递归')}
                </Button>
                <Button
                  size='small'
                  type={pruneObjectsDraft.recursive ? 'tertiary' : 'primary'}
                  onClick={() => updatePruneObjectsDraft(selectedOperationId, { recursive: false })}
                >
                  {t('仅当前层')}
                </Button>
              </Space>
            </Col>
          </Row>

          <div className='mt-2 rounded-lg p-2' style={{ background: 'var(--semi-color-fill-0)' }}>
            <div className='flex items-center justify-between mb-2'>
              <Text strong>{t('附加条件')}</Text>
              <Button size='small' icon={<IconPlus />} onClick={() => addPruneRule(selectedOperationId)}>
                {t('新增条件')}
              </Button>
            </div>
            {(pruneObjectsDraft.rules || []).length === 0 ? (
              <Text type='tertiary' size='small'>
                {t('未添加附加条件时，仅使用上方 type 进行清理。')}
              </Text>
            ) : (
              <div className='flex flex-col gap-2'>
                {(pruneObjectsDraft.rules || []).map((rule, ruleIndex) => (
                  <div
                    key={rule.id}
                    className='rounded-lg p-2'
                    style={{
                      border: '1px solid var(--semi-color-border)',
                      background: 'var(--semi-color-bg-0)',
                    }}
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <Tag size='small'>{`R${ruleIndex + 1}`}</Tag>
                      <Button
                        size='small'
                        type='danger'
                        theme='borderless'
                        icon={<IconDelete />}
                        onClick={() => removePruneRule(selectedOperationId, rule.id)}
                      >
                        {t('删除条件')}
                      </Button>
                    </div>
                    <Row gutter={8}>
                      <Col xs={24} md={9}>
                        <Text type='tertiary' size='small'>
                          {t('字段路径')}
                        </Text>
                        <Input
                          value={rule.path}
                          placeholder='type'
                          onChange={(nextValue) => updatePruneRule(selectedOperationId, rule.id, { path: nextValue })}
                        />
                      </Col>
                      <Col xs={24} md={7}>
                        <Text type='tertiary' size='small'>
                          {t('匹配方式')}
                        </Text>
                        <Select
                          value={rule.mode}
                          optionList={CONDITION_MODE_OPTIONS}
                          style={{ width: '100%' }}
                          onChange={(nextValue) => updatePruneRule(selectedOperationId, rule.id, { mode: nextValue })}
                        />
                      </Col>
                      <Col xs={24} md={8}>
                        <Text type='tertiary' size='small'>
                          {t('匹配值（可选）')}
                        </Text>
                        <Input
                          value={rule.value_text}
                          placeholder='redacted_thinking'
                          onChange={(nextValue) =>
                            updatePruneRule(selectedOperationId, rule.id, { value_text: nextValue })
                          }
                        />
                      </Col>
                    </Row>
                    <Space wrap spacing={8} style={{ marginTop: 8 }}>
                      <Button
                        size='small'
                        type={rule.invert ? 'primary' : 'tertiary'}
                        onClick={() => updatePruneRule(selectedOperationId, rule.id, { invert: !rule.invert })}
                      >
                        {t('条件取反')}
                      </Button>
                      <Button
                        size='small'
                        type={rule.pass_missing_key ? 'primary' : 'tertiary'}
                        onClick={() =>
                          updatePruneRule(selectedOperationId, rule.id, {
                            pass_missing_key: !rule.pass_missing_key,
                          })
                        }
                      >
                        {t('字段缺失视为命中')}
                      </Button>
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ParamOverrideEditorModalPruneObjectsSection;
