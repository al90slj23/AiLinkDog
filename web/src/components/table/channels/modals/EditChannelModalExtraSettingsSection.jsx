import React from 'react';
import { Form, Typography } from '@douyinfe/semi-ui';

const { Text } = Typography;

const EditChannelModalExtraSettingsSection = ({
  inputs,
  t,
  handleChannelSettingsChange,
  handleChannelOtherSettingsChange,
}) => {
  return (
    <div className='pt-3'>
      <Text className='text-sm font-medium text-gray-500 mb-3 block'>
        {t('额外设置')}
      </Text>

      {inputs.type === 14 && (
        <Form.Switch
          field='claude_beta_query'
          label={t('Claude 强制 beta=true')}
          checkedText={t('开')}
          uncheckedText={t('关')}
          onChange={(value) =>
            handleChannelOtherSettingsChange('claude_beta_query', value)
          }
          extraText={t(
            '开启后，该渠道请求 Claude 时将强制追加 ?beta=true（无需客户端手动传参）',
          )}
        />
      )}

      {inputs.type === 1 && (
        <Form.Switch
          field='force_format'
          label={t('强制格式化')}
          checkedText={t('开')}
          uncheckedText={t('关')}
          onChange={(value) => handleChannelSettingsChange('force_format', value)}
          extraText={t(
            '强制将响应格式化为 OpenAI 标准格式（只适用于OpenAI渠道类型）',
          )}
        />
      )}

      <Form.Switch
        field='thinking_to_content'
        label={t('思考内容转换')}
        checkedText={t('开')}
        uncheckedText={t('关')}
        onChange={(value) =>
          handleChannelSettingsChange('thinking_to_content', value)
        }
        extraText={t('将 reasoning_content 转换为 <think> 标签拼接到内容中')}
      />
      <Form.Switch
        field='pass_through_body_enabled'
        label={t('透传请求体')}
        checkedText={t('开')}
        uncheckedText={t('关')}
        onChange={(value) =>
          handleChannelSettingsChange('pass_through_body_enabled', value)
        }
        extraText={t('启用请求体透传功能')}
      />

      <Form.Input
        field='proxy'
        label={t('代理地址')}
        placeholder={t('例如: socks5://user:pass@host:port')}
        onChange={(value) => handleChannelSettingsChange('proxy', value)}
        showClear
        extraText={t('用于配置网络代理，支持 socks5 协议')}
      />

      <Form.TextArea
        field='system_prompt'
        label={t('系统提示词')}
        placeholder={t('输入系统提示词，用户的系统提示词将优先于此设置')}
        onChange={(value) => handleChannelSettingsChange('system_prompt', value)}
        autosize
        showClear
        extraText={t(
          '用户优先：如果用户在请求中指定了系统提示词，将优先使用用户的设置',
        )}
      />
      <Form.Switch
        field='system_prompt_override'
        label={t('系统提示词拼接')}
        checkedText={t('开')}
        uncheckedText={t('关')}
        onChange={(value) =>
          handleChannelSettingsChange('system_prompt_override', value)
        }
        extraText={t(
          '如果用户请求中包含系统提示词，则使用此设置拼接到用户的系统提示词前面',
        )}
      />
    </div>
  );
};

export default EditChannelModalExtraSettingsSection;
