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
import { Button, Col, Input, Row, Space, Tag, TextArea, Typography } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const ParamOverrideEditorModalReturnErrorSection = ({
  selectedOperationId,
  returnErrorDraft,
  updateReturnErrorDraft,
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
        <Text strong>{t('自定义错误响应')}</Text>
        <Space spacing={6} align='center'>
          <Text type='tertiary' size='small'>
            {t('模式')}
          </Text>
          <Button
            size='small'
            type={returnErrorDraft.simpleMode ? 'primary' : 'tertiary'}
            onClick={() => updateReturnErrorDraft(selectedOperationId, { simpleMode: true })}
          >
            {t('简洁')}
          </Button>
          <Button
            size='small'
            type={returnErrorDraft.simpleMode ? 'tertiary' : 'primary'}
            onClick={() => updateReturnErrorDraft(selectedOperationId, { simpleMode: false })}
          >
            {t('高级')}
          </Button>
        </Space>
      </div>

      <Text type='tertiary' size='small'>
        {t('错误消息（必填）')}
      </Text>
      <TextArea
        value={returnErrorDraft.message}
        autosize={{ minRows: 2, maxRows: 4 }}
        placeholder={t('例如：该请求不满足准入策略')}
        onChange={(nextValue) => updateReturnErrorDraft(selectedOperationId, { message: nextValue })}
      />

      {returnErrorDraft.simpleMode ? (
        <Text type='tertiary' size='small' className='mt-2 block'>
          {t('简洁模式仅返回 message；状态码和错误类型将使用系统默认值。')}
        </Text>
      ) : (
        <>
          <Row gutter={12} style={{ marginTop: 10 }}>
            <Col xs={24} md={8}>
              <Text type='tertiary' size='small'>
                {t('状态码')}
              </Text>
              <Input
                value={String(returnErrorDraft.statusCode ?? '')}
                placeholder='400'
                onChange={(nextValue) =>
                  updateReturnErrorDraft(selectedOperationId, {
                    statusCode: parseInt(nextValue, 10) || 400,
                  })
                }
              />
            </Col>
            <Col xs={24} md={8}>
              <Text type='tertiary' size='small'>
                {t('错误代码（可选）')}
              </Text>
              <Input
                value={returnErrorDraft.code}
                placeholder='forced_bad_request'
                onChange={(nextValue) => updateReturnErrorDraft(selectedOperationId, { code: nextValue })}
              />
            </Col>
            <Col xs={24} md={8}>
              <Text type='tertiary' size='small'>
                {t('错误类型（可选）')}
              </Text>
              <Input
                value={returnErrorDraft.type}
                placeholder='invalid_request_error'
                onChange={(nextValue) => updateReturnErrorDraft(selectedOperationId, { type: nextValue })}
              />
            </Col>
          </Row>
          <div className='mt-2 flex items-center gap-2'>
            <Text type='tertiary' size='small'>
              {t('重试建议')}
            </Text>
            <Button
              size='small'
              type={returnErrorDraft.skipRetry ? 'primary' : 'tertiary'}
              onClick={() => updateReturnErrorDraft(selectedOperationId, { skipRetry: true })}
            >
              {t('停止重试')}
            </Button>
            <Button
              size='small'
              type={returnErrorDraft.skipRetry ? 'tertiary' : 'primary'}
              onClick={() => updateReturnErrorDraft(selectedOperationId, { skipRetry: false })}
            >
              {t('允许重试')}
            </Button>
          </div>
          <Space wrap style={{ marginTop: 8 }}>
            <Tag
              size='small'
              color='grey'
              className='cursor-pointer'
              onClick={() =>
                updateReturnErrorDraft(selectedOperationId, {
                  statusCode: 400,
                  code: 'invalid_request',
                  type: 'invalid_request_error',
                })
              }
            >
              {t('参数错误')}
            </Tag>
            <Tag
              size='small'
              color='grey'
              className='cursor-pointer'
              onClick={() =>
                updateReturnErrorDraft(selectedOperationId, {
                  statusCode: 401,
                  code: 'unauthorized',
                  type: 'authentication_error',
                })
              }
            >
              {t('未授权')}
            </Tag>
            <Tag
              size='small'
              color='grey'
              className='cursor-pointer'
              onClick={() =>
                updateReturnErrorDraft(selectedOperationId, {
                  statusCode: 429,
                  code: 'rate_limited',
                  type: 'rate_limit_error',
                })
              }
            >
              {t('限流')}
            </Tag>
          </Space>
        </>
      )}
    </div>
  );
};

export default ParamOverrideEditorModalReturnErrorSection;
