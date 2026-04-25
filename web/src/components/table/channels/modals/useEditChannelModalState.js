import { useMemo, useState } from 'react';
import { selectFilter } from '../../../../helpers';
import {
  buildParamOverrideMeta,
  buildRedirectModelList,
  buildUpstreamDetectedModels,
} from './editChannelModalDerived';
import { UPSTREAM_DETECTED_MODEL_PREVIEW_LIMIT } from './editChannelModalConstants';

export function useEditChannelModalState({
  isEdit,
  originInputs,
  t,
  verifyJSON,
}) {
  const [loading, setLoading] = useState(isEdit);
  const [batch, setBatch] = useState(false);
  const [multiToSingle, setMultiToSingle] = useState(false);
  const [multiKeyMode, setMultiKeyMode] = useState('random');
  const [autoBan, setAutoBan] = useState(true);
  const [inputs, setInputs] = useState(originInputs);
  const [originModelOptions, setOriginModelOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [basicModels, setBasicModels] = useState([]);
  const [fullModels, setFullModels] = useState([]);
  const [modelGroups, setModelGroups] = useState([]);
  const [customModel, setCustomModel] = useState('');
  const [modelSearchValue, setModelSearchValue] = useState('');
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [isModalOpenurl, setIsModalOpenurl] = useState(false);
  const [modelModalVisible, setModelModalVisible] = useState(false);
  const [fetchedModels, setFetchedModels] = useState([]);
  const [modelMappingValueModalVisible, setModelMappingValueModalVisible] =
    useState(false);
  const [modelMappingValueModalModels, setModelMappingValueModalModels] =
    useState([]);
  const [modelMappingValueKey, setModelMappingValueKey] = useState('');
  const [modelMappingValueSelected, setModelMappingValueSelected] =
    useState('');
  const [ollamaModalVisible, setOllamaModalVisible] = useState(false);
  const [vertexKeys, setVertexKeys] = useState([]);
  const [vertexFileList, setVertexFileList] = useState([]);
  const [isMultiKeyChannel, setIsMultiKeyChannel] = useState(false);
  const [channelSearchValue, setChannelSearchValue] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);
  const [keyMode, setKeyMode] = useState('append');
  const [isEnterpriseAccount, setIsEnterpriseAccount] = useState(false);
  const [doubaoApiEditUnlocked, setDoubaoApiEditUnlocked] = useState(false);
  const [isIonetChannel, setIsIonetChannel] = useState(false);
  const [ionetMetadata, setIonetMetadata] = useState(null);
  const [codexOAuthModalVisible, setCodexOAuthModalVisible] = useState(false);
  const [codexCredentialRefreshing, setCodexCredentialRefreshing] =
    useState(false);
  const [paramOverrideEditorVisible, setParamOverrideEditorVisible] =
    useState(false);
  const [keyDisplayState, setKeyDisplayState] = useState({
    showModal: false,
    keyData: '',
  });
  const [show2FAVerifyModal, setShow2FAVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [statusCodeRiskConfirmVisible, setStatusCodeRiskConfirmVisible] =
    useState(false);
  const [statusCodeRiskDetailItems, setStatusCodeRiskDetailItems] = useState(
    [],
  );
  const [clipboardConfig, setClipboardConfig] = useState(null);
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);
  const [channelSettings, setChannelSettings] = useState({
    force_format: false,
    thinking_to_content: false,
    proxy: '',
    pass_through_body_enabled: false,
    system_prompt: '',
  });

  const redirectModelList = useMemo(
    () => buildRedirectModelList(inputs.model_mapping),
    [inputs.model_mapping],
  );
  const upstreamDetectedModels = useMemo(
    () =>
      buildUpstreamDetectedModels(
        inputs.upstream_model_update_last_detected_models,
      ),
    [inputs.upstream_model_update_last_detected_models],
  );
  const upstreamDetectedModelsPreview = useMemo(
    () =>
      upstreamDetectedModels.slice(0, UPSTREAM_DETECTED_MODEL_PREVIEW_LIMIT),
    [upstreamDetectedModels],
  );
  const upstreamDetectedModelsOmittedCount =
    upstreamDetectedModels.length - upstreamDetectedModelsPreview.length;
  const modelSearchMatchedCount = useMemo(() => {
    const keyword = modelSearchValue.trim();
    if (!keyword) {
      return modelOptions.length;
    }
    return modelOptions.reduce(
      (count, option) => count + (selectFilter(keyword, option) ? 1 : 0),
      0,
    );
  }, [modelOptions, modelSearchValue]);
  const modelSearchHintText = useMemo(() => {
    const keyword = modelSearchValue.trim();
    if (!keyword || modelSearchMatchedCount !== 0) {
      return '';
    }
    return t('未匹配到模型，按回车键可将「{{name}}」作为自定义模型名添加', {
      name: keyword,
    });
  }, [modelSearchMatchedCount, modelSearchValue, t]);
  const paramOverrideMeta = useMemo(
    () => buildParamOverrideMeta(inputs.param_override, t, verifyJSON),
    [inputs.param_override, t, verifyJSON],
  );

  return {
    loading,
    setLoading,
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
    modelSearchMatchedCount,
    modelSearchHintText,
    paramOverrideMeta,
  };
}
