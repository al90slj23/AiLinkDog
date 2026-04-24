import React from 'react';
import {
  Button,
  Dropdown,
  Form,
  Space,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import { IconChevronDown, IconSearch } from '@douyinfe/semi-icons';
import JSONEditor from '../../../common/ui/JSONEditor';

const { Text } = Typography;

const EditChannelModalModelSection = ({
  MODEL_FETCHABLE_CHANNEL_TYPES,
  MODEL_MAPPING_EXAMPLE,
  addCustomModels,
  autoBan,
  basicModels,
  copy,
  customModel,
  fetchUpstreamModelList,
  formApi,
  fullModels,
  groupOptions,
  handleInputChange,
  inputs,
  isEdit,
  modelGroups,
  modelOptions,
  modelSearchHintText,
  openModelMappingValueModal,
  setAutoBan,
  setCustomModel,
  setModelSearchValue,
  setOllamaModalVisible,
  showError,
  showInfo,
  showSuccess,
  t,
  channelId,
}) => {
  return (
    <>
      <Form.Select
        field='models'
        label={t('模型')}
        placeholder={t('请选择该渠道所支持的模型')}
        rules={[{ required: true, message: t('请选择模型') }]}
        multiple
        filter={(input, option) =>
          String(option?.value ?? '')
            .toLowerCase()
            .includes(String(input ?? '').toLowerCase())
        }
        allowCreate
        autoClearSearchValue={false}
        searchPosition='dropdown'
        optionList={modelOptions}
        onSearch={(value) => setModelSearchValue(value)}
        innerBottomSlot={
          modelSearchHintText ? (
            <Text className='px-3 py-2 block text-xs !text-semi-color-text-2'>
              {modelSearchHintText}
            </Text>
          ) : null
        }
        style={{ width: '100%' }}
        onChange={(value) => handleInputChange('models', value)}
        renderSelectedItem={(optionNode) => {
          const modelName = String(optionNode?.value ?? '');
          return {
            isRenderInTag: true,
            content: (
              <span
                className='cursor-pointer select-none'
                role='button'
                tabIndex={0}
                title={t('点击复制模型名称')}
                onClick={async (e) => {
                  e.stopPropagation();
                  const ok = await copy(modelName);
                  if (ok) {
                    showSuccess(t('已复制：{{name}}', { name: modelName }));
                  } else {
                    showError(t('复制失败'));
                  }
                }}
              >
                {optionNode.label || modelName}
              </span>
            ),
          };
        }}
        extraText={
          <Space>
            <Button
              size='small'
              type='primary'
              onClick={() => handleInputChange('models', basicModels)}
            >
              {t('填入相关模型')}
            </Button>
            {MODEL_FETCHABLE_CHANNEL_TYPES.has(inputs.type) && (
              <Button
                size='small'
                type='tertiary'
                onClick={() => fetchUpstreamModelList('models')}
              >
                {t('获取模型列表')}
              </Button>
            )}
            <Dropdown
              trigger='click'
              position='bottomRight'
              menu={[
                {
                  node: 'item',
                  name: t('填入所有模型'),
                  onClick: () => handleInputChange('models', fullModels),
                },
                ...(inputs.type === 4 && isEdit
                  ? [
                      {
                        node: 'item',
                        name: t('Ollama 模型管理'),
                        onClick: () => setOllamaModalVisible(true),
                      },
                    ]
                  : []),
                { node: 'divider' },
                {
                  node: 'item',
                  name: t('复制所有模型'),
                  onClick: async () => {
                    if (inputs.models.length === 0) {
                      showInfo(t('没有模型可以复制'));
                      return;
                    }
                    try {
                      await copy(inputs.models.join(','));
                      showSuccess(t('模型列表已复制到剪贴板'));
                    } catch {
                      showError(t('复制失败'));
                    }
                  },
                },
                {
                  node: 'item',
                  name: t('清除所有模型'),
                  type: 'danger',
                  onClick: () => handleInputChange('models', []),
                },
                ...(modelGroups && modelGroups.length > 0
                  ? [
                      { node: 'divider' },
                      ...modelGroups.map((group) => ({
                        node: 'item',
                        name: group.name,
                        onClick: () => {
                          let items = [];
                          try {
                            if (Array.isArray(group.items)) {
                              items = group.items;
                            } else if (typeof group.items === 'string') {
                              const parsed = JSON.parse(group.items || '[]');
                              if (Array.isArray(parsed)) items = parsed;
                            }
                          } catch {}
                          const current =
                            formApi?.getValue('models') || inputs.models || [];
                          const merged = Array.from(
                            new Set(
                              [...current, ...items]
                                .map((m) => (m || '').trim())
                                .filter(Boolean),
                            ),
                          );
                          handleInputChange('models', merged);
                        },
                      })),
                    ]
                  : []),
              ]}
            >
              <Button size='small' type='tertiary'>
                {t('更多')} <IconChevronDown size={12} />
              </Button>
            </Dropdown>
          </Space>
        }
      />

      <Form.Input
        field='custom_model'
        label={t('自定义模型名称')}
        placeholder={t('输入自定义模型名称')}
        onChange={(value) => setCustomModel(value.trim())}
        value={customModel}
        suffix={
          <Button size='small' type='primary' onClick={addCustomModels}>
            {t('填入')}
          </Button>
        }
      />

      <Form.Select
        field='groups'
        label={t('分组')}
        placeholder={t('请选择可以使用该渠道的分组')}
        multiple
        allowAdditions
        additionLabel={t('请在系统设置页面编辑分组倍率以添加新的分组：')}
        optionList={groupOptions}
        style={{ width: '100%' }}
        position='top'
        onChange={(value) => handleInputChange('groups', value)}
      />

      <JSONEditor
        key={`model_mapping-${isEdit ? channelId : 'new'}`}
        field='model_mapping'
        label={t('模型重定向')}
        placeholder={
          t(
            '此项可选，用于修改请求体中的模型名称，为一个 JSON 字符串，键为请求中模型名称，值为要替换的模型名称，例如：',
          ) + `\n${JSON.stringify(MODEL_MAPPING_EXAMPLE, null, 2)}`
        }
        value={inputs.model_mapping || ''}
        onChange={(value) => handleInputChange('model_mapping', value)}
        template={MODEL_MAPPING_EXAMPLE}
        templateLabel={t('填入模板')}
        editorType='keyValue'
        formApi={formApi}
        renderStringValueSuffix={({ pairKey, value }) => {
          if (!MODEL_FETCHABLE_CHANNEL_TYPES.has(inputs.type)) {
            return null;
          }
          const disabled = !String(pairKey ?? '').trim();
          return (
            <Tooltip content={t('选择模型')}>
              <Button
                type='tertiary'
                theme='borderless'
                size='small'
                icon={<IconSearch size={14} />}
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  openModelMappingValueModal({ pairKey, value });
                }}
              />
            </Tooltip>
          );
        }}
        extraText={t('键为请求中的模型名称，值为要替换的模型名称')}
      />

      <Form.Switch
        field='auto_ban'
        label={t('是否自动禁用')}
        checkedText={t('开')}
        uncheckedText={t('关')}
        onChange={(value) => setAutoBan(value)}
        extraText={t('仅当自动禁用开启时有效，关闭后不会自动禁用该渠道')}
        initValue={autoBan}
      />

      <Form.Input
        field='test_model'
        label={t('默认测试模型')}
        placeholder={t('不填则为模型列表第一个')}
        onChange={(value) => handleInputChange('test_model', value)}
        showClear
      />
    </>
  );
};

export default EditChannelModalModelSection;
