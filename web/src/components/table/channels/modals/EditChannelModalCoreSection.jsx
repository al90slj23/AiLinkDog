import React from 'react';
import {
  Avatar,
  Banner,
  Button,
  Card,
  Form,
  Space,
  Typography,
} from '@douyinfe/semi-ui';
import { IconGlobe, IconServer } from '@douyinfe/semi-icons';
import { selectFilter } from '../../../../helpers';

const { Text } = Typography;

const EditChannelModalCoreSection = ({
  t,
  inputs,
  channelOptionList,
  channelSearchValue,
  renderChannelOption,
  isIonetChannel,
  ionetMetadata,
  isIonetLocked,
  handleOpenIonetDeployment,
  handleInputChange,
  handleEnterpriseAccountChange,
  setChannelSearchValue,
}) => {
  return (
    <Card className='!rounded-2xl shadow-sm border-0'>
      <div className='flex items-center mb-4'>
        <Avatar size='small' color='blue' className='mr-2 shadow-md'>
          <IconServer size={16} />
        </Avatar>
        <div>
          <Text className='text-lg font-medium'>{t('核心配置')}</Text>
          <div className='text-xs text-gray-600'>
            {t('创建渠道所需的基本信息')}
          </div>
        </div>
      </div>

      {isIonetChannel && (
        <Banner
          type='info'
          closeIcon={null}
          className='mb-4 rounded-xl'
          description={t(
            '此渠道由 IO.NET 自动同步，类型、密钥和 API 地址已锁定。',
          )}
        >
          <Space>
            {ionetMetadata?.deployment_id && (
              <Button
                size='small'
                theme='light'
                type='primary'
                icon={<IconGlobe />}
                onClick={handleOpenIonetDeployment}
              >
                {t('查看关联部署')}
              </Button>
            )}
          </Space>
        </Banner>
      )}

      <Form.Select
        field='type'
        label={t('类型')}
        placeholder={t('请选择渠道类型')}
        rules={[{ required: true, message: t('请选择渠道类型') }]}
        optionList={channelOptionList}
        style={{ width: '100%' }}
        filter={selectFilter}
        autoClearSearchValue={false}
        searchPosition='dropdown'
        onSearch={(value) => setChannelSearchValue(value)}
        renderOptionItem={renderChannelOption}
        onChange={(value) => handleInputChange('type', value)}
        disabled={isIonetLocked}
      />

      {inputs.type === 57 && (
        <Banner
          type='warning'
          closeIcon={null}
          className='mb-4 rounded-xl'
          description={t(
            '免责声明：仅限个人使用，请勿分发或共享任何凭证。该渠道存在前置条件与使用门槛，请在充分了解流程与风险后使用，并遵守 OpenAI 的相关条款与政策。相关凭证与配置仅限接入 Codex CLI 使用，不适用于其他客户端、平台或渠道。',
          )}
        />
      )}

      {inputs.type === 20 && (
        <Form.Switch
          field='is_enterprise_account'
          label={t('是否为企业账户')}
          checkedText={t('是')}
          uncheckedText={t('否')}
          onChange={handleEnterpriseAccountChange}
          extraText={t(
            '企业账户为特殊返回格式，需要特殊处理，如果非企业账户，请勿勾选',
          )}
          initValue={inputs.is_enterprise_account}
        />
      )}

      <Form.Input
        field='name'
        label={t('名称')}
        placeholder={t('请为渠道命名')}
        rules={[{ required: true, message: t('请为渠道命名') }]}
        showClear
        onChange={(value) => handleInputChange('name', value)}
        autoComplete='new-password'
      />
    </Card>
  );
};

export default EditChannelModalCoreSection;
