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
import { Button, Space, Tag, TextArea, Typography } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { OPERATION_TEMPLATE } from './paramOverrideEditorModalConstants';

const { Text } = Typography;

const ParamOverrideEditorModalJsonSection = ({
  jsonText,
  jsonError,
  formatJson,
  handleJsonChange,
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ width: '100%' }}>
      <Space style={{ marginBottom: 8 }} wrap>
        <Button onClick={formatJson}>{t('格式化')}</Button>
        <Tag color='grey'>{t('高级文本编辑')}</Tag>
      </Space>
      <TextArea
        value={jsonText}
        autosize={{ minRows: 18, maxRows: 28 }}
        onChange={(nextValue) => handleJsonChange(nextValue ?? '')}
        placeholder={JSON.stringify(OPERATION_TEMPLATE, null, 2)}
        showClear
      />
      <Text type='tertiary' size='small' className='mt-2 block'>
        {t('直接编辑 JSON 文本，保存时会校验格式。')}
      </Text>
      {jsonError ? (
        <Text className='text-red-500 text-xs mt-2'>{jsonError}</Text>
      ) : null}
    </div>
  );
};

export default ParamOverrideEditorModalJsonSection;
