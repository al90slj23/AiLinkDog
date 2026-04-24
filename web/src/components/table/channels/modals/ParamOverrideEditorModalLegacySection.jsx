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
import { Card, TextArea, Typography } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { LEGACY_TEMPLATE } from './paramOverrideEditorModalConstants';

const { Text } = Typography;

const ParamOverrideEditorModalLegacySection = ({ legacyValue, setLegacyValue }) => {
  const { t } = useTranslation();

  return (
    <Card
      className='!rounded-2xl !border-0'
      bodyStyle={{
        padding: 14,
        background: 'var(--semi-color-fill-0)',
      }}
    >
      <Text className='mb-2 block'>{t('旧格式（JSON 对象）')}</Text>
      <TextArea
        value={legacyValue}
        autosize={{ minRows: 10, maxRows: 20 }}
        placeholder={JSON.stringify(LEGACY_TEMPLATE, null, 2)}
        onChange={(nextValue) => setLegacyValue(nextValue)}
        showClear
      />
      <Text type='tertiary' size='small' className='mt-2 block'>
        {t('这里直接编辑 JSON 对象。适合简单覆盖参数的场景。')}
      </Text>
    </Card>
  );
};

export default ParamOverrideEditorModalLegacySection;
