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

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  API,
  showError,
  showInfo,
  showSuccess,
  verifyJSON,
} from '../../../../helpers';
import { useIsMobile } from '../../../../hooks/common/useIsMobile';
import { CHANNEL_OPTIONS, MODEL_FETCHABLE_CHANNEL_TYPES } from '../../../../constants';
import {
  SideSheet,
  Space,
  Spin,
  Button,
  Typography,
  Checkbox,
  Banner,
  Modal,
  ImagePreview,
  Card,
  Tag,
  Avatar,
  Form,
  Row,
  Col,
  Highlight,
  Input,
  Tooltip,
  Collapse,
  Dropdown,
} from '@douyinfe/semi-ui';
import {
  getChannelModels,
  copy,
  getChannelIcon,
  getModelCategories,
  selectFilter,
} from '../../../../helpers';
import ModelSelectModal from './ModelSelectModal';
import SingleModelSelectModal from './SingleModelSelectModal';
import OllamaModelModal from './OllamaModelModal';
import CodexOAuthModal from './CodexOAuthModal';
import ParamOverrideEditorModal from './ParamOverrideEditorModal';
import EditChannelModalBehaviorSection from './EditChannelModalBehaviorSection';
import EditChannelModalCoreSection from './EditChannelModalCoreSection';
import EditChannelModalExtraSettingsSection from './EditChannelModalExtraSettingsSection';
import EditChannelModalAdvancedSection from './EditChannelModalAdvancedSection';
import EditChannelModalKeySection from './EditChannelModalKeySection';
import EditChannelModalModelSection from './EditChannelModalModelSection';
import EditChannelModalPrimaryKeyInputSection from './EditChannelModalPrimaryKeyInputSection';
import {
  buildParamOverrideMeta,
  buildRedirectModelList,
  buildUpstreamDetectedModels,
  formatUnixTimeValue,
} from './editChannelModalDerived';
import {
  buildGroupOptions,
  buildModelOptions,
  buildUniqueModels,
} from './editChannelModalData';
import {
  deriveAdvancedSettingsOpen,
  normalizeLoadedChannelData,
  parseIonetMetadata,
} from './editChannelModalLoadChannel';
import { buildLoadedChannelStateBundle } from './editChannelModalLoadState';
import { buildSubmitPayload } from './editChannelModalSubmit';
import {
  normalizeFetchedModels,
  prepareModelMappingModalState,
} from './editChannelModalUpstream';
import {
  collectMissingMappedModels,
  normalizeSubmitInputs,
  parseModelMappingOrThrow,
} from './editChannelModalSubmitValidation';
import { prepareSubmitInputsBeforeValidation } from './editChannelModalSubmitPreparation';
import { buildSubmitInteractionState } from './editChannelModalSubmitFlow';
import { useEditChannelModalState } from './useEditChannelModalState';
import { useEditChannelModalEffects } from './useEditChannelModalEffects';
import {
  buildCopiedParamOverrideContent,
  buildParamOverrideTemplateValue,
  parseParamOverrideInputValue,
} from './editChannelModalParamOverride';
import {
  buildCustomModelMergeResult,
  buildDeduplicatedKeysResult,
} from './editChannelModalActions';
import JSONEditor from '../../../common/ui/JSONEditor';
import SecureVerificationModal from '../../../common/modals/SecureVerificationModal';
import StatusCodeRiskGuardModal from './StatusCodeRiskGuardModal';
import ChannelKeyDisplay from '../../../common/ui/ChannelKeyDisplay';
import { useSecureVerification } from '../../../../hooks/common/useSecureVerification';
import { parseChannelConnectionString } from '../../../../helpers/token';
import { createApiCalls } from '../../../../services/secureVerification';
import {
  collectInvalidStatusCodeEntries,
  collectNewDisallowedStatusCodeRedirects,
} from './statusCodeRiskGuard';
import {
  ADVANCED_SETTINGS_EXPANDED_KEY,
  DEPRECATED_DOUBAO_CODING_PLAN_BASE_URL,
  MODEL_FETCHABLE_TYPES,
  MODEL_MAPPING_EXAMPLE,
  PARAM_OVERRIDE_LEGACY_TEMPLATE,
  PARAM_OVERRIDE_OPERATIONS_TEMPLATE,
  REGION_EXAMPLE,
  STATUS_CODE_MAPPING_EXAMPLE,
  type2secretPrompt,
  UPSTREAM_DETECTED_MODEL_PREVIEW_LIMIT,
} from './editChannelModalConstants';
import {
  IconSave,
  IconClose,
  IconServer,
  IconSetting,
  IconCode,
  IconCopy,
  IconGlobe,
  IconBolt,
  IconSearch,
  IconChevronDown,
} from '@douyinfe/semi-icons';

const { Text, Title } = Typography;

const EditChannelModal = (props) => {
  const { t } = useTranslation();
  const channelId = props.editingChannel.id;
  const isEdit = channelId !== undefined;
  const [loading, setLoading] = useState(isEdit);
  const isMobile = useIsMobile();
  const handleCancel = () => {
    props.handleClose();
  };
  const originInputs = {
    name: '',
    type: 1,
    key: '',
    openai_organization: '',
    max_input_tokens: 0,
    base_url: '',
    other: '',
    model_mapping: '',
    param_override: '',
    status_code_mapping: '',
    models: [],
    auto_ban: 1,
    test_model: '',
    groups: ['default'],
    priority: 0,
    weight: 0,
    tag: '',
    multi_key_mode: 'random',
    // 渠道额外设置的默认值
    force_format: false,
    thinking_to_content: false,
    proxy: '',
    pass_through_body_enabled: false,
    system_prompt: '',
    system_prompt_override: false,
    settings: '',
    // 仅 Vertex: 密钥格式（存入 settings.vertex_key_type）
    vertex_key_type: 'json',
    // 仅 AWS: 密钥格式和区域（存入 settings.aws_key_type 和 settings.aws_region）
    aws_key_type: 'ak_sk',
    // 企业账户设置
    is_enterprise_account: false,
    // 字段透传控制默认值
    allow_service_tier: false,
    disable_store: false, // false = 允许透传（默认开启）
    allow_safety_identifier: false,
    allow_include_obfuscation: false,
    allow_inference_geo: false,
    allow_speed: false,
    claude_beta_query: false,
    upstream_model_update_check_enabled: false,
    upstream_model_update_auto_sync_enabled: false,
    upstream_model_update_last_check_time: 0,
    upstream_model_update_last_detected_models: [],
    upstream_model_update_ignored_models: '',
  };
  const formApiRef = useRef(null);
  const vertexErroredNames = useRef(new Set()); // 避免重复报错
  const {
    batch,
    setBatch,
    multiToSingle,
    setMultiToSingle,
    multiKeyMode,
    setMultiKeyMode,
    autoBan,
    setAutoBan,
    inputs,
    setInputs,
    originModelOptions,
    setOriginModelOptions,
    modelOptions,
    setModelOptions,
    groupOptions,
    setGroupOptions,
    basicModels,
    setBasicModels,
    fullModels,
    setFullModels,
    modelGroups,
    setModelGroups,
    customModel,
    setCustomModel,
    modelSearchValue,
    setModelSearchValue,
    modalImageUrl,
    setModalImageUrl,
    isModalOpenurl,
    setIsModalOpenurl,
    modelModalVisible,
    setModelModalVisible,
    fetchedModels,
    setFetchedModels,
    modelMappingValueModalVisible,
    setModelMappingValueModalVisible,
    modelMappingValueModalModels,
    setModelMappingValueModalModels,
    modelMappingValueKey,
    setModelMappingValueKey,
    modelMappingValueSelected,
    setModelMappingValueSelected,
    ollamaModalVisible,
    setOllamaModalVisible,
    vertexKeys,
    setVertexKeys,
    vertexFileList,
    setVertexFileList,
    isMultiKeyChannel,
    setIsMultiKeyChannel,
    channelSearchValue,
    setChannelSearchValue,
    useManualInput,
    setUseManualInput,
    keyMode,
    setKeyMode,
    isEnterpriseAccount,
    setIsEnterpriseAccount,
    doubaoApiEditUnlocked,
    setDoubaoApiEditUnlocked,
    isIonetChannel,
    setIsIonetChannel,
    ionetMetadata,
    setIonetMetadata,
    codexOAuthModalVisible,
    setCodexOAuthModalVisible,
    codexCredentialRefreshing,
    setCodexCredentialRefreshing,
    paramOverrideEditorVisible,
    setParamOverrideEditorVisible,
    keyDisplayState,
    setKeyDisplayState,
    show2FAVerifyModal,
    setShow2FAVerifyModal,
    verifyCode,
    setVerifyCode,
    verifyLoading,
    setVerifyLoading,
    statusCodeRiskConfirmVisible,
    setStatusCodeRiskConfirmVisible,
    statusCodeRiskDetailItems,
    setStatusCodeRiskDetailItems,
    clipboardConfig,
    setClipboardConfig,
    advancedSettingsOpen,
    setAdvancedSettingsOpen,
    channelSettings,
    setChannelSettings,
    redirectModelList,
    upstreamDetectedModels,
    upstreamDetectedModelsPreview,
    upstreamDetectedModelsOmittedCount,
    modelSearchHintText,
    paramOverrideMeta,
  } = useEditChannelModalState({
    isEdit,
    originInputs,
    t,
    verifyJSON,
  });

  useEffect(() => {
    if (!isEdit) {
      setIsIonetChannel(false);
      setIonetMetadata(null);
    }
  }, [isEdit]);

  const handleOpenIonetDeployment = () => {
    if (!ionetMetadata?.deployment_id) {
      return;
    }
    const targetUrl = `/console/deployment?deployment_id=${ionetMetadata.deployment_id}`;
    window.open(targetUrl, '_blank', 'noopener');
  };
  const statusCodeRiskConfirmResolverRef = useRef(null);
  const toggleAdvancedSettings = (open) => {
    setAdvancedSettingsOpen(open);
    localStorage.setItem(ADVANCED_SETTINGS_EXPANDED_KEY, String(open));
  };
  const formContainerRef = useRef(null);
  const doubaoApiClickCountRef = useRef(0);
  const initialBaseUrlRef = useRef('');
  const initialModelsRef = useRef([]);
  const initialModelMappingRef = useRef('');
  const initialStatusCodeMappingRef = useRef('');
  const doubaoCodingPlanDeprecationMessage =
    'Doubao Coding Plan 不再允许新增。根据火山方舟文档，Coding 套餐额度仅适用于 AI Coding 产品内调用，不适用于单独 API 调用；在非 AI Coding 产品中使用对应的 Base URL 和 API Key 可能被视为违规，并可能导致订阅停用或账号封禁。';
  const canKeepDeprecatedDoubaoCodingPlan =
    initialBaseUrlRef.current === DEPRECATED_DOUBAO_CODING_PLAN_BASE_URL;
  const doubaoCodingPlanOptionLabel = (
    <Tooltip content={doubaoCodingPlanDeprecationMessage} position='left'>
      <span className='inline-flex items-center gap-2'>
        <span>Doubao Coding Plan</span>
      </span>
    </Tooltip>
  );

  // 2FA状态更新辅助函数
  const updateTwoFAState = (updates) => {
    setTwoFAState((prev) => ({ ...prev, ...updates }));
  };
  // 使用通用安全验证 Hook
  const {
    isModalVisible,
    verificationMethods,
    verificationState,
    withVerification,
    executeVerification,
    cancelVerification,
    setVerificationCode,
    switchVerificationMethod,
  } = useSecureVerification({
    onSuccess: (result) => {
      // 验证成功后显示密钥
      console.log('Verification success, result:', result);
      if (result && result.success && result.data?.key) {
        showSuccess(t('密钥获取成功'));
        setKeyDisplayState({
          showModal: true,
          keyData: result.data.key,
        });
      } else if (result && result.key) {
        // 直接返回了 key（没有包装在 data 中）
        showSuccess(t('密钥获取成功'));
        setKeyDisplayState({
          showModal: true,
          keyData: result.key,
        });
      }
    },
  });

  // 重置密钥显示状态
  const resetKeyDisplayState = () => {
    setKeyDisplayState({
      showModal: false,
      keyData: '',
    });
  };

  // 重置2FA验证状态
  const reset2FAVerifyState = () => {
    setShow2FAVerifyModal(false);
    setVerifyCode('');
    setVerifyLoading(false);
  };

  const handleApiConfigSecretClick = () => {
    if (inputs.type !== 45) return;
    const next = doubaoApiClickCountRef.current + 1;
    doubaoApiClickCountRef.current = next;
    if (next >= 10) {
      setDoubaoApiEditUnlocked((unlocked) => {
        if (!unlocked) {
          showInfo(t('已解锁豆包自定义 API 地址编辑'));
        }
        return true;
      });
    }
  };

  const showApiConfigCard = true; // 控制是否显示 API 配置卡片
  const getInitValues = () => ({ ...originInputs });

  // 处理渠道额外设置的更新
  const handleChannelSettingsChange = (key, value) => {
    // 更新内部状态
    setChannelSettings((prev) => ({ ...prev, [key]: value }));

    // 同步更新到表单字段
    if (formApiRef.current) {
      formApiRef.current.setValue(key, value);
    }

    // 同步更新inputs状态
    setInputs((prev) => ({ ...prev, [key]: value }));

    // 生成setting JSON并更新
    const newSettings = { ...channelSettings, [key]: value };
    const settingsJson = JSON.stringify(newSettings);
    handleInputChange('setting', settingsJson);
  };

  const handleChannelOtherSettingsChange = (key, value) => {
    // 更新内部状态
    setChannelSettings((prev) => ({ ...prev, [key]: value }));

    // 同步更新到表单字段
    if (formApiRef.current) {
      formApiRef.current.setValue(key, value);
    }

    // 同步更新inputs状态
    setInputs((prev) => ({ ...prev, [key]: value }));

    // 需要更新settings，是一个json，例如{"azure_responses_version": "preview"}
    let settings = {};
    if (inputs.settings) {
      try {
        settings = JSON.parse(inputs.settings);
      } catch (error) {
        console.error('解析设置失败:', error);
      }
    }
    settings[key] = value;
    const settingsJson = JSON.stringify(settings);
    handleInputChange('settings', settingsJson);
  };

  const applyClipboardConfig = (config) => {
    if (!config) return;
    setInputs((prev) => ({
      ...prev,
      key: config.key,
      base_url: config.url,
    }));
    if (formApiRef.current) {
      formApiRef.current.setValue('key', config.key);
      formApiRef.current.setValue('base_url', config.url);
    }
    setClipboardConfig(null);
    showSuccess(t('连接信息已填入'));
  };

  const pasteFromClipboard = async () => {
    if (!navigator?.clipboard?.readText) {
      showError(t('无法读取剪贴板'));
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseChannelConnectionString(text);
      if (parsed) {
        applyClipboardConfig(parsed);
      } else {
        showInfo(t('剪贴板中未检测到连接信息'));
      }
    } catch {
      showError(t('无法读取剪贴板'));
    }
  };

  const isIonetLocked = isIonetChannel && isEdit;

  const handleInputChange = (name, value) => {
    if (
      isIonetChannel &&
      isEdit &&
      ['type', 'key', 'base_url'].includes(name)
    ) {
      return;
    }
    if (formApiRef.current) {
      formApiRef.current.setValue(name, value);
    }
    if (name === 'models' && Array.isArray(value)) {
      value = Array.from(new Set(value.map((m) => (m || '').trim())));
    }

    if (name === 'base_url' && value.endsWith('/v1')) {
      Modal.confirm({
        title: '警告',
        content:
          '不需要在末尾加/v1，New API会自动处理，添加后可能导致请求失败，是否继续？',
        onOk: () => {
          setInputs((inputs) => ({ ...inputs, [name]: value }));
        },
      });
      return;
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    if (name === 'type') {
      let localModels = [];
      switch (value) {
        case 2:
          localModels = [
            'mj_imagine',
            'mj_variation',
            'mj_reroll',
            'mj_blend',
            'mj_upscale',
            'mj_describe',
            'mj_uploads',
          ];
          break;
        case 5:
          localModels = [
            'swap_face',
            'mj_imagine',
            'mj_video',
            'mj_edits',
            'mj_variation',
            'mj_reroll',
            'mj_blend',
            'mj_upscale',
            'mj_describe',
            'mj_zoom',
            'mj_shorten',
            'mj_modal',
            'mj_inpaint',
            'mj_custom_zoom',
            'mj_high_variation',
            'mj_low_variation',
            'mj_pan',
            'mj_uploads',
          ];
          break;
        case 36:
          localModels = ['suno_music', 'suno_lyrics'];
          break;
        case 45:
          localModels = getChannelModels(value);
          setInputs((prevInputs) => ({
            ...prevInputs,
            base_url: 'https://ark.cn-beijing.volces.com',
          }));
          break;
        default:
          localModels = getChannelModels(value);
          break;
      }
      if (inputs.models.length === 0) {
        setInputs((inputs) => ({ ...inputs, models: localModels }));
      }
      setBasicModels(localModels);

      // 重置手动输入模式状态
      setUseManualInput(false);

      if (value === 57) {
        setBatch(false);
        setMultiToSingle(false);
        setMultiKeyMode('random');
        setVertexKeys([]);
        setVertexFileList([]);
        if (formApiRef.current) {
          formApiRef.current.setValue('vertex_files', []);
        }
        setInputs((prev) => ({ ...prev, vertex_files: [] }));
      }
    }
    //setAutoBan
  };

  const formatJsonField = (fieldName) => {
    const rawValue = (inputs?.[fieldName] ?? '').trim();
    if (!rawValue) return;

    try {
      const parsed = JSON.parse(rawValue);
      handleInputChange(fieldName, JSON.stringify(parsed, null, 2));
    } catch (error) {
      showError(`${t('JSON格式错误')}: ${error.message}`);
    }
  };

  const formatUnixTime = (timestamp) => formatUnixTimeValue(timestamp, t);

  const copyParamOverrideJson = async () => {
    const raw = typeof inputs.param_override === 'string' ? inputs.param_override.trim() : '';
    if (!raw) {
      showInfo(t('暂无可复制 JSON'));
      return;
    }

    const content = buildCopiedParamOverrideContent(raw);

    const ok = await copy(content);
    if (ok) {
      showSuccess(t('参数覆盖 JSON 已复制'));
    } else {
      showError(t('复制失败'));
    }
  };

  const parseParamOverrideInput = () => {
    return parseParamOverrideInputValue(inputs.param_override, verifyJSON, t);
  };

  const applyParamOverrideTemplate = (
    templateType = 'operations',
    applyMode = 'fill',
  ) => {
    try {
      const parsedCurrent = parseParamOverrideInput();
      const nextValue = buildParamOverrideTemplateValue({
        templateType,
        applyMode,
        parsedCurrent,
        legacyTemplate: PARAM_OVERRIDE_LEGACY_TEMPLATE,
        operationsTemplate: PARAM_OVERRIDE_OPERATIONS_TEMPLATE,
      });
      handleInputChange('param_override', nextValue);
    } catch (error) {
      showError(error.message || t('模板应用失败'));
    }
  };

  const clearParamOverride = () => {
    handleInputChange('param_override', '');
  };

  const loadChannel = async () => {
    setLoading(true);
    let res = await API.get(`/api/channel/${channelId}`);
    if (res === undefined) {
      return;
    }
    const { success, message, data: rawData } = res.data;
    if (success) {
      const data = normalizeLoadedChannelData(rawData);
      const chInfo = data.channel_info || {};
      const isMulti = chInfo.is_multi_key === true;
      setIsMultiKeyChannel(isMulti);
      if (isMulti) {
        setBatch(true);
        setMultiToSingle(true);
        const modeVal = chInfo.multi_key_mode || 'random';
        setMultiKeyMode(modeVal);
        data.multi_key_mode = modeVal;
      } else {
        setBatch(false);
        setMultiToSingle(false);
      }
      const loadedStateBundle = buildLoadedChannelStateBundle({
        data,
        getChannelModels,
        deriveAdvancedSettingsOpen,
        parseIonetMetadata,
      });

      initialBaseUrlRef.current = loadedStateBundle.initialBaseUrl;
      setInputs(data);
      if (formApiRef.current) {
        formApiRef.current.setValues(data);
      }
      setAutoBan(loadedStateBundle.autoBan);
      setIsEnterpriseAccount(loadedStateBundle.isEnterpriseAccount);
      setBasicModels(loadedStateBundle.basicModels);
      setChannelSettings(loadedStateBundle.channelSettings);
      initialModelsRef.current = loadedStateBundle.initialModels;
      initialModelMappingRef.current = loadedStateBundle.initialModelMapping;
      initialStatusCodeMappingRef.current =
        loadedStateBundle.initialStatusCodeMapping;

      setIsIonetChannel(loadedStateBundle.managedByIonet);
      setIonetMetadata(loadedStateBundle.parsedIonet);

      if (loadedStateBundle.shouldOpenAdvanced) {
        setAdvancedSettingsOpen(true);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const fetchUpstreamModelList = async (name, options = {}) => {
    const silent = !!options.silent;
    // if (inputs['type'] !== 1) {
    //   showError(t('仅支持 OpenAI 接口格式'));
    //   return;
    // }
    setLoading(true);
    const models = [];
    let err = false;

    if (isEdit) {
      // 如果是编辑模式，使用已有的 channelId 获取模型列表
      const res = await API.get('/api/channel/fetch_models/' + channelId, {
        skipErrorHandler: true,
      });
      if (res && res.data && res.data.success) {
        models.push(...res.data.data);
      } else {
        err = true;
      }
    } else {
      // 如果是新建模式，通过后端代理获取模型列表
      if (!inputs?.['key']) {
        showError(t('请填写密钥'));
        err = true;
      } else {
        try {
          const res = await API.post(
            '/api/channel/fetch_models',
            {
              base_url: inputs['base_url'],
              type: inputs['type'],
              key: inputs['key'],
            },
            { skipErrorHandler: true },
          );

          if (res && res.data && res.data.success) {
            models.push(...res.data.data);
          } else {
            err = true;
          }
        } catch (error) {
          console.error('Error fetching models:', error);
          err = true;
        }
      }
    }

    if (!err) {
      const uniqueModels = normalizeFetchedModels(models);
      setFetchedModels(uniqueModels);
      if (!silent) {
        setModelModalVisible(true);
      }
      setLoading(false);
      return uniqueModels;
    } else {
      showError(t('获取模型列表失败'));
    }
    setLoading(false);
    return null;
  };

  const openModelMappingValueModal = async ({ pairKey, value }) => {
    const mappingKey = String(pairKey ?? '').trim();
    if (!mappingKey) return;

    if (!MODEL_FETCHABLE_CHANNEL_TYPES.has(inputs.type)) {
      return;
    }

    let modelsToUse = fetchedModels;
    if (!Array.isArray(modelsToUse) || modelsToUse.length === 0) {
      const fetched = await fetchUpstreamModelList('models', { silent: true });
      if (Array.isArray(fetched)) {
        modelsToUse = fetched;
      }
    }

    if (!Array.isArray(modelsToUse) || modelsToUse.length === 0) {
      showInfo(t('暂无模型'));
      return;
    }

    const modalState = prepareModelMappingModalState({
      pairKey: mappingKey,
      value,
      models: modelsToUse,
    });

    setModelMappingValueModalModels(modalState.models);
    setModelMappingValueKey(modalState.mappingKey);
    setModelMappingValueSelected(modalState.selected);
    setModelMappingValueModalVisible(true);
  };

  const fetchModels = async () => {
    try {
      let res = await API.get(`/api/channel/models`);
      const localModelOptions = buildModelOptions(res.data.data);
      setOriginModelOptions(localModelOptions);
      setFullModels(res.data.data.map((model) => model.id));
      setBasicModels(
        res.data.data
          .filter((model) => {
            return model.id.startsWith('gpt-') || model.id.startsWith('text-');
          })
          .map((model) => model.id),
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      if (res === undefined) {
        return;
      }
      setGroupOptions(buildGroupOptions(res.data.data));
    } catch (error) {
      showError(error.message);
    }
  };

  const fetchModelGroups = async () => {
    try {
      const res = await API.get('/api/prefill_group?type=model');
      if (res?.data?.success) {
        setModelGroups(res.data.data || []);
      }
    } catch (error) {
      // ignore
    }
  };

  // 查看渠道密钥（透明验证）
  const handleShow2FAModal = async () => {
    try {
      // 使用 withVerification 包装，会自动处理需要验证的情况
      const result = await withVerification(
        createApiCalls.viewChannelKey(channelId),
        {
          title: t('查看渠道密钥'),
          description: t('为了保护账户安全，请验证您的身份。'),
          preferredMethod: 'passkey', // 优先使用 Passkey
        },
      );

      // 如果直接返回了结果（已验证），显示密钥
      if (result && result.success && result.data?.key) {
        showSuccess(t('密钥获取成功'));
        setKeyDisplayState({
          showModal: true,
          keyData: result.data.key,
        });
      }
    } catch (error) {
      console.error('Failed to view channel key:', error);
      showError(error.message || t('获取密钥失败'));
    }
  };

  const handleCodexOAuthGenerated = (key) => {
    handleInputChange('key', key);
    formatJsonField('key');
  };

  const handleRefreshCodexCredential = async () => {
    if (!isEdit) return;

    setCodexCredentialRefreshing(true);
    try {
      const res = await API.post(
        `/api/channel/${channelId}/codex/refresh`,
        {},
        { skipErrorHandler: true },
      );
      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Failed to refresh credential');
      }
      showSuccess(t('凭证已刷新'));
    } catch (error) {
      showError(error.message || t('刷新失败'));
    } finally {
      setCodexCredentialRefreshing(false);
    }
  };

  useEffect(() => {
    if (inputs.type !== 45) {
      doubaoApiClickCountRef.current = 0;
      setDoubaoApiEditUnlocked(false);
    }
  }, [inputs.type]);

  useEffect(() => {
    const modelMap = new Map();

    originModelOptions.forEach((option) => {
      const v = (option.value || '').trim();
      if (!modelMap.has(v)) {
        modelMap.set(v, option);
      }
    });

    inputs.models.forEach((model) => {
      const v = (model || '').trim();
      if (!modelMap.has(v)) {
        modelMap.set(v, {
          key: v,
          label: v,
          value: v,
        });
      }
    });

    const categories = getModelCategories(t);
    const optionsWithIcon = Array.from(modelMap.values()).map((opt) => {
      const modelName = opt.value;
      let icon = null;
      for (const [key, category] of Object.entries(categories)) {
        if (key !== 'all' && category.filter({ model_name: modelName })) {
          icon = category.icon;
          break;
        }
      }
      return {
        ...opt,
        label: (
          <span className='flex items-center gap-1'>
            {icon}
            {modelName}
          </span>
        ),
      };
    });

    setModelOptions(optionsWithIcon);
  }, [originModelOptions, inputs.models, t]);

  useEffect(() => {
    fetchModels().then();
    fetchGroups().then();
    if (!isEdit) {
      initialBaseUrlRef.current = '';
      setInputs(originInputs);
      if (formApiRef.current) {
        formApiRef.current.setValues(originInputs);
      }
      let localModels = getChannelModels(inputs.type);
      setBasicModels(localModels);
      setInputs((inputs) => ({ ...inputs, models: localModels }));
    }
  }, [props.editingChannel.id]);

  useEffect(() => {
    if (formApiRef.current) {
      formApiRef.current.setValues(inputs);
    }
  }, [inputs]);

  useEffect(() => {
    setModelSearchValue('');
    if (props.visible) {
      if (isEdit) {
        loadChannel();
      } else {
        formApiRef.current?.setValues(getInitValues());
        try {
          navigator?.clipboard?.readText()?.then((text) => {
            const parsed = parseChannelConnectionString(text);
            if (parsed) {
              setClipboardConfig(parsed);
            }
          }).catch(() => {});
        } catch {}
      }
      fetchModelGroups();
      // 重置手动输入模式状态
      setUseManualInput(false);
      // 编辑模式下恢复用户偏好，创建模式一律折叠
      setAdvancedSettingsOpen(
        isEdit && localStorage.getItem(ADVANCED_SETTINGS_EXPANDED_KEY) === 'true'
      );
    } else {
      // 统一的模态框关闭重置逻辑
      resetModalState();
    }
  }, [props.visible, channelId]);

  useEffect(() => {
    if (!isEdit) {
      initialModelsRef.current = [];
      initialModelMappingRef.current = '';
      initialStatusCodeMappingRef.current = '';
    }
  }, [isEdit, props.visible]);

  useEffect(() => {
    return () => {
      if (statusCodeRiskConfirmResolverRef.current) {
        statusCodeRiskConfirmResolverRef.current(false);
        statusCodeRiskConfirmResolverRef.current = null;
      }
    };
  }, []);

  // 统一的模态框重置函数
  const resetModalState = () => {
    resolveStatusCodeRiskConfirm(false);
    formApiRef.current?.reset();
    // 重置渠道设置状态
    setChannelSettings({
      force_format: false,
      thinking_to_content: false,
      proxy: '',
      pass_through_body_enabled: false,
      system_prompt: '',
      system_prompt_override: false,
    });
    // 重置密钥模式状态
    setKeyMode('append');
    // 重置企业账户状态
    setIsEnterpriseAccount(false);
    // 重置豆包隐藏入口状态
    setDoubaoApiEditUnlocked(false);
    doubaoApiClickCountRef.current = 0;
    setModelSearchValue('');
    // 重置高级设置折叠状态
    setAdvancedSettingsOpen(false);
    // 清空表单中的key_mode字段
    if (formApiRef.current) {
      formApiRef.current.setValue('key_mode', undefined);
    }
    // 重置本地输入，避免下次打开残留上一次的 JSON 字段值
    setInputs(getInitValues());
    // 重置密钥显示状态
    resetKeyDisplayState();
    // 重置剪贴板检测状态
    setClipboardConfig(null);
  };

  const handleVertexUploadChange = ({ fileList }) => {
    vertexErroredNames.current.clear();
    (async () => {
      let validFiles = [];
      let keys = [];
      const errorNames = [];
      for (const item of fileList) {
        const fileObj = item.fileInstance;
        if (!fileObj) continue;
        try {
          const txt = await fileObj.text();
          keys.push(JSON.parse(txt));
          validFiles.push(item);
        } catch (err) {
          if (!vertexErroredNames.current.has(item.name)) {
            errorNames.push(item.name);
            vertexErroredNames.current.add(item.name);
          }
        }
      }

      // 非批量模式下只保留一个文件（最新选择的），避免重复叠加
      if (!batch && validFiles.length > 1) {
        validFiles = [validFiles[validFiles.length - 1]];
        keys = [keys[keys.length - 1]];
      }

      setVertexKeys(keys);
      setVertexFileList(validFiles);
      if (formApiRef.current) {
        formApiRef.current.setValue('vertex_files', validFiles);
      }
      setInputs((prev) => ({ ...prev, vertex_files: validFiles }));

      if (errorNames.length > 0) {
        showError(
          t('以下文件解析失败，已忽略：{{list}}', {
            list: errorNames.join(', '),
          }),
        );
      }
    })();
  };

  const confirmMissingModelMappings = (missingModels) =>
    new Promise((resolve) => {
      const modal = Modal.confirm({
        title: t('模型未加入列表，可能无法调用'),
        content: (
          <div className='text-sm leading-6'>
            <div>
              {t(
                '模型重定向里的下列模型尚未添加到“模型”列表，调用时会因为缺少可用模型而失败：',
              )}
            </div>
            <div className='font-mono text-xs break-all text-red-600 mt-1'>
              {missingModels.join(', ')}
            </div>
            <div className='mt-2'>
              {t(
                '你可以在“自定义模型名称”处手动添加它们，然后点击填入后再提交，或者直接使用下方操作自动处理。',
              )}
            </div>
          </div>
        ),
        centered: true,
        footer: (
          <Space align='center' className='w-full justify-end'>
            <Button
              type='tertiary'
              onClick={() => {
                modal.destroy();
                resolve('cancel');
              }}
            >
              {t('返回修改')}
            </Button>
            <Button
              type='primary'
              theme='light'
              onClick={() => {
                modal.destroy();
                resolve('submit');
              }}
            >
              {t('直接提交')}
            </Button>
            <Button
              type='primary'
              theme='solid'
              onClick={() => {
                modal.destroy();
                resolve('add');
              }}
            >
              {t('添加后提交')}
            </Button>
          </Space>
        ),
      });
    });

  const resolveStatusCodeRiskConfirm = (confirmed) => {
    setStatusCodeRiskConfirmVisible(false);
    setStatusCodeRiskDetailItems([]);
    if (statusCodeRiskConfirmResolverRef.current) {
      statusCodeRiskConfirmResolverRef.current(confirmed);
      statusCodeRiskConfirmResolverRef.current = null;
    }
  };

  const confirmStatusCodeRisk = (detailItems) =>
    new Promise((resolve) => {
      statusCodeRiskConfirmResolverRef.current = resolve;
      setStatusCodeRiskDetailItems(detailItems);
      setStatusCodeRiskConfirmVisible(true);
    });

  const hasModelConfigChanged = (normalizedModels, modelMappingStr) => {
    if (!isEdit) return true;
    const initialModels = initialModelsRef.current;
    if (normalizedModels.length !== initialModels.length) {
      return true;
    }
    for (let i = 0; i < normalizedModels.length; i++) {
      if (normalizedModels[i] !== initialModels[i]) {
        return true;
      }
    }
    const normalizedMapping = (modelMappingStr || '').trim();
    const initialMapping = (initialModelMappingRef.current || '').trim();
    return normalizedMapping !== initialMapping;
  };

  const submit = async () => {
    const formValues = formApiRef.current ? formApiRef.current.getValues() : {};
    let localInputs = { ...formValues };
    localInputs.param_override = inputs.param_override;
    const preparation = await prepareSubmitInputsBeforeValidation({
      localInputs,
      batch,
      isEdit,
      useManualInput,
      vertexKeys,
      vertexFileList,
      t,
      verifyJSON,
    });

    if (!preparation.ok) {
      switch (preparation.reason) {
        case 'codex_batch_not_supported':
          showInfo(t('Codex 渠道不支持批量创建'));
          return;
        case 'missing_key':
          showInfo(t('请输入密钥！'));
          return;
        case 'codex_invalid_json':
          showInfo(t('密钥必须是合法的 JSON 格式！'));
          return;
        case 'codex_not_object':
          showInfo(t('密钥必须是 JSON 对象'));
          return;
        case 'codex_missing_access_token':
          showInfo(t('密钥 JSON 必须包含 access_token'));
          return;
        case 'codex_missing_account_id':
          showInfo(t('密钥 JSON 必须包含 account_id'));
          return;
        case 'vertex_invalid_manual_json':
          showError(t('密钥格式无效，请输入有效的 JSON 格式密钥'));
          return;
        case 'vertex_file_parse_failed':
          showError(
            t('解析密钥文件失败: {{msg}}', {
              msg: preparation.errorMessage,
            }),
          );
          return;
        case 'missing_vertex_file':
          showInfo(t('请上传密钥文件！'));
          return;
        default:
          return;
      }
    }

    localInputs = preparation.localInputs;

    if (!isEdit && (!localInputs.name || !localInputs.key)) {
      showInfo(t('请填写渠道名称和渠道密钥！'));
      return;
    }
    if (!Array.isArray(localInputs.models) || localInputs.models.length === 0) {
      showInfo(t('请至少选择一个模型！'));
      return;
    }
    if (
      localInputs.type === 45 &&
      (!localInputs.base_url || localInputs.base_url.trim() === '')
    ) {
      showInfo(t('请输入API地址！'));
      return;
    }
    let parsedModelMapping = null;
    try {
      parsedModelMapping = parseModelMappingOrThrow(
        localInputs.model_mapping,
        verifyJSON,
      );
    } catch (error) {
      if (error.message === 'invalid_model_mapping') {
        showInfo(t('模型映射必须是合法的 JSON 格式！'));
        return;
      }
    }

    localInputs = normalizeSubmitInputs({ localInputs });
    const normalizedModels = localInputs.models;
    localInputs.models = normalizedModels;

    const interactionState = buildSubmitInteractionState({
      parsedModelMapping,
      normalizedModels,
      modelMappingStr: localInputs.model_mapping,
      hasModelConfigChanged,
      collectInvalidStatusCodeEntries,
      collectNewDisallowedStatusCodeRedirects,
      initialStatusCodeMapping: initialStatusCodeMappingRef.current,
      statusCodeMapping: localInputs.status_code_mapping,
    });

    if (parsedModelMapping) {
      const { missingModels, shouldPromptMissing } = interactionState;
      if (shouldPromptMissing) {
        const confirmAction = await confirmMissingModelMappings(missingModels);
        if (confirmAction === 'cancel') {
          return;
        }
        if (confirmAction === 'add') {
          const updatedModels = Array.from(
            new Set([...normalizedModels, ...missingModels]),
          );
          localInputs.models = updatedModels;
          handleInputChange('models', updatedModels);
        }
      }
    }

    const { invalidStatusCodeEntries, riskyStatusCodeRedirects } =
      interactionState;
    if (invalidStatusCodeEntries.length > 0) {
      showError(
        `${t('状态码复写包含无效的状态码')}: ${invalidStatusCodeEntries.join(', ')}`,
      );
      return;
    }

    if (riskyStatusCodeRedirects.length > 0) {
      const confirmed = await confirmStatusCodeRisk(riskyStatusCodeRedirects);
      if (!confirmed) {
        return;
      }
    }

    const payload = buildSubmitPayload({
      localInputs,
      batch,
      multiToSingle,
      multiKeyMode,
      isEdit,
      isMultiKeyChannel,
      keyMode,
      channelId,
    });

    let res;
    if (isEdit) {
      res = await API.put(`/api/channel/`, payload);
    } else {
      res = await API.post(`/api/channel/`, payload);
    }
    const { success, message } = res.data;
    if (success) {
      if (isEdit) {
        showSuccess(t('渠道更新成功！'));
      } else {
        showSuccess(t('渠道创建成功！'));
        setInputs(originInputs);
      }
      props.refresh();
      props.handleClose();
    } else {
      showError(message);
    }
  };

  // 密钥去重函数
  const deduplicateKeys = () => {
    const currentKey = formApiRef.current?.getValue('key') || inputs.key || '';

    if (!currentKey.trim()) {
      showInfo(t('请先输入密钥'));
      return;
    }

    const { beforeCount, afterCount, text: deduplicatedKeyText } =
      buildDeduplicatedKeysResult(currentKey);

    // 更新表单和状态
    if (formApiRef.current) {
      formApiRef.current.setValue('key', deduplicatedKeyText);
    }
    handleInputChange('key', deduplicatedKeyText);

    // 显示去重结果
    const message = t(
      '去重完成：去重前 {{before}} 个密钥，去重后 {{after}} 个密钥',
      {
        before: beforeCount,
        after: afterCount,
      },
    );

    if (beforeCount === afterCount) {
      showInfo(t('未发现重复密钥'));
    } else {
      showSuccess(message);
    }
  };

  const addCustomModels = () => {
    if (customModel.trim() === '') return;

    const { models: localModels, modelOptions: localModelOptions, addedModels } =
      buildCustomModelMergeResult({
        customModel,
        currentModels: inputs.models,
        currentModelOptions: modelOptions,
      });

    setModelOptions(localModelOptions);
    setCustomModel('');
    handleInputChange('models', localModels);

    if (addedModels.length > 0) {
      showSuccess(
        t('已新增 {{count}} 个模型：{{list}}', {
          count: addedModels.length,
          list: addedModels.join(', '),
        }),
      );
    } else {
      showInfo(t('未发现新增模型'));
    }
  };

  const batchAllowed = (!isEdit || isMultiKeyChannel) && inputs.type !== 57;
  const batchExtra = batchAllowed ? (
    <Space>
      {!isEdit && (
        <Checkbox
          disabled={isEdit}
          checked={batch}
          onChange={(e) => {
            const checked = e.target.checked;

            if (!checked && vertexFileList.length > 1) {
              Modal.confirm({
                title: t('切换为单密钥模式'),
                content: t(
                  '将仅保留第一个密钥文件，其余文件将被移除，是否继续？',
                ),
                onOk: () => {
                  const firstFile = vertexFileList[0];
                  const firstKey = vertexKeys[0] ? [vertexKeys[0]] : [];

                  setVertexFileList([firstFile]);
                  setVertexKeys(firstKey);

                  formApiRef.current?.setValue('vertex_files', [firstFile]);
                  setInputs((prev) => ({ ...prev, vertex_files: [firstFile] }));

                  setBatch(false);
                  setMultiToSingle(false);
                  setMultiKeyMode('random');
                },
                onCancel: () => {
                  setBatch(true);
                },
                centered: true,
              });
              return;
            }

            setBatch(checked);
            if (!checked) {
              setMultiToSingle(false);
              setMultiKeyMode('random');
            } else {
              // 批量模式下禁用手动输入，并清空手动输入的内容
              setUseManualInput(false);
              if (inputs.type === 41) {
                // 清空手动输入的密钥内容
                if (formApiRef.current) {
                  formApiRef.current.setValue('key', '');
                }
                handleInputChange('key', '');
              }
            }
          }}
        >
          {t('批量创建')}
        </Checkbox>
      )}
      {batch && (
        <>
          <Checkbox
            disabled={isEdit}
            checked={multiToSingle}
            onChange={() => {
              setMultiToSingle((prev) => {
                const nextValue = !prev;
                setInputs((prevInputs) => {
                  const newInputs = { ...prevInputs };
                  if (nextValue) {
                    newInputs.multi_key_mode = multiKeyMode;
                  } else {
                    delete newInputs.multi_key_mode;
                  }
                  return newInputs;
                });
                return nextValue;
              });
            }}
          >
            {t('密钥聚合模式')}
          </Checkbox>

          {inputs.type !== 41 && (
            <Button
              size='small'
              type='tertiary'
              theme='outline'
              onClick={deduplicateKeys}
              style={{ textDecoration: 'underline' }}
            >
              {t('密钥去重')}
            </Button>
          )}
        </>
      )}
    </Space>
  ) : null;

  const channelOptionList = useMemo(
    () =>
      CHANNEL_OPTIONS.map((opt) => ({
        ...opt,
        // 保持 label 为纯文本以支持搜索
        label: opt.label,
      })),
    [],
  );

  const renderChannelOption = (renderProps) => {
    const {
      disabled,
      selected,
      label,
      value,
      focused,
      className,
      style,
      onMouseEnter,
      onClick,
      ...rest
    } = renderProps;

    const searchWords = channelSearchValue ? [channelSearchValue] : [];

    // 构建样式类名
    const optionClassName = [
      'flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg mx-2 my-1',
      focused && 'bg-blue-50 shadow-sm',
      selected &&
        'bg-blue-100 text-blue-700 shadow-lg ring-2 ring-blue-200 ring-opacity-50',
      disabled && 'opacity-50 cursor-not-allowed',
      !disabled && 'hover:bg-gray-50 hover:shadow-md cursor-pointer',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        style={style}
        className={optionClassName}
        onClick={() => !disabled && onClick()}
        onMouseEnter={(e) => onMouseEnter()}
      >
        <div className='flex items-center gap-3 w-full'>
          <div className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
            {getChannelIcon(value)}
          </div>
          <div className='flex-1 min-w-0'>
            <Highlight
              sourceString={label}
              searchWords={searchWords}
              className='text-sm font-medium truncate'
            />
          </div>
          {selected && (
            <div className='flex-shrink-0 text-blue-600'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='currentColor'
              >
                <path d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z' />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <SideSheet
        placement={isEdit ? 'right' : 'left'}
        title={
          <div className='flex items-center justify-between w-full'>
            <Space>
              <Tag color='blue' shape='circle'>
                {isEdit ? t('编辑') : t('新建')}
              </Tag>
              <Title heading={4} className='m-0'>
                {isEdit ? t('更新渠道信息') : t('创建新的渠道')}
              </Title>
            </Space>
            {!isEdit && (
              <Button
                size='small'
                type='tertiary'
                className='ec-dbcd0a3c01b55203 shrink-0'
                icon={<IconBolt />}
                onClick={pasteFromClipboard}
              >
                {t('从剪贴板粘贴配置')}
              </Button>
            )}
          </div>
        }
        bodyStyle={{ padding: '0' }}
        visible={props.visible}
        width={isMobile ? '100%' : 600}
        footer={
          <div className='flex justify-end items-center gap-2'>
            <Button
              theme='solid'
              onClick={() => formApiRef.current?.submitForm()}
              icon={<IconSave />}
            >
              {t('提交')}
            </Button>
            <Button
              theme='light'
              type='primary'
              onClick={handleCancel}
              icon={<IconClose />}
            >
              {t('取消')}
            </Button>
          </div>
        }
        closeIcon={null}
        onCancel={() => handleCancel()}
      >
        <Form
          key={isEdit ? 'edit' : 'new'}
          initValues={originInputs}
          getFormApi={(api) => (formApiRef.current = api)}
          onSubmit={submit}
        >
          {() => {
            const advancedSettingsContent = (
              <div className='space-y-4'>
                <EditChannelModalAdvancedSection
                  MODEL_FETCHABLE_CHANNEL_TYPES={MODEL_FETCHABLE_CHANNEL_TYPES}
                  STATUS_CODE_MAPPING_EXAMPLE={STATUS_CODE_MAPPING_EXAMPLE}
                  channelId={isEdit ? channelId : 'new'}
                  copyParamOverrideJson={copyParamOverrideJson}
                  clearParamOverride={clearParamOverride}
                  formatJsonField={formatJsonField}
                  formatUnixTime={formatUnixTime}
                  formApi={formApiRef.current}
                  handleChannelOtherSettingsChange={
                    handleChannelOtherSettingsChange
                  }
                  handleInputChange={handleInputChange}
                  inputs={inputs}
                  openModelMappingValueModal={openModelMappingValueModal}
                  paramOverrideMeta={paramOverrideMeta}
                  t={t}
                  applyParamOverrideTemplate={applyParamOverrideTemplate}
                  setParamOverrideEditorVisible={setParamOverrideEditorVisible}
                  upstreamDetectedModels={upstreamDetectedModels}
                  upstreamDetectedModelsOmittedCount={
                    upstreamDetectedModelsOmittedCount
                  }
                  upstreamDetectedModelsPreview={upstreamDetectedModelsPreview}
                />
                <EditChannelModalBehaviorSection
                  inputs={inputs}
                  t={t}
                  handleInputChange={handleInputChange}
                  handleChannelOtherSettingsChange={
                    handleChannelOtherSettingsChange
                  }
                />

                <EditChannelModalExtraSettingsSection
                  inputs={inputs}
                  t={t}
                  handleChannelSettingsChange={handleChannelSettingsChange}
                  handleChannelOtherSettingsChange={
                    handleChannelOtherSettingsChange
                  }
                />
              </div>
            );

            return (
            <>
            <Spin spinning={loading}>
              <div className='p-2 space-y-3' ref={formContainerRef}>
                {!isEdit && clipboardConfig && (
                  <Banner
                    type='info'
                    className='ec-dbcd0a3c01b55203'
                    description={
                      <div className='flex items-center justify-between gap-2'>
                        <span>{t('检测到剪贴板中的连接信息')}</span>
                        <div className='flex gap-1'>
                          <Button
                            size='small'
                            theme='solid'
                            type='primary'
                            onClick={() => applyClipboardConfig(clipboardConfig)}
                          >
                            {t('自动填入')}
                          </Button>
                          <Button
                            size='small'
                            type='tertiary'
                            onClick={() => setClipboardConfig(null)}
                          >
                            {t('忽略')}
                          </Button>
                        </div>
                      </div>
                    }
                  />
                )}
                <EditChannelModalCoreSection
                  t={t}
                  inputs={inputs}
                  channelOptionList={channelOptionList}
                  channelSearchValue={channelSearchValue}
                  renderChannelOption={renderChannelOption}
                  isIonetChannel={isIonetChannel}
                  ionetMetadata={ionetMetadata}
                  isIonetLocked={isIonetLocked}
                  handleOpenIonetDeployment={handleOpenIonetDeployment}
                  handleInputChange={handleInputChange}
                  handleEnterpriseAccountChange={(value) => {
                    setIsEnterpriseAccount(value);
                    handleInputChange('is_enterprise_account', value);
                  }}
                  setChannelSearchValue={setChannelSearchValue}
                />

                    <EditChannelModalPrimaryKeyInputSection
                      batch={batch}
                      batchExtra={batchExtra}
                      codexCredentialRefreshing={codexCredentialRefreshing}
                      codexOAuthModalVisible={codexOAuthModalVisible}
                      formApi={formApiRef.current}
                      handleChannelOtherSettingsChange={
                        handleChannelOtherSettingsChange
                      }
                      handleCodexOAuthGenerated={handleCodexOAuthGenerated}
                      handleInputChange={handleInputChange}
                      handleRefreshCodexCredential={
                        handleRefreshCodexCredential
                      }
                      handleShow2FAModal={handleShow2FAModal}
                      handleVertexUploadChange={handleVertexUploadChange}
                      inputs={inputs}
                      isEdit={isEdit}
                      isIonetLocked={isIonetLocked}
                      isMultiKeyChannel={isMultiKeyChannel}
                      keyMode={keyMode}
                      setBatch={setBatch}
                      setCodexOAuthModalVisible={setCodexOAuthModalVisible}
                      setInputs={setInputs}
                      setUseManualInput={setUseManualInput}
                      setVertexFileList={setVertexFileList}
                      setVertexKeys={setVertexKeys}
                      t={t}
                      type2secretPrompt={type2secretPrompt}
                      useManualInput={useManualInput}
                      vertexFileList={vertexFileList}
                    />

                    <EditChannelModalKeySection
                      REGION_EXAMPLE={REGION_EXAMPLE}
                      canKeepDeprecatedDoubaoCodingPlan={
                        canKeepDeprecatedDoubaoCodingPlan
                      }
                      channelId={channelId}
                      doubaoApiClickCountRef={doubaoApiClickCountRef}
                      doubaoApiEditUnlocked={doubaoApiEditUnlocked}
                      doubaoCodingPlanOptionLabel={doubaoCodingPlanOptionLabel}
                      formApi={formApiRef.current}
                      handleApiConfigSecretClick={handleApiConfigSecretClick}
                      handleChannelOtherSettingsChange={
                        handleChannelOtherSettingsChange
                      }
                      handleInputChange={handleInputChange}
                      inputs={inputs}
                      isEdit={isEdit}
                      isIonetLocked={isIonetLocked}
                      keyMode={keyMode}
                      multiToSingle={batch && multiToSingle}
                      setAutoBan={setAutoBan}
                      setKeyMode={setKeyMode}
                      setMultiKeyMode={setMultiKeyMode}
                      showApiConfigCard={showApiConfigCard}
                      t={t}
                    />

                   <EditChannelModalModelSection
                     MODEL_FETCHABLE_CHANNEL_TYPES={
                       MODEL_FETCHABLE_CHANNEL_TYPES
                     }
                     MODEL_MAPPING_EXAMPLE={MODEL_MAPPING_EXAMPLE}
                     addCustomModels={addCustomModels}
                     autoBan={autoBan}
                     basicModels={basicModels}
                     copy={copy}
                     customModel={customModel}
                     fetchUpstreamModelList={fetchUpstreamModelList}
                     formApi={formApiRef.current}
                     fullModels={fullModels}
                     groupOptions={groupOptions}
                     handleInputChange={handleInputChange}
                     inputs={inputs}
                     isEdit={isEdit}
                     modelGroups={modelGroups}
                     modelOptions={modelOptions}
                     modelSearchHintText={modelSearchHintText}
                     openModelMappingValueModal={openModelMappingValueModal}
                     setAutoBan={setAutoBan}
                     setCustomModel={setCustomModel}
                     setModelSearchValue={setModelSearchValue}
                     setOllamaModalVisible={setOllamaModalVisible}
                     showError={showError}
                     showInfo={showInfo}
                     showSuccess={showSuccess}
                     t={t}
                     channelId={channelId}
                   />
                   {/* Advanced Settings Toggle / Collapse */}
                 {isMobile ? (
                <Collapse
                  activeKey={advancedSettingsOpen ? ['advanced'] : []}
                  onChange={(keys) => toggleAdvancedSettings(keys.includes('advanced'))}
                >
                  <Collapse.Panel
                    header={
                      <div className='flex items-center gap-2'>
                        <IconSetting size={16} />
                        <Text className='font-medium'>{t('高级设置')}</Text>
                      </div>
                    }
                    itemKey='advanced'
                  >
                    {advancedSettingsContent}
                  </Collapse.Panel>
                </Collapse>
                ) : (
                  /* Desktop: toggle button to open side panel */
                  <div
                    className='flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-50'
                    style={{
                      backgroundColor: advancedSettingsOpen ? 'var(--semi-color-primary-light-default)' : 'var(--semi-color-fill-0)',
                      border: '1px solid var(--semi-color-fill-2)',
                    }}
                    onClick={() => toggleAdvancedSettings(!advancedSettingsOpen)}
                  >
                    <div className='flex items-center gap-2'>
                      <IconSetting size={16} />
                      <Text className='font-medium'>{t('高级设置')}</Text>
                    </div>
                    <div className='flex items-center gap-1 text-sm' style={{ color: 'var(--semi-color-primary)' }}>
                      <Text size='small' style={{ color: 'var(--semi-color-primary)' }}>
                        {advancedSettingsOpen ? t('收起') : isEdit ? t('向左展开') : t('向右展开')}
                      </Text>
                      <IconChevronDown
                        size={14}
                        style={{
                          transform: advancedSettingsOpen
                            ? 'rotate(180deg)'
                            : isEdit ? 'rotate(90deg)' : 'rotate(-90deg)',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Spin>

            {/* Desktop: Advanced Settings Side Panel - rendered inside Form tree */}
            {!isMobile && advancedSettingsOpen && (
              <div
                className='fixed top-0 h-full overflow-y-auto z-[999] semi-sidesheet-inner'
                style={{
                  width: 600,
                  [isEdit ? 'right' : 'left']: 600,
                  backgroundColor: 'var(--semi-color-bg-0)',
                  borderLeft: isEdit ? 'none' : '1px solid var(--semi-color-border)',
                  borderRight: isEdit ? '1px solid var(--semi-color-border)' : 'none',
                  animation: `slideIn${isEdit ? 'Left' : 'Right'} 0.3s ease-out`,
                }}
              >
                <div className='semi-sidesheet-header'>
                  <div className='semi-sidesheet-title'>
                    <Space>
                      <Tag color='cyan' shape='circle'>
                        {t('高级')}
                      </Tag>
                      <Title heading={4} className='m-0'>
                        {t('高级设置')}
                      </Title>
                    </Space>
                  </div>
                  <Button
                    className='semi-sidesheet-close'
                    type='tertiary'
                    theme='borderless'
                    icon={<IconClose />}
                    size='small'
                    onClick={() => setAdvancedSettingsOpen(false)}
                  />
                </div>
                <div className='semi-sidesheet-body' style={{ padding: 0 }}>
                  <div className='p-2 space-y-3'>
                    <Card className='!rounded-2xl shadow-sm border-0'>
                      <div className='flex items-center mb-4'>
                        <Avatar
                          size='small'
                          color='orange'
                          className='mr-2 shadow-md'
                        >
                          <IconSetting size={16} />
                        </Avatar>
                        <div>
                          <Text className='text-lg font-medium'>
                            {t('高级设置')}
                          </Text>
                          <div className='text-xs text-gray-600'>
                            {t('渠道的高级配置选项')}
                          </div>
                        </div>
                      </div>
                      {advancedSettingsContent}
                    </Card>
                  </div>
                </div>
              </div>
            )}
            </>
          );
          }}
        </Form>

        <ImagePreview
          src={modalImageUrl}
          visible={isModalOpenurl}
          onVisibleChange={(visible) => setIsModalOpenurl(visible)}
        />
      </SideSheet>
      <StatusCodeRiskGuardModal
        visible={statusCodeRiskConfirmVisible}
        detailItems={statusCodeRiskDetailItems}
        onCancel={() => resolveStatusCodeRiskConfirm(false)}
        onConfirm={() => resolveStatusCodeRiskConfirm(true)}
      />
      {/* 使用通用安全验证模态框 */}
      <SecureVerificationModal
        visible={isModalVisible}
        verificationMethods={verificationMethods}
        verificationState={verificationState}
        onVerify={executeVerification}
        onCancel={cancelVerification}
        onCodeChange={setVerificationCode}
        onMethodSwitch={switchVerificationMethod}
        title={verificationState.title}
        description={verificationState.description}
      />

      {/* 使用ChannelKeyDisplay组件显示密钥 */}
      <Modal
        title={
          <div className='flex items-center'>
            <div className='w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3'>
              <svg
                className='w-4 h-4 text-green-600 dark:text-green-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            {t('渠道密钥信息')}
          </div>
        }
        visible={keyDisplayState.showModal}
        onCancel={resetKeyDisplayState}
        footer={
          <Button type='primary' onClick={resetKeyDisplayState}>
            {t('完成')}
          </Button>
        }
        width={700}
        style={{ maxWidth: '90vw' }}
      >
        <ChannelKeyDisplay
          keyData={keyDisplayState.keyData}
          showSuccessIcon={true}
          successText={t('密钥获取成功')}
          showWarning={true}
          warningText={t(
            '请妥善保管密钥信息，不要泄露给他人。如有安全疑虑，请及时更换密钥。',
          )}
        />
      </Modal>

      <ParamOverrideEditorModal
        visible={paramOverrideEditorVisible}
        value={inputs.param_override || ''}
        onCancel={() => setParamOverrideEditorVisible(false)}
        onSave={(nextValue) => {
          handleInputChange('param_override', nextValue);
          setParamOverrideEditorVisible(false);
        }}
      />

      <ModelSelectModal
        visible={modelModalVisible}
        models={fetchedModels}
        selected={inputs.models}
        redirectModels={redirectModelList}
        onConfirm={(selectedModels) => {
          handleInputChange('models', selectedModels);
          showSuccess(t('模型列表已更新'));
          setModelModalVisible(false);
        }}
        onCancel={() => setModelModalVisible(false)}
      />

      <SingleModelSelectModal
        visible={modelMappingValueModalVisible}
        models={modelMappingValueModalModels}
        selected={modelMappingValueSelected}
        onConfirm={(selectedModel) => {
          const modelName = String(selectedModel ?? '').trim();
          if (!modelName) {
            showError(t('请先选择模型！'));
            return;
          }

          const mappingKey = String(modelMappingValueKey ?? '').trim();
          if (!mappingKey) {
            setModelMappingValueModalVisible(false);
            return;
          }

          let parsed = {};
          const currentMapping = inputs.model_mapping;
          if (typeof currentMapping === 'string' && currentMapping.trim()) {
            try {
              parsed = JSON.parse(currentMapping);
            } catch (error) {
              parsed = {};
            }
          } else if (
            currentMapping &&
            typeof currentMapping === 'object' &&
            !Array.isArray(currentMapping)
          ) {
            parsed = currentMapping;
          }
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            parsed = {};
          }

          parsed[mappingKey] = modelName;
          const nextMapping = JSON.stringify(parsed, null, 2);
          handleInputChange('model_mapping', nextMapping);
          if (formApiRef.current) {
            formApiRef.current.setValue('model_mapping', nextMapping);
          }
          setModelMappingValueModalVisible(false);
        }}
        onCancel={() => setModelMappingValueModalVisible(false)}
      />

      <OllamaModelModal
        visible={ollamaModalVisible}
        onCancel={() => setOllamaModalVisible(false)}
        channelId={channelId}
        channelInfo={inputs}
        onModelsUpdate={(options = {}) => {
          // 当模型更新后，重新获取模型列表以更新表单
          fetchUpstreamModelList('models', { silent: !!options.silent });
        }}
        onApplyModels={({ mode, modelIds } = {}) => {
          if (!Array.isArray(modelIds) || modelIds.length === 0) {
            return;
          }
          const existingModels = Array.isArray(inputs.models)
            ? inputs.models.map(String)
            : [];
          const incoming = modelIds.map(String);
          const nextModels = Array.from(
            new Set([...existingModels, ...incoming]),
          );

          handleInputChange('models', nextModels);
          if (formApiRef.current) {
            formApiRef.current.setValue('models', nextModels);
          }
          showSuccess(t('模型列表已追加更新'));
        }}
      />
    </>
  );
};

export default EditChannelModal;
