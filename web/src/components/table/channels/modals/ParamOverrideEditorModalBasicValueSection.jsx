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
  Button,
  Col,
  Input,
  Row,
  Space,
  Switch,
  TextArea,
  Typography,
} from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import {
  getModeFromLabel,
  getModeFromPlaceholder,
  getModeToLabel,
  getModeToPlaceholder,
  getModeValueLabel,
  getModeValuePlaceholder,
} from './paramOverrideEditorModalDerived';

const { Text } = Typography;

const ParamOverrideEditorModalBasicValueSection = ({
  selectedOperation,
  meta,
  mode,
  updateOperation,
  setHeaderValueExampleVisible,
  formatSelectedOperationValueAsJson,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {meta.value ? (
        <div className='mt-2'>
          <div className='flex items-center justify-between gap-2'>
            <Text type='tertiary' size='small'>
              {t(getModeValueLabel(mode))}
            </Text>
            {mode === 'set_header' ? (
              <Space spacing={6}>
                <Button
                  size='small'
                  type='tertiary'
                  onClick={() => setHeaderValueExampleVisible(true)}
                >
                  {t('查看 JSON 示例')}
                </Button>
                <Button
                  size='small'
                  type='tertiary'
                  onClick={formatSelectedOperationValueAsJson}
                >
                  {t('格式化 JSON')}
                </Button>
              </Space>
            ) : null}
          </div>
          {mode === 'set_header' ? (
            <Text type='tertiary' size='small' className='mt-1 mb-2 block'>
              {t(
                '纯字符串会直接覆盖整条请求头，或者点击“查看 JSON 示例”按 token 规则处理。',
              )}
            </Text>
          ) : null}
          <TextArea
            value={selectedOperation.value_text}
            autosize={{ minRows: 1, maxRows: 4 }}
            placeholder={getModeValuePlaceholder(mode)}
            onChange={(nextValue) =>
              updateOperation(selectedOperation.id, { value_text: nextValue })
            }
          />
        </div>
      ) : null}

      {meta.keepOrigin ? (
        <div className='mt-2 flex items-center gap-2'>
          <Switch
            checked={Boolean(selectedOperation.keep_origin)}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(nextValue) =>
              updateOperation(selectedOperation.id, { keep_origin: nextValue })
            }
          />
          <Text type='tertiary' size='small' className='leading-6'>
            {t('保留原值（目标已有值时不覆盖）')}
          </Text>
        </div>
      ) : null}

      {meta.from || meta.to === false || meta.to ? (
        <Row gutter={12} style={{ marginTop: 8 }}>
          {meta.from || meta.to === false ? (
            <Col xs={24} md={12}>
              <Text type='tertiary' size='small'>
                {t(getModeFromLabel(mode))}
              </Text>
              <Input
                value={selectedOperation.from}
                placeholder={getModeFromPlaceholder(mode)}
                onChange={(nextValue) =>
                  updateOperation(selectedOperation.id, { from: nextValue })
                }
              />
            </Col>
          ) : null}
          {meta.to || meta.to === false ? (
            <Col xs={24} md={12}>
              <Text type='tertiary' size='small'>
                {t(getModeToLabel(mode))}
              </Text>
              <Input
                value={selectedOperation.to}
                placeholder={getModeToPlaceholder(mode)}
                onChange={(nextValue) =>
                  updateOperation(selectedOperation.id, { to: nextValue })
                }
              />
            </Col>
          ) : null}
        </Row>
      ) : null}
    </>
  );
};

export default ParamOverrideEditorModalBasicValueSection;
