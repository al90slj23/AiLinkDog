import React from 'react';
import { Banner, Button, Form, Space, Typography } from '@douyinfe/semi-ui';
import JSONEditor from '../../../common/ui/JSONEditor';

const { Text } = Typography;

const EditChannelModalKeySection = ({
  REGION_EXAMPLE,
  canKeepDeprecatedDoubaoCodingPlan,
  channelId,
  doubaoApiClickCountRef,
  doubaoApiEditUnlocked,
  doubaoCodingPlanOptionLabel,
  formApi,
  handleApiConfigSecretClick,
  handleChannelOtherSettingsChange,
  handleInputChange,
  inputs,
  isEdit,
  isIonetLocked,
  keyMode,
  multiToSingle,
  setAutoBan,
  setKeyMode,
  setMultiKeyMode,
  showApiConfigCard,
  t,
}) => {
  return (
    <>
      {isEdit && inputs.channel_info?.is_multi_key && (
        <Form.Select
          field='key_mode'
          label={t('密钥更新模式')}
          placeholder={t('请选择密钥更新模式')}
          optionList={[
            { label: t('追加到现有密钥'), value: 'append' },
            { label: t('覆盖现有密钥'), value: 'replace' },
          ]}
          style={{ width: '100%' }}
          value={keyMode}
          onChange={(value) => setKeyMode(value)}
          extraText={
            <Text type='tertiary' size='small'>
              {keyMode === 'replace'
                ? t('覆盖模式：将完全替换现有的所有密钥')
                : t('追加模式：将新密钥添加到现有密钥列表末尾')}
            </Text>
          }
        />
      )}

      {multiToSingle && (
        <>
          <Form.Select
            field='multi_key_mode'
            label={t('密钥聚合模式')}
            placeholder={t('请选择多密钥使用策略')}
            optionList={[
              { label: t('随机'), value: 'random' },
              { label: t('轮询'), value: 'polling' },
            ]}
            style={{ width: '100%' }}
            value={inputs.multi_key_mode || 'random'}
            onChange={(value) => {
              setMultiKeyMode(value);
              handleInputChange('multi_key_mode', value);
            }}
          />
          {inputs.multi_key_mode === 'polling' && (
            <Banner
              type='warning'
              description={t(
                '轮询模式必须搭配Redis和内存缓存功能使用，否则性能将大幅降低，并且无法实现轮询功能',
              )}
              className='!rounded-lg mt-2'
            />
          )}
        </>
      )}

      {inputs.type === 18 && (
        <Form.Input
          field='other'
          label={t('模型版本')}
          placeholder={
            '请输入星火大模型版本，注意是接口地址中的版本号，例如：v2.1'
          }
          onChange={(value) => handleInputChange('other', value)}
          showClear
        />
      )}

      {inputs.type === 41 && (
        <JSONEditor
          key={`region-${isEdit ? channelId : 'new'}`}
          field='other'
          label={t('部署地区')}
          placeholder={t(
            '请输入部署地区，例如：us-central1\n支持使用模型映射格式\n{\n    "default": "us-central1",\n    "claude-3-5-sonnet-20240620": "europe-west1"\n}',
          )}
          value={inputs.other || ''}
          onChange={(value) => handleInputChange('other', value)}
          rules={[{ required: true, message: t('请填写部署地区') }]}
          template={REGION_EXAMPLE}
          templateLabel={t('填入模板')}
          editorType='region'
          formApi={formApi}
          extraText={t('设置默认地区和特定模型的专用地区')}
        />
      )}

      {inputs.type === 21 && (
        <Form.Input
          field='other'
          label={t('知识库 ID')}
          placeholder={'请输入知识库 ID，例如：123456'}
          onChange={(value) => handleInputChange('other', value)}
          showClear
        />
      )}

      {inputs.type === 39 && (
        <Form.Input
          field='other'
          label='Account ID'
          placeholder={'请输入Account ID，例如：d6b5da8hk1awo8nap34ube6gh'}
          onChange={(value) => handleInputChange('other', value)}
          showClear
        />
      )}

      {inputs.type === 49 && (
        <Form.Input
          field='other'
          label={t('智能体ID')}
          placeholder={'请输入智能体ID，例如：7342866812345'}
          onChange={(value) => handleInputChange('other', value)}
          showClear
        />
      )}

      {inputs.type === 1 && (
        <Form.Input
          field='openai_organization'
          label={t('组织')}
          placeholder={t('请输入组织org-xxx')}
          showClear
          helpText={t('组织，不填则为默认组织')}
          onChange={(value) => handleInputChange('openai_organization', value)}
        />
      )}

      {showApiConfigCard && (
        <div onClick={handleApiConfigSecretClick}>
          {inputs.type === 40 && (
            <Banner
              type='info'
              description={
                <div>
                  <Text strong>{t('邀请链接')}:</Text>
                  <Text
                    link
                    underline
                    className='ml-2 cursor-pointer'
                    onClick={() =>
                      window.open('https://cloud.siliconflow.cn/i/hij0YNTZ')
                    }
                  >
                    https://cloud.siliconflow.cn/i/hij0YNTZ
                  </Text>
                </div>
              }
              className='!rounded-lg'
            />
          )}

          {inputs.type === 3 && (
            <>
              <Banner
                type='warning'
                description={t(
                  '2025年5月10日后添加的渠道，不需要再在部署的时候移除模型名称中的"."',
                )}
                className='!rounded-lg'
              />
              <div>
                <Form.Input
                  field='base_url'
                  label='AZURE_OPENAI_ENDPOINT'
                  placeholder={t(
                    '请输入 AZURE_OPENAI_ENDPOINT，例如：https://docs-test-001.openai.azure.com',
                  )}
                  onChange={(value) => handleInputChange('base_url', value)}
                  showClear
                  disabled={isIonetLocked}
                />
              </div>
              <div>
                <Form.Input
                  field='other'
                  label={t('默认 API 版本')}
                  placeholder={t(
                    '请输入默认 API 版本，例如：2025-04-01-preview',
                  )}
                  onChange={(value) => handleInputChange('other', value)}
                  showClear
                />
              </div>
              <div>
                <Form.Input
                  field='azure_responses_version'
                  label={t('默认 Responses API 版本，为空则使用上方版本')}
                  placeholder={t('例如：preview')}
                  onChange={(value) =>
                    handleChannelOtherSettingsChange(
                      'azure_responses_version',
                      value,
                    )
                  }
                  showClear
                />
              </div>
            </>
          )}

          {inputs.type === 8 && (
            <>
              <Banner
                type='warning'
                description={t(
                  '如果你对接的是上游One API或者New API等转发项目，请使用OpenAI类型，不要使用此类型，除非你知道你在做什么。',
                )}
                className='!rounded-lg'
              />
              <div>
                <Form.Input
                  field='base_url'
                  label={t('完整的 Base URL，支持变量{model}')}
                  placeholder={t(
                    '请输入完整的URL，例如：https://api.openai.com/v1/chat/completions',
                  )}
                  onChange={(value) => handleInputChange('base_url', value)}
                  showClear
                  disabled={isIonetLocked}
                />
              </div>
            </>
          )}

          {inputs.type === 37 && (
            <Banner
              type='warning'
              description={t(
                'Dify渠道只适配chatflow和agent，并且agent不支持图片！',
              )}
              className='!rounded-lg'
            />
          )}

          {inputs.type !== 3 &&
            inputs.type !== 8 &&
            inputs.type !== 22 &&
            inputs.type !== 36 &&
            (inputs.type !== 45 || doubaoApiEditUnlocked) && (
              <div>
                <Form.Input
                  field='base_url'
                  label={t('API地址')}
                  placeholder={t(
                    '此项可选，用于通过自定义API地址来进行 API 调用，末尾不要带/v1和/',
                  )}
                  onChange={(value) => handleInputChange('base_url', value)}
                  showClear
                  disabled={isIonetLocked}
                  extraText={t(
                    '对于官方渠道，new-api已经内置地址，除非是第三方代理站点或者Azure的特殊接入地址，否则不需要填写',
                  )}
                />
              </div>
            )}

          {inputs.type === 22 && (
            <div>
              <Form.Input
                field='base_url'
                label={t('私有部署地址')}
                placeholder={t(
                  '请输入私有部署地址，格式为：https://fastgpt.run/api/openapi',
                )}
                onChange={(value) => handleInputChange('base_url', value)}
                showClear
                disabled={isIonetLocked}
              />
            </div>
          )}

          {inputs.type === 36 && (
            <div>
              <Form.Input
                field='base_url'
                label={t(
                  '注意非Chat API，请务必填写正确的API地址，否则可能导致无法使用',
                )}
                placeholder={t(
                  '请输入到 /suno 前的路径，通常就是域名，例如：https://api.example.com',
                )}
                onChange={(value) => handleInputChange('base_url', value)}
                showClear
                disabled={isIonetLocked}
              />
            </div>
          )}

          {inputs.type === 45 && !doubaoApiEditUnlocked && (
            <div>
              <Form.Select
                field='base_url'
                label={t('API地址')}
                placeholder={t('请选择API地址')}
                onChange={(value) => handleInputChange('base_url', value)}
                optionList={[
                  {
                    value: 'https://ark.cn-beijing.volces.com',
                    label: 'https://ark.cn-beijing.volces.com',
                  },
                  {
                    value: 'https://ark.ap-southeast.bytepluses.com',
                    label: 'https://ark.ap-southeast.bytepluses.com',
                  },
                  {
                    value: 'doubao-coding-plan',
                    label: doubaoCodingPlanOptionLabel,
                    disabled: !canKeepDeprecatedDoubaoCodingPlan,
                  },
                ]}
                defaultValue='https://ark.cn-beijing.volces.com'
                disabled={isIonetLocked}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EditChannelModalKeySection;
