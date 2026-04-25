import React from 'react';
import {
  Button,
  Dropdown,
  Form,
  Space,
  Tag,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import {
  IconChevronDown,
  IconCode,
  IconCopy,
  IconSearch,
} from '@douyinfe/semi-icons';
import JSONEditor from '../../../common/ui/JSONEditor';

const { Text } = Typography;

const EditChannelModalAdvancedSection = ({
  MODEL_FETCHABLE_CHANNEL_TYPES,
  STATUS_CODE_MAPPING_EXAMPLE,
  channelId,
  copyParamOverrideJson,
  clearParamOverride,
  formatJsonField,
  formatUnixTime,
  formApi,
  handleChannelOtherSettingsChange,
  handleInputChange,
  inputs,
  openModelMappingValueModal,
  paramOverrideMeta,
  t,
  applyParamOverrideTemplate,
  setParamOverrideEditorVisible,
  upstreamDetectedModels,
  upstreamDetectedModelsOmittedCount,
  upstreamDetectedModelsPreview,
}) => {
  return (
    <div className='space-y-4'>
      {MODEL_FETCHABLE_CHANNEL_TYPES.has(inputs.type) && (
        <div className='pb-3 border-b border-gray-100'>
          <Text className='text-sm font-medium text-gray-500 mb-3 block'>
            {t('上游模型管理')}
          </Text>

          <Form.Switch
            field='upstream_model_update_check_enabled'
            label={t('是否检测上游模型更新')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(value) =>
              handleChannelOtherSettingsChange(
                'upstream_model_update_check_enabled',
                value,
              )
            }
            extraText={t('开启后由后端定时任务检测该渠道上游模型变化')}
          />
          <Form.Switch
            field='upstream_model_update_auto_sync_enabled'
            label={t('是否自动同步上游模型更新')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            disabled={!inputs.upstream_model_update_check_enabled}
            onChange={(value) =>
              handleChannelOtherSettingsChange(
                'upstream_model_update_auto_sync_enabled',
                value,
              )
            }
            extraText={t('开启后检测到新增模型会自动加入当前渠道模型列表')}
          />
          <Form.Input
            field='upstream_model_update_ignored_models'
            label={t('已忽略模型')}
            placeholder={t(
              '例如：gpt-4.1-nano,regex:^claude-.*$,regex:^sora-.*$',
            )}
            extraText={t('支持精确匹配；使用 regex: 开头可按正则匹配。')}
            onChange={(value) =>
              handleInputChange('upstream_model_update_ignored_models', value)
            }
            showClear
          />
          <div className='text-xs text-gray-500 mb-2'>
            {t('上次检测时间')}:&nbsp;
            {formatUnixTime(inputs.upstream_model_update_last_check_time)}
          </div>
          <div className='text-xs text-gray-500 mb-3'>
            {t('上次检测到可加入模型')}:&nbsp;
            {upstreamDetectedModels.length === 0 ? (
              t('暂无')
            ) : (
              <>
                <Tooltip
                  position='topLeft'
                  content={
                    <div className='max-w-[640px] break-all text-xs leading-5'>
                      {upstreamDetectedModels.join(', ')}
                    </div>
                  }
                >
                  <span className='cursor-help break-all'>
                    {upstreamDetectedModelsPreview.join(', ')}
                  </span>
                </Tooltip>
                <span className='ml-1 text-gray-400'>
                  {upstreamDetectedModelsOmittedCount > 0
                    ? t('（共 {{total}} 个，省略 {{omit}} 个）', {
                        total: upstreamDetectedModels.length,
                        omit: upstreamDetectedModelsOmittedCount,
                      })
                    : t('（共 {{total}} 个）', {
                        total: upstreamDetectedModels.length,
                      })}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div className='py-3 border-b border-gray-100'>
        <Text className='text-sm font-medium text-gray-500 mb-3 block'>
          {t('请求配置')}
        </Text>

        <div className='mb-4'>
          <div className='flex items-center justify-between gap-2 mb-1'>
            <Text className='text-sm font-medium'>{t('参数覆盖')}</Text>
            <Space>
              <Button
                size='small'
                type='primary'
                icon={<IconCode size={14} />}
                onClick={() => setParamOverrideEditorVisible(true)}
              >
                {t('可视化编辑')}
              </Button>
              <Dropdown
                trigger='click'
                position='bottomRight'
                menu={[
                  {
                    node: 'item',
                    name: t('填充新模板'),
                    onClick: () =>
                      applyParamOverrideTemplate('operations', 'fill'),
                  },
                  {
                    node: 'item',
                    name: t('填充旧模板'),
                    onClick: () => applyParamOverrideTemplate('legacy', 'fill'),
                  },
                  {
                    node: 'item',
                    name: t('清空'),
                    onClick: clearParamOverride,
                  },
                ]}
              >
                <Button size='small' type='tertiary'>
                  {t('更多')} <IconChevronDown size={12} />
                </Button>
              </Dropdown>
            </Space>
          </div>
          <Text type='tertiary' size='small'>
            {t('此项可选，用于覆盖请求参数。不支持覆盖 stream 参数')}
          </Text>
          <div
            className='mt-2 rounded-xl p-3'
            style={{
              backgroundColor: 'var(--semi-color-fill-0)',
              border: '1px solid var(--semi-color-fill-2)',
            }}
          >
            <div className='flex items-center justify-between mb-2'>
              <Tag color={paramOverrideMeta.tagColor}>
                {paramOverrideMeta.tagLabel}
              </Tag>
              <Button
                size='small'
                icon={<IconCopy />}
                type='tertiary'
                onClick={copyParamOverrideJson}
              >
                {t('复制')}
              </Button>
            </div>
            <pre className='mb-0 text-xs leading-5 whitespace-pre-wrap break-all max-h-56 overflow-auto'>
              {paramOverrideMeta.preview}
            </pre>
          </div>
        </div>

        <Form.TextArea
          field='header_override'
          label={t('请求头覆盖')}
          placeholder={
            t('此项可选，用于覆盖请求头参数') +
            '\n' +
            t('格式示例：') +
            '\n{\n  "User-Agent": "Mozilla/5.0 ...",\n  "Authorization": "Bearer {api_key}"\n}'
          }
          autosize
          onChange={(value) => handleInputChange('header_override', value)}
          extraText={
            <div className='flex flex-col gap-1'>
              <div className='flex gap-2 flex-wrap items-center'>
                <Text
                  className='!text-semi-color-primary cursor-pointer'
                  onClick={() =>
                    handleInputChange(
                      'header_override',
                      JSON.stringify(
                        {
                          '*': true,
                          're:^X-Trace-.*$': true,
                          'X-Foo': '{client_header:X-Foo}',
                          Authorization: 'Bearer {api_key}',
                          'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0',
                        },
                        null,
                        2,
                      ),
                    )
                  }
                >
                  {t('填入模板')}
                </Text>
                <Text
                  className='!text-semi-color-primary cursor-pointer'
                  onClick={() =>
                    handleInputChange(
                      'header_override',
                      JSON.stringify({ '*': true }, null, 2),
                    )
                  }
                >
                  {t('填入透传模版')}
                </Text>
                <Text
                  className='!text-semi-color-primary cursor-pointer'
                  onClick={() => formatJsonField('header_override')}
                >
                  {t('格式化')}
                </Text>
              </div>
              <div>
                <Text type='tertiary' size='small'>
                  {t('支持变量：')}
                </Text>
                <div className='text-xs text-tertiary ml-2'>
                  <div>
                    {t('渠道密钥')}: {'{api_key}'}
                  </div>
                </div>
              </div>
            </div>
          }
          showClear
        />
        <JSONEditor
          key={`status_code_mapping-${channelId}`}
          field='status_code_mapping'
          label={t('状态码复写')}
          placeholder={
            t(
              '此项可选，用于复写返回的状态码，仅影响本地判断，不修改返回到上游的状态码，比如将claude渠道的400错误复写为500（用于重试），请勿滥用该功能，例如：',
            ) +
            '\n' +
            JSON.stringify(STATUS_CODE_MAPPING_EXAMPLE, null, 2)
          }
          value={inputs.status_code_mapping || ''}
          onChange={(value) => handleInputChange('status_code_mapping', value)}
          template={STATUS_CODE_MAPPING_EXAMPLE}
          templateLabel={t('填入模板')}
          editorType='keyValue'
          formApi={formApi}
          extraText={t('键为原状态码，值为要复写的状态码，仅影响本地判断')}
        />
      </div>
    </div>
  );
};

export default EditChannelModalAdvancedSection;
