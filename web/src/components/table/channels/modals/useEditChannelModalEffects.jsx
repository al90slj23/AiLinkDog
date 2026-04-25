import { useEffect } from 'react';
import { getChannelModels, getModelCategories } from '../../../../helpers';
import { parseChannelConnectionString } from '../../../../helpers/token';
import { ADVANCED_SETTINGS_EXPANDED_KEY } from './editChannelModalConstants';

export function useEditChannelModalEffects(args) {
  const {
    isEdit,
    setIsIonetChannel,
    setIonetMetadata,
    inputs,
    doubaoApiClickCountRef,
    setDoubaoApiEditUnlocked,
    originModelOptions,
    setModelOptions,
    t,
    fetchModels,
    fetchGroups,
    props,
    initialBaseUrlRef,
    setInputs,
    formApiRef,
    originInputs,
    setBasicModels,
    loadChannel,
    setModelSearchValue,
    setClipboardConfig,
    fetchModelGroups,
    setUseManualInput,
    setAdvancedSettingsOpen,
    channelId,
    resetModalState,
    initialModelsRef,
    initialModelMappingRef,
    initialStatusCodeMappingRef,
    statusCodeRiskConfirmResolverRef,
  } = args;

  useEffect(() => {
    if (!isEdit) {
      setIsIonetChannel(false);
      setIonetMetadata(null);
    }
  }, [isEdit, setIsIonetChannel, setIonetMetadata]);

  useEffect(() => {
    if (inputs.type !== 45) {
      doubaoApiClickCountRef.current = 0;
      setDoubaoApiEditUnlocked(false);
    }
  }, [inputs.type, doubaoApiClickCountRef, setDoubaoApiEditUnlocked]);

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
  }, [originModelOptions, inputs.models, setModelOptions, t]);

  useEffect(() => {
    fetchModels().then();
    fetchGroups().then();
    if (!isEdit) {
      initialBaseUrlRef.current = '';
      setInputs(originInputs);
      if (formApiRef.current) {
        formApiRef.current.setValues(originInputs);
      }
      const localModels = getChannelModels(inputs.type);
      setBasicModels(localModels);
      setInputs((inputs) => ({ ...inputs, models: localModels }));
    }
  }, [
    fetchGroups,
    fetchModels,
    formApiRef,
    initialBaseUrlRef,
    inputs.type,
    isEdit,
    originInputs,
    props.editingChannel.id,
    setBasicModels,
    setInputs,
  ]);

  useEffect(() => {
    if (formApiRef.current) {
      formApiRef.current.setValues(inputs);
    }
  }, [formApiRef, inputs]);

  useEffect(() => {
    setModelSearchValue('');
    if (props.visible) {
      if (isEdit) {
        loadChannel();
      } else {
        formApiRef.current?.setValues(originInputs);
        try {
          navigator?.clipboard
            ?.readText()
            ?.then((text) => {
              const parsed = parseChannelConnectionString(text);
              if (parsed) {
                setClipboardConfig(parsed);
              }
            })
            .catch(() => {});
        } catch {}
      }
      fetchModelGroups();
      setUseManualInput(false);
      setAdvancedSettingsOpen(
        isEdit &&
          localStorage.getItem(ADVANCED_SETTINGS_EXPANDED_KEY) === 'true',
      );
    } else {
      resetModalState();
    }
  }, [
    channelId,
    fetchModelGroups,
    formApiRef,
    isEdit,
    loadChannel,
    originInputs,
    props.visible,
    resetModalState,
    setAdvancedSettingsOpen,
    setClipboardConfig,
    setModelSearchValue,
    setUseManualInput,
  ]);

  useEffect(() => {
    if (!isEdit) {
      initialModelsRef.current = [];
      initialModelMappingRef.current = '';
      initialStatusCodeMappingRef.current = '';
    }
  }, [
    initialModelMappingRef,
    initialModelsRef,
    initialStatusCodeMappingRef,
    isEdit,
    props.visible,
  ]);

  useEffect(() => {
    return () => {
      if (statusCodeRiskConfirmResolverRef.current) {
        statusCodeRiskConfirmResolverRef.current(false);
        statusCodeRiskConfirmResolverRef.current = null;
      }
    };
  }, [statusCodeRiskConfirmResolverRef]);
}
