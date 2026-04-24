import React from 'react';
import {
  Banner,
  Button,
  Form,
  Space,
  Typography,
} from '@douyinfe/semi-ui';
import { IconBolt } from '@douyinfe/semi-icons';
import CodexOAuthModal from './CodexOAuthModal';

const { Text } = Typography;

const EditChannelModalPrimaryKeyInputSection = ({
  batch,
  batchExtra,
  codexCredentialRefreshing,
  codexOAuthModalVisible,
  formApi,
  handleChannelOtherSettingsChange,
  handleCodexOAuthGenerated,
  handleInputChange,
  handleRefreshCodexCredential,
  handleShow2FAModal,
  handleVertexUploadChange,
  inputs,
  isEdit,
  isIonetLocked,
  isMultiKeyChannel,
  keyMode,
  setBatch,
  setCodexOAuthModalVisible,
  setInputs,
  setUseManualInput,
  setVertexFileList,
  setVertexKeys,
  t,
  type2secretPrompt,
  useManualInput,
  vertexFileList,
}) => {
  return (
    <>
      {inputs.type === 33 && (
        <Form.Select
          field='aws_key_type'
          label={t('密钥格式')}
          placeholder={t('请选择密钥格式')}
          optionList={[
            {
              label: 'AccessKey / SecretAccessKey',
              value: 'ak_sk',
            },
            { label: 'API Key', value: 'api_key' },
          ]}
          style={{ width: '100%' }}
          value={inputs.aws_key_type || 'ak_sk'}
          onChange={(value) => {
            handleChannelOtherSettingsChange('aws_key_type', value);
          }}
          extraText={t(
            'AK/SK 模式：使用 AccessKey 和 SecretAccessKey；API Key 模式：使用 API Key',
          )}
        />
      )}

      {inputs.type === 41 && (
        <Form.Select
          field='vertex_key_type'
          label={t('密钥格式')}
          placeholder={t('请选择密钥格式')}
          optionList={[
            { label: 'JSON', value: 'json' },
            { label: 'API Key', value: 'api_key' },
          ]}
          style={{ width: '100%' }}
          value={inputs.vertex_key_type || 'json'}
          onChange={(value) => {
            handleChannelOtherSettingsChange('vertex_key_type', value);
            if (value === 'api_key') {
              setBatch(false);
              setUseManualInput(false);
              setVertexKeys([]);
              setVertexFileList([]);
              if (formApi) {
                formApi.setValue('vertex_files', []);
              }
            }
          }}
          extraText={
            inputs.vertex_key_type === 'api_key'
              ? t('API Key 模式下不支持批量创建')
              : t('JSON 模式支持手动输入或上传服务账号 JSON')
          }
        />
      )}

      {batch ? (
        inputs.type === 41 && (inputs.vertex_key_type || 'json') === 'json' ? (
          <Form.Upload
            field='vertex_files'
            label={t('密钥文件 (.json)')}
            accept='.json'
            multiple
            draggable
            dragIcon={<IconBolt />}
            dragMainText={t('点击上传文件或拖拽文件到这里')}
            dragSubText={t('仅支持 JSON 文件，支持多文件')}
            style={{ marginTop: 10 }}
            uploadTrigger='custom'
            beforeUpload={() => false}
            onChange={handleVertexUploadChange}
            fileList={vertexFileList}
            rules={
              isEdit
                ? []
                : [{ required: true, message: t('请上传密钥文件') }]
            }
            extraText={batchExtra}
          />
        ) : (
          <Form.TextArea
            field='key'
            label={t('密钥')}
            placeholder={
              inputs.type === 33
                ? inputs.aws_key_type === 'api_key'
                  ? t('请输入 API Key，一行一个，格式：APIKey|Region')
                  : t('请输入密钥，一行一个，格式：AccessKey|SecretAccessKey|Region')
                : t('请输入密钥，一行一个')
            }
            rules={
              isEdit ? [] : [{ required: true, message: t('请输入密钥') }]
            }
            autosize
            autoComplete='new-password'
            onChange={(value) => handleInputChange('key', value)}
            disabled={isIonetLocked}
            extraText={
              <div className='flex items-center gap-2 flex-wrap'>
                {isEdit && isMultiKeyChannel && keyMode === 'append' && (
                  <Text type='warning' size='small'>
                    {t('追加模式：新密钥将添加到现有密钥列表的末尾')}
                  </Text>
                )}
                {isEdit && (
                  <Button
                    size='small'
                    type='primary'
                    theme='outline'
                    onClick={handleShow2FAModal}
                  >
                    {t('查看密钥')}
                  </Button>
                )}
                {batchExtra}
              </div>
            }
            showClear
          />
        )
      ) : (
        <>
          {inputs.type === 57 ? (
            <>
              <Form.TextArea
                field='key'
                label={isEdit ? t('密钥（编辑模式下，保存的密钥不会显示）') : t('密钥')}
                placeholder={t(
                  '请输入 JSON 格式的 OAuth 凭据，例如：\n{\n  "access_token": "...",\n  "account_id": "..." \n}',
                )}
                rules={
                  isEdit ? [] : [{ required: true, message: t('请输入密钥') }]
                }
                autoComplete='new-password'
                onChange={(value) => handleInputChange('key', value)}
                disabled={isIonetLocked}
                extraText={
                  <div className='flex flex-col gap-2'>
                    <Text type='tertiary' size='small'>
                      {t('仅支持 JSON 对象，必须包含 access_token 与 account_id')}
                    </Text>

                    <Space wrap spacing='tight'>
                      <Button
                        size='small'
                        type='primary'
                        theme='outline'
                        onClick={() => setCodexOAuthModalVisible(true)}
                        disabled={isIonetLocked}
                      >
                        {t('Codex 授权')}
                      </Button>
                      {isEdit && (
                        <Button
                          size='small'
                          type='primary'
                          theme='outline'
                          onClick={handleRefreshCodexCredential}
                          loading={codexCredentialRefreshing}
                          disabled={isIonetLocked}
                        >
                          {t('刷新凭证')}
                        </Button>
                      )}
                      {isEdit && (
                        <Button
                          size='small'
                          type='primary'
                          theme='outline'
                          onClick={handleShow2FAModal}
                          disabled={isIonetLocked}
                        >
                          {t('查看密钥')}
                        </Button>
                      )}
                      {batchExtra}
                    </Space>
                  </div>
                }
                autosize
                showClear
              />

              <CodexOAuthModal
                visible={codexOAuthModalVisible}
                onCancel={() => setCodexOAuthModalVisible(false)}
                onSuccess={handleCodexOAuthGenerated}
              />
            </>
          ) : inputs.type === 41 && (inputs.vertex_key_type || 'json') === 'json' ? (
            <>
              {!batch && (
                <div className='flex items-center justify-between mb-3'>
                  <Text className='text-sm font-medium'>{t('密钥输入方式')}</Text>
                  <Space>
                    <Button
                      size='small'
                      type={!useManualInput ? 'primary' : 'tertiary'}
                      onClick={() => {
                        setUseManualInput(false);
                        if (formApi) {
                          formApi.setValue('key', '');
                        }
                        handleInputChange('key', '');
                      }}
                    >
                      {t('文件上传')}
                    </Button>
                    <Button
                      size='small'
                      type={useManualInput ? 'primary' : 'tertiary'}
                      onClick={() => {
                        setUseManualInput(true);
                        setVertexKeys([]);
                        setVertexFileList([]);
                        if (formApi) {
                          formApi.setValue('vertex_files', []);
                        }
                        setInputs((prev) => ({
                          ...prev,
                          vertex_files: [],
                        }));
                      }}
                    >
                      {t('手动输入')}
                    </Button>
                  </Space>
                </div>
              )}

              {batch && (
                <Banner
                  type='info'
                  description={t('批量创建模式下仅支持文件上传，不支持手动输入')}
                  className='!rounded-lg mb-3'
                />
              )}

              {useManualInput && !batch ? (
                <Form.TextArea
                  field='key'
                  label={
                    isEdit ? t('密钥（编辑模式下，保存的密钥不会显示）') : t('密钥')
                  }
                  placeholder={t(
                    '请输入 JSON 格式的密钥内容，例如：\n{\n  "type": "service_account",\n  "project_id": "your-project-id",\n  "private_key_id": "...",\n  "private_key": "...",\n  "client_email": "...",\n  "client_id": "...",\n  "auth_uri": "...",\n  "token_uri": "...",\n  "auth_provider_x509_cert_url": "...",\n  "client_x509_cert_url": "..."\n}',
                  )}
                  rules={
                    isEdit ? [] : [{ required: true, message: t('请输入密钥') }]
                  }
                  autoComplete='new-password'
                  onChange={(value) => handleInputChange('key', value)}
                  extraText={
                    <div className='flex items-center gap-2'>
                      <Text type='tertiary' size='small'>
                        {t('请输入完整的 JSON 格式密钥内容')}
                      </Text>
                      {isEdit && isMultiKeyChannel && keyMode === 'append' && (
                        <Text type='warning' size='small'>
                          {t('追加模式：新密钥将添加到现有密钥列表的末尾')}
                        </Text>
                      )}
                      {isEdit && (
                        <Button
                          size='small'
                          type='primary'
                          theme='outline'
                          onClick={handleShow2FAModal}
                        >
                          {t('查看密钥')}
                        </Button>
                      )}
                      {batchExtra}
                    </div>
                  }
                  autosize
                  showClear
                />
              ) : (
                <Form.Upload
                  field='vertex_files'
                  label={t('密钥文件 (.json)')}
                  accept='.json'
                  draggable
                  dragIcon={<IconBolt />}
                  dragMainText={t('点击上传文件或拖拽文件到这里')}
                  dragSubText={t('仅支持 JSON 文件')}
                  style={{ marginTop: 10 }}
                  uploadTrigger='custom'
                  beforeUpload={() => false}
                  onChange={handleVertexUploadChange}
                  fileList={vertexFileList}
                  rules={
                    isEdit ? [] : [{ required: true, message: t('请上传密钥文件') }]
                  }
                  extraText={batchExtra}
                />
              )}
            </>
          ) : (
            <Form.Input
              field='key'
              label={isEdit ? t('密钥（编辑模式下，保存的密钥不会显示）') : t('密钥')}
              placeholder={
                inputs.type === 33
                  ? inputs.aws_key_type === 'api_key'
                    ? t('请输入 API Key，格式：APIKey|Region')
                    : t('按照如下格式输入：AccessKey|SecretAccessKey|Region')
                  : t(type2secretPrompt(inputs.type))
              }
              rules={isEdit ? [] : [{ required: true, message: t('请输入密钥') }]}
              autoComplete='new-password'
              onChange={(value) => handleInputChange('key', value)}
              extraText={
                <div className='flex items-center gap-2'>
                  {isEdit && isMultiKeyChannel && keyMode === 'append' && (
                    <Text type='warning' size='small'>
                      {t('追加模式：新密钥将添加到现有密钥列表的末尾')}
                    </Text>
                  )}
                  {isEdit && (
                    <Button
                      size='small'
                      type='primary'
                      theme='outline'
                      onClick={handleShow2FAModal}
                    >
                      {t('查看密钥')}
                    </Button>
                  )}
                  {batchExtra}
                </div>
              }
              showClear
            />
          )}
        </>
      )}
    </>
  );
};

export default EditChannelModalPrimaryKeyInputSection;
