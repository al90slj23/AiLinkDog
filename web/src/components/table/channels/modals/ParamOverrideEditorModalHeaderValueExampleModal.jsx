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
import { Modal, Space, TextArea, Typography } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { HEADER_VALUE_JSONC_EXAMPLE } from './paramOverrideEditorModalConstants';

const { Text } = Typography;

const ParamOverrideEditorModalHeaderValueExampleModal = ({ visible, onCancel }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('anthropic-beta JSON 示例')}
      visible={visible}
      width={760}
      footer={null}
      onCancel={onCancel}
      bodyStyle={{ padding: 16, paddingBottom: 24 }}
    >
      <Space vertical align='start' spacing={12} style={{ width: '100%' }}>
        <Text type='tertiary' size='small'>
          {t('下面是带注释的示例，仅用于参考；实际保存时请删除注释。')}
        </Text>
        <TextArea
          value={HEADER_VALUE_JSONC_EXAMPLE}
          readOnly
          autosize={{ minRows: 16, maxRows: 20 }}
          style={{ marginBottom: 8 }}
        />
      </Space>
    </Modal>
  );
};

export default ParamOverrideEditorModalHeaderValueExampleModal;
