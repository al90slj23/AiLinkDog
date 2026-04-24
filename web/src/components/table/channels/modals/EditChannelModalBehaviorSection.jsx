import React from 'react';
import { Form, Row, Col, Typography } from '@douyinfe/semi-ui';

const { Text } = Typography;

const EditChannelModalBehaviorSection = ({
  inputs,
  t,
  handleInputChange,
  handleChannelOtherSettingsChange,
}) => {
  return (
    <div className='py-3 border-b border-gray-100'>
      <Text className='text-sm font-medium text-gray-500 mb-3 block'>
        {t('渠道行为')}
      </Text>

      <Form.Input
        field='tag'
        label={t('渠道标签')}
        placeholder={t('渠道标签')}
        showClear
        onChange={(value) => handleInputChange('tag', value)}
      />
      <Form.TextArea
        field='remark'
        label={t('备注')}
        placeholder={t('请输入备注（仅管理员可见）')}
        maxLength={255}
        showClear
        onChange={(value) => handleInputChange('remark', value)}
      />

      <Row gutter={12}>
        <Col span={12}>
          <Form.InputNumber
            field='priority'
            label={t('渠道优先级')}
            placeholder={t('渠道优先级')}
            min={0}
            onNumberChange={(value) => handleInputChange('priority', value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={12}>
          <Form.InputNumber
            field='weight'
            label={t('渠道权重')}
            placeholder={t('渠道权重')}
            min={0}
            onNumberChange={(value) => handleInputChange('weight', value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {inputs.type === 1 && (
        <>
          <div className='mt-4 mb-2 text-sm font-medium text-gray-700'>
            {t('字段透传控制')}
          </div>
          <Form.Switch
            field='allow_service_tier'
            label={t('允许 service_tier 透传')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(value) =>
              handleChannelOtherSettingsChange('allow_service_tier', value)
            }
            extraText={t(
              'service_tier 字段用于指定服务层级，允许透传可能导致实际计费高于预期。默认关闭以避免额外费用',
            )}
          />
          <Form.Switch
            field='disable_store'
            label={t('禁用 store 透传')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(value) =>
              handleChannelOtherSettingsChange('disable_store', value)
            }
            extraText={t(
              'store 字段用于授权 OpenAI 存储请求数据以评估和优化产品。默认关闭，开启后可能导致 Codex 无法正常使用',
            )}
          />
          <Form.Switch
            field='allow_safety_identifier'
            label={t('允许 safety_identifier 透传')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(value) =>
              handleChannelOtherSettingsChange('allow_safety_identifier', value)
            }
            extraText={t(
              'safety_identifier 字段用于帮助 OpenAI 识别可能违反使用政策的应用程序用户。默认关闭以保护用户隐私',
            )}
          />
          <Form.Switch
            field='allow_include_obfuscation'
            label={t('允许 stream_options.include_obfuscation 透传')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(value) =>
              handleChannelOtherSettingsChange(
                'allow_include_obfuscation',
                value,
              )
            }
            extraText={t(
              'include_obfuscation 用于控制 Responses 流混淆字段。默认关闭以避免客户端关闭该安全保护',
            )}
          />
        </>
      )}

      {inputs.type === 14 && (
        <>
          <div className='mt-4 mb-2 text-sm font-medium text-gray-700'>
            {t('字段透传控制')}
          </div>
          <Form.Switch
            field='allow_service_tier'
            label={t('允许 service_tier 透传')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(value) =>
              handleChannelOtherSettingsChange('allow_service_tier', value)
            }
            extraText={t(
              'service_tier 字段用于指定服务层级，允许透传可能导致实际计费高于预期。默认关闭以避免额外费用',
            )}
          />
          <Form.Switch
            field='allow_inference_geo'
            label={t('允许 inference_geo 透传')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(value) =>
              handleChannelOtherSettingsChange('allow_inference_geo', value)
            }
            extraText={t(
              'inference_geo 字段用于控制 Claude 数据驻留推理区域。默认关闭以避免未经授权透传地域信息',
            )}
          />
          <Form.Switch
            field='allow_speed'
            label={t('允许 speed 透传')}
            checkedText={t('开')}
            uncheckedText={t('关')}
            onChange={(value) =>
              handleChannelOtherSettingsChange('allow_speed', value)
            }
            extraText={t(
              'speed 字段用于控制 Claude 推理速度模式。默认关闭以避免意外切换到 fast 模式',
            )}
          />
        </>
      )}
    </div>
  );
};

export default EditChannelModalBehaviorSection;
