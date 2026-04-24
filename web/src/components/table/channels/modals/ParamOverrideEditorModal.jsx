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

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { copy, showError, showSuccess, verifyJSON } from '../../../../helpers';
import ParamOverrideEditorModalFieldGuideModal from './ParamOverrideEditorModalFieldGuideModal';
import ParamOverrideEditorModalHeaderValueExampleModal from './ParamOverrideEditorModalHeaderValueExampleModal';
import ParamOverrideEditorModalJsonSection from './ParamOverrideEditorModalJsonSection';
import ParamOverrideEditorModalLegacySection from './ParamOverrideEditorModalLegacySection';
import ParamOverrideEditorModalConditionsSection from './ParamOverrideEditorModalConditionsSection';
import ParamOverrideEditorModalOperationHeaderSection from './ParamOverrideEditorModalOperationHeaderSection';
import ParamOverrideEditorModalOperationsSidebarSection from './ParamOverrideEditorModalOperationsSidebarSection';
import ParamOverrideEditorModalValueEditorSection from './ParamOverrideEditorModalValueEditorSection';
import useParamOverrideEditorModalEffects from './useParamOverrideEditorModalEffects';
import useParamOverrideEditorModalState from './useParamOverrideEditorModalState';
import {
  buildAddConditionResult,
  buildAddOperationResult,
  buildConditionUpdateResult,
  buildOperationPatchResult,
  buildRemoveConditionResult,
  buildRemoveOperationResult,
} from './paramOverrideEditorModalActions';
import {
  MODE_META,
  TEMPLATE_GROUP_OPTIONS,
} from './paramOverrideEditorModalConstants';
import {
  buildOperationsJson,
  buildPruneObjectsValueText,
  buildReturnErrorValueText,
  buildSyncTargetSpec,
  createDefaultCondition,
  createDefaultOperation,
  normalizeOperation,
  normalizePruneRule,
  parseLooseValue,
  parsePruneObjectsDraft,
  parseReturnErrorDraft,
  parseSyncTargetSpec,
  reorderOperations,
} from './paramOverrideEditorModalData';
import { validateOperations } from './paramOverrideEditorModalValidation';

const { Text } = Typography;

const ParamOverrideEditorModal = ({ visible, value, onSave, onCancel }) => {
  const { t } = useTranslation();
  const state = useParamOverrideEditorModalState();
  const {
    editMode,
    setEditMode,
    visualMode,
    setVisualMode,
    legacyValue,
    setLegacyValue,
    operations,
    setOperations,
    jsonText,
    setJsonText,
    jsonError,
    setJsonError,
    operationSearch,
    setOperationSearch,
    selectedOperationId,
    setSelectedOperationId,
    expandedConditionMap,
    setExpandedConditionMap,
    draggedOperationId,
    setDraggedOperationId,
    dragOverOperationId,
    setDragOverOperationId,
    dragOverPosition,
    setDragOverPosition,
    templateGroupKey,
    setTemplateGroupKey,
    templatePresetKey,
    setTemplatePresetKey,
    headerValueExampleVisible,
    setHeaderValueExampleVisible,
    fieldGuideVisible,
    setFieldGuideVisible,
    fieldGuideTarget,
    setFieldGuideTarget,
    fieldGuideKeyword,
    setFieldGuideKeyword,
    templatePresetOptions,
    operationCount,
    filteredOperations,
    selectedOperation,
    selectedOperationIndex,
    returnErrorDraft,
    pruneObjectsDraft,
    topOperationModes,
    filteredFieldGuideSections,
    fieldGuideActionLabel,
    fieldGuideFieldCount,
    selectedConditionKeys,
  } = state;

  useParamOverrideEditorModalEffects({ visible, value, state });

  const buildOperationsJsonWithValidation = useCallback(
    (sourceOperations, options = {}) =>
      buildOperationsJson(sourceOperations, t, validateOperations, options),
    [t],
  );

  const buildVisualJson = useCallback(() => {
    if (visualMode === 'legacy') {
      const trimmed = legacyValue.trim();
      if (!trimmed) return '';
      if (!verifyJSON(trimmed)) {
        throw new Error(t('参数覆盖必须是合法的 JSON 格式！'));
      }
      const parsed = JSON.parse(trimmed);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error(t('旧格式必须是 JSON 对象'));
      }
      return JSON.stringify(parsed, null, 2);
    }
    return buildOperationsJsonWithValidation(operations, { validate: true });
  }, [buildOperationsJsonWithValidation, legacyValue, operations, t, visualMode]);

  const switchToJsonMode = () => {
    if (editMode === 'json') return;
    try {
      setJsonText(buildVisualJson());
      setJsonError('');
    } catch (error) {
      showError(error.message);
      if (visualMode === 'legacy') {
        setJsonText(legacyValue);
      } else {
          setJsonText(buildOperationsJsonWithValidation(operations, { validate: false }));
      }
      setJsonError(error.message || t('参数配置有误'));
    }
    setEditMode('json');
  };

  const switchToVisualMode = () => {
    if (editMode === 'visual') return;
    const trimmed = jsonText.trim();
    if (!trimmed) {
      const fallback = createDefaultOperation();
      setVisualMode('operations');
      setOperations([fallback]);
      setSelectedOperationId(fallback.id);
      setLegacyValue('');
      setJsonError('');
      setEditMode('visual');
      return;
    }
    if (!verifyJSON(trimmed)) {
      showError(t('参数覆盖必须是合法的 JSON 格式！'));
      return;
    }
    const parsed = JSON.parse(trimmed);
    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      Array.isArray(parsed.operations)
    ) {
      const nextOperations =
        parsed.operations.length > 0
          ? parsed.operations.map(normalizeOperation)
          : [createDefaultOperation()];
      setVisualMode('operations');
      setOperations(nextOperations);
      setSelectedOperationId(nextOperations[0]?.id || '');
      setLegacyValue('');
      setJsonError('');
      setEditMode('visual');
      setTemplateGroupKey('basic');
      setTemplatePresetKey('operations_default');
      return;
    }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const fallback = createDefaultOperation();
      setVisualMode('legacy');
      setLegacyValue(JSON.stringify(parsed, null, 2));
      setOperations([fallback]);
      setSelectedOperationId(fallback.id);
      setJsonError('');
      setEditMode('visual');
      setTemplateGroupKey('basic');
      setTemplatePresetKey('legacy_default');
      return;
    }
    showError(t('参数覆盖必须是合法的 JSON 对象'));
  };

  const fillLegacyTemplate = (legacyPayload) => {
    const text = JSON.stringify(legacyPayload, null, 2);
    const fallback = createDefaultOperation();
    setVisualMode('legacy');
    setLegacyValue(text);
    setOperations([fallback]);
    setSelectedOperationId(fallback.id);
    setExpandedConditionMap({});
    setJsonText(text);
    setJsonError('');
    setEditMode('visual');
  };

  const fillOperationsTemplate = (operationsPayload) => {
    const nextOperations = (operationsPayload || []).map(normalizeOperation);
    const finalOperations =
      nextOperations.length > 0 ? nextOperations : [createDefaultOperation()];
    setVisualMode('operations');
    setOperations(finalOperations);
    setSelectedOperationId(finalOperations[0]?.id || '');
    setExpandedConditionMap({});
    setJsonText(JSON.stringify({ operations: operationsPayload || [] }, null, 2));
    setJsonError('');
    setEditMode('visual');
  };

  const appendLegacyTemplate = (legacyPayload) => {
    let parsedCurrent = {};
    if (visualMode === 'legacy') {
      const trimmed = legacyValue.trim();
      if (trimmed) {
        if (!verifyJSON(trimmed)) {
          showError(t('当前旧格式 JSON 不合法，无法追加模板'));
          return;
        }
        const parsed = JSON.parse(trimmed);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          showError(t('当前旧格式不是 JSON 对象，无法追加模板'));
          return;
        }
        parsedCurrent = parsed;
      }
    }

    const merged = {
      ...(legacyPayload || {}),
      ...parsedCurrent,
    };
    const text = JSON.stringify(merged, null, 2);
    const fallback = createDefaultOperation();
    setVisualMode('legacy');
    setLegacyValue(text);
    setOperations([fallback]);
    setSelectedOperationId(fallback.id);
    setExpandedConditionMap({});
    setJsonText(text);
    setJsonError('');
    setEditMode('visual');
  };

  const appendOperationsTemplate = (operationsPayload) => {
    const appended = (operationsPayload || []).map(normalizeOperation);
    const existing =
      visualMode === 'operations'
        ? operations.filter((item) => !isOperationBlank(item))
        : [];
    const nextOperations = [...existing, ...appended];
    setVisualMode('operations');
    setOperations(nextOperations.length > 0 ? nextOperations : appended);
    setSelectedOperationId(nextOperations[0]?.id || appended[0]?.id || '');
    setExpandedConditionMap({});
    setLegacyValue('');
    setJsonError('');
    setEditMode('visual');
    setJsonText('');
  };

  const clearValue = () => {
    const fallback = createDefaultOperation();
    setVisualMode('operations');
    setLegacyValue('');
    setOperations([fallback]);
    setSelectedOperationId(fallback.id);
    setExpandedConditionMap({});
    setJsonText('');
    setJsonError('');
    setTemplateGroupKey('basic');
    setTemplatePresetKey('operations_default');
  };

  const getSelectedTemplatePreset = () =>
    TEMPLATE_PRESET_CONFIG[templatePresetKey] ||
    TEMPLATE_PRESET_CONFIG.operations_default;

  const fillTemplateFromLibrary = () => {
    const preset = getSelectedTemplatePreset();
    if (preset.kind === 'legacy') {
      fillLegacyTemplate(preset.payload || {});
      return;
    }
    fillOperationsTemplate(preset.payload?.operations || []);
  };

  const appendTemplateFromLibrary = () => {
    const preset = getSelectedTemplatePreset();
    if (preset.kind === 'legacy') {
      appendLegacyTemplate(preset.payload || {});
      return;
    }
    appendOperationsTemplate(preset.payload?.operations || []);
  };

  const resetEditorState = () => {
    clearValue();
    setEditMode('visual');
  };

  const applyBuiltinField = (fieldKey, target = 'path') => {
    if (!selectedOperation) {
      showError(t('请先选择一条规则'));
      return;
    }
    const mode = selectedOperation.mode || 'set';
    const meta = MODE_META[mode] || MODE_META.set;
    if (target === 'path' && (meta.path || meta.pathOptional || meta.pathAlias)) {
      updateOperation(selectedOperation.id, { path: fieldKey });
      return;
    }
    if (target === 'from' && (meta.from || meta.pathAlias || mode === 'sync_fields')) {
      updateOperation(selectedOperation.id, {
        from: mode === 'sync_fields' ? buildSyncTargetSpec('json', fieldKey) : fieldKey,
      });
      return;
    }
    if (target === 'to' && (meta.to || mode === 'sync_fields')) {
      updateOperation(selectedOperation.id, {
        to: mode === 'sync_fields' ? buildSyncTargetSpec('json', fieldKey) : fieldKey,
      });
      return;
    }
    showError(t('当前规则不支持写入到该位置'));
  };

  const openFieldGuide = (target = 'path') => {
    setFieldGuideTarget(target);
    setFieldGuideVisible(true);
  };

  const copyBuiltinField = async (fieldKey) => {
    const ok = await copy(fieldKey);
    if (ok) {
      showSuccess(t('已复制字段：{{name}}', { name: fieldKey }));
    } else {
      showError(t('复制失败'));
    }
  };

  const updateOperation = (operationId, patch) => {
    setOperations((prev) => buildOperationPatchResult({ operations: prev, operationId, patch }));
  };

  const formatSelectedOperationValueAsJson = useCallback(() => {
    if (!selectedOperation) return;
    const raw = String(selectedOperation.value_text || '').trim();
    if (!raw) return;
    if (!verifyJSON(raw)) {
      showError(t('当前值不是合法 JSON，无法格式化'));
      return;
    }
    try {
      updateOperation(selectedOperation.id, {
        value_text: JSON.stringify(JSON.parse(raw), null, 2),
      });
      showSuccess(t('JSON 已格式化'));
    } catch (error) {
      showError(t('当前值不是合法 JSON，无法格式化'));
    }
  }, [selectedOperation, t, updateOperation]);

  const updateReturnErrorDraft = (operationId, draftPatch = {}) => {
    const current = operations.find((item) => item.id === operationId);
    if (!current) return;
    const draft = parseReturnErrorDraft(current.value_text);
    const nextDraft = { ...draft, ...draftPatch };
    updateOperation(operationId, {
      value_text: buildReturnErrorValueText(nextDraft),
    });
  };

  const updatePruneObjectsDraft = (operationId, updater) => {
    const current = operations.find((item) => item.id === operationId);
    if (!current) return;
    const draft = parsePruneObjectsDraft(current.value_text);
    const nextDraft =
      typeof updater === 'function'
        ? updater(draft)
        : { ...draft, ...(updater || {}) };
    updateOperation(operationId, {
      value_text: buildPruneObjectsValueText(nextDraft),
    });
  };

  const addPruneRule = (operationId) => {
    updatePruneObjectsDraft(operationId, (draft) => ({
      ...draft,
      simpleMode: false,
      rules: [...(draft.rules || []), normalizePruneRule({})],
    }));
  };

  const updatePruneRule = (operationId, ruleId, patch) => {
    updatePruneObjectsDraft(operationId, (draft) => ({
      ...draft,
      rules: (draft.rules || []).map((rule) =>
        rule.id === ruleId ? { ...rule, ...patch } : rule,
      ),
    }));
  };

  const removePruneRule = (operationId, ruleId) => {
    updatePruneObjectsDraft(operationId, (draft) => ({
      ...draft,
      rules: (draft.rules || []).filter((rule) => rule.id !== ruleId),
    }));
  };

  const addOperation = () => {
    const result = buildAddOperationResult({ operations, createDefaultOperation });
    setOperations(result.operations);
    setSelectedOperationId(result.selectedOperationId);
  };

  const resetOperationDragState = useCallback(() => {
    setDraggedOperationId('');
    setDragOverOperationId('');
    setDragOverPosition('before');
  }, []);

  const moveOperation = useCallback(
    (sourceId, targetId, position = 'before') => {
      if (!sourceId || !targetId || sourceId === targetId) {
        return;
      }
      setOperations((prev) =>
        reorderOperations(prev, sourceId, targetId, position),
      );
      setSelectedOperationId(sourceId);
    },
    [],
  );

  const handleOperationDragStart = useCallback((event, operationId) => {
    setDraggedOperationId(operationId);
    setSelectedOperationId(operationId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', operationId);
  }, []);

  const handleOperationDragOver = useCallback(
    (event, operationId) => {
      event.preventDefault();
      if (!draggedOperationId || draggedOperationId === operationId) {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      const position =
        event.clientY - rect.top > rect.height / 2 ? 'after' : 'before';
      setDragOverOperationId(operationId);
      setDragOverPosition(position);
      event.dataTransfer.dropEffect = 'move';
    },
    [draggedOperationId],
  );

  const handleOperationDrop = useCallback(
    (event, operationId) => {
      event.preventDefault();
      const sourceId =
        draggedOperationId || event.dataTransfer.getData('text/plain');
      const position =
        dragOverOperationId === operationId ? dragOverPosition : 'before';
      moveOperation(sourceId, operationId, position);
      resetOperationDragState();
    },
    [
      dragOverOperationId,
      dragOverPosition,
      draggedOperationId,
      moveOperation,
      resetOperationDragState,
    ],
  );

  const duplicateOperation = (operationId) => {
    let insertedId = '';
    setOperations((prev) => {
      const index = prev.findIndex((item) => item.id === operationId);
      if (index < 0) return prev;
      const source = prev[index];
      const cloned = normalizeOperation({
        description: source.description,
        path: source.path,
        mode: source.mode,
        value: parseLooseValue(source.value_text),
        keep_origin: source.keep_origin,
        from: source.from,
        to: source.to,
        logic: source.logic,
        conditions: (source.conditions || []).map((condition) => ({
          path: condition.path,
          mode: condition.mode,
          value: parseLooseValue(condition.value_text),
          invert: condition.invert,
          pass_missing_key: condition.pass_missing_key,
        })),
      });
      insertedId = cloned.id;
      const next = [...prev];
      next.splice(index + 1, 0, cloned);
      return next;
    });
    if (insertedId) {
      setSelectedOperationId(insertedId);
    }
  };

  const removeOperation = (operationId) => {
    const result = buildRemoveOperationResult({
      operations,
      operationId,
      createDefaultOperation,
    });
    setOperations(result.operations);
    setExpandedConditionMap((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, operationId)) {
        return prev;
      }
      const next = { ...prev };
      delete next[operationId];
      return next;
    });
  };

  const addCondition = (operationId) => {
    const result = buildAddConditionResult({
      operations,
      operationId,
      createDefaultCondition,
      expandedConditionMap,
    });
    setOperations(result.operations);
    setExpandedConditionMap(result.expandedConditionMap);
  };

  const updateCondition = (operationId, conditionId, patch) => {
    setOperations((prev) =>
      buildConditionUpdateResult({ operations: prev, operationId, conditionId, patch }),
    );
  };

  const removeCondition = (operationId, conditionId) => {
    const result = buildRemoveConditionResult({
      operations,
      operationId,
      conditionId,
      expandedConditionMap,
    });
    setOperations(result.operations);
    setExpandedConditionMap(result.expandedConditionMap);
  };

  const handleConditionCollapseChange = useCallback(
    (operationId, activeKeys) => {
      const keys = (
        Array.isArray(activeKeys) ? activeKeys : [activeKeys]
      ).filter(Boolean);
      setExpandedConditionMap((prev) => ({
        ...prev,
        [operationId]: keys,
      }));
    },
    [],
  );

  const expandAllSelectedConditions = useCallback(() => {
    if (!selectedOperationId || !selectedOperation) return;
    setExpandedConditionMap((prev) => ({
      ...prev,
      [selectedOperationId]: (selectedOperation.conditions || []).map(
        (condition) => condition.id,
      ),
    }));
  }, [selectedOperation, selectedOperationId]);

  const collapseAllSelectedConditions = useCallback(() => {
    if (!selectedOperationId) return;
    setExpandedConditionMap((prev) => ({
      ...prev,
      [selectedOperationId]: [],
    }));
  }, [selectedOperationId]);

  const handleJsonChange = (nextValue) => {
    setJsonText(nextValue);
    const trimmed = String(nextValue || '').trim();
    if (!trimmed) {
      setJsonError('');
      return;
    }
    if (!verifyJSON(trimmed)) {
      setJsonError(t('JSON格式错误'));
      return;
    }
    setJsonError('');
  };

  const formatJson = () => {
    const trimmed = jsonText.trim();
    if (!trimmed) return;
    if (!verifyJSON(trimmed)) {
      showError(t('参数覆盖必须是合法的 JSON 格式！'));
      return;
    }
    setJsonText(JSON.stringify(JSON.parse(trimmed), null, 2));
    setJsonError('');
  };

  const visualValidationError = React.useMemo(() => {
    if (editMode !== 'visual') {
      return '';
    }
    try {
      buildVisualJson();
      return '';
    } catch (error) {
      return error?.message || t('参数配置有误');
    }
  }, [buildVisualJson, editMode, t]);

  const handleSave = () => {
    try {
      let result = '';
      if (editMode === 'json') {
        const trimmed = jsonText.trim();
        if (!trimmed) {
          result = '';
        } else {
          if (!verifyJSON(trimmed)) {
            throw new Error(t('参数覆盖必须是合法的 JSON 格式！'));
          }
          result = JSON.stringify(JSON.parse(trimmed), null, 2);
        }
      } else {
        result = buildVisualJson();
      }
      onSave?.(result);
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <>
      <Modal
      title={t('参数覆盖')}
      visible={visible}
      width={1120}
      bodyStyle={{ maxHeight: '76vh', overflowY: 'auto', paddingTop: 10 }}
      onCancel={onCancel}
      onOk={handleSave}
      okText={t('保存')}
      cancelText={t('取消')}
    >
      <Space vertical align='start' spacing={14} style={{ width: '100%' }}>
        <Card
          className='!rounded-xl !border-0 w-full'
          bodyStyle={{
            padding: 12,
            background: 'var(--semi-color-fill-0)',
          }}
        >
          <div className='flex items-start justify-between gap-3'>
            <Space wrap spacing={8}>
              <Tag color='grey'>{t('编辑方式')}</Tag>
              <Button
                type={editMode === 'visual' ? 'primary' : 'tertiary'}
                onClick={switchToVisualMode}
              >
                {t('可视化')}
              </Button>
              <Button
                type={editMode === 'json' ? 'primary' : 'tertiary'}
                onClick={switchToJsonMode}
              >
                {t('JSON 文本')}
              </Button>
              <Tag color='grey'>{t('模板')}</Tag>
              <Select
                value={templateGroupKey}
                optionList={TEMPLATE_GROUP_OPTIONS}
                onChange={(nextValue) =>
                  setTemplateGroupKey(nextValue || 'basic')
                }
                style={{ width: 120 }}
              />
              <Select
                value={templatePresetKey}
                optionList={templatePresetOptions}
                onChange={(nextValue) =>
                  setTemplatePresetKey(nextValue || 'operations_default')
                }
                style={{ width: 260 }}
              />
              <Button onClick={fillTemplateFromLibrary}>{t('填充模板')}</Button>
              <Button type='tertiary' onClick={appendTemplateFromLibrary}>
                {t('追加模板')}
              </Button>
              <Button type='tertiary' onClick={resetEditorState}>
                {t('重置')}
              </Button>
            </Space>
          </div>
        </Card>

        {editMode === 'visual' ? (
          <div style={{ width: '100%' }}>
            {visualMode === 'legacy' ? (
              <ParamOverrideEditorModalLegacySection
                legacyValue={legacyValue}
                setLegacyValue={setLegacyValue}
              />
            ) : (
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <Space>
                    <Text>{t('新格式（规则 + 条件）')}</Text>
                    <Tag color='cyan'>{`${t('规则')}: ${operationCount}`}</Tag>
                  </Space>
                  <Button icon={<IconPlus />} onClick={addOperation}>
                    {t('新增规则')}
                  </Button>
                </div>

                <Row gutter={12}>
                  <Col xs={24} md={8}>
                    <ParamOverrideEditorModalOperationsSidebarSection
                      operationCount={operationCount}
                      operations={operations}
                      topOperationModes={topOperationModes}
                      operationSearch={operationSearch}
                      setOperationSearch={setOperationSearch}
                      filteredOperations={filteredOperations}
                      selectedOperationId={selectedOperationId}
                      setSelectedOperationId={setSelectedOperationId}
                      draggedOperationId={draggedOperationId}
                      dragOverOperationId={dragOverOperationId}
                      dragOverPosition={dragOverPosition}
                      handleOperationDragStart={handleOperationDragStart}
                      handleOperationDragOver={handleOperationDragOver}
                      handleOperationDrop={handleOperationDrop}
                      resetOperationDragState={resetOperationDragState}
                    />
                  </Col>
                  <Col xs={24} md={16}>
                    {selectedOperation ? (
                      (() => {
                        const mode = selectedOperation.mode || 'set';
                        const meta = MODE_META[mode] || MODE_META.set;
                        const conditions = selectedOperation.conditions || [];
                        const syncFromTarget =
                          mode === 'sync_fields'
                            ? parseSyncTargetSpec(selectedOperation.from)
                            : null;
                        const syncToTarget =
                          mode === 'sync_fields'
                            ? parseSyncTargetSpec(selectedOperation.to)
                            : null;
                        return (
                          <Card
                            className='!rounded-2xl !border-0'
                            bodyStyle={{
                              padding: 14,
                              background: 'var(--semi-color-fill-0)',
                            }}
                          >
                            <ParamOverrideEditorModalOperationHeaderSection
                              selectedOperation={selectedOperation}
                              selectedOperationIndex={selectedOperationIndex}
                              meta={meta}
                              updateOperation={updateOperation}
                              duplicateOperation={duplicateOperation}
                              removeOperation={removeOperation}
                            />

                            <ParamOverrideEditorModalValueEditorSection
                              selectedOperation={selectedOperation}
                              meta={meta}
                              mode={mode}
                              returnErrorDraft={returnErrorDraft}
                              pruneObjectsDraft={pruneObjectsDraft}
                              syncFromTarget={syncFromTarget}
                              syncToTarget={syncToTarget}
                              updateOperation={updateOperation}
                              updateReturnErrorDraft={updateReturnErrorDraft}
                              updatePruneObjectsDraft={updatePruneObjectsDraft}
                              addPruneRule={addPruneRule}
                              updatePruneRule={updatePruneRule}
                              removePruneRule={removePruneRule}
                              setHeaderValueExampleVisible={setHeaderValueExampleVisible}
                              formatSelectedOperationValueAsJson={formatSelectedOperationValueAsJson}
                              buildSyncTargetSpec={buildSyncTargetSpec}
                            />

                            <ParamOverrideEditorModalConditionsSection
                              selectedOperation={selectedOperation}
                              conditions={conditions}
                              selectedConditionKeys={selectedConditionKeys}
                              updateOperation={updateOperation}
                              addCondition={addCondition}
                              updateCondition={updateCondition}
                              removeCondition={removeCondition}
                              expandAllSelectedConditions={expandAllSelectedConditions}
                              collapseAllSelectedConditions={collapseAllSelectedConditions}
                              handleConditionCollapseChange={handleConditionCollapseChange}
                            />
                          </Card>
                        );
                      })()
                    ) : (
                      <Card
                        className='!rounded-2xl !border-0'
                        bodyStyle={{
                          padding: 14,
                          background: 'var(--semi-color-fill-0)',
                        }}
                      >
                        <Text type='tertiary'>
                          {t('请选择一条规则进行编辑。')}
                        </Text>
                      </Card>
                    )}

                    {visualValidationError ? (
                      <Card
                        className='!rounded-2xl !border-0 mt-3'
                        bodyStyle={{
                          padding: 12,
                          background: 'var(--semi-color-fill-0)',
                        }}
                      >
                        <Space>
                          <Tag color='red'>{t('暂存错误')}</Tag>
                          <Text type='danger'>{visualValidationError}</Text>
                        </Space>
                      </Card>
                    ) : null}
                  </Col>
                </Row>
              </div>
            )}
          </div>
        ) : (
          <ParamOverrideEditorModalJsonSection
            jsonText={jsonText}
            jsonError={jsonError}
            formatJson={formatJson}
            handleJsonChange={handleJsonChange}
          />
        )}
      </Space>
      </Modal>

      <ParamOverrideEditorModalHeaderValueExampleModal
        visible={headerValueExampleVisible}
        onCancel={() => setHeaderValueExampleVisible(false)}
      />

      <ParamOverrideEditorModalFieldGuideModal
        visible={fieldGuideVisible}
        fieldGuideKeyword={fieldGuideKeyword}
        setFieldGuideKeyword={setFieldGuideKeyword}
        fieldGuideTarget={fieldGuideTarget}
        setFieldGuideTarget={setFieldGuideTarget}
        fieldGuideFieldCount={fieldGuideFieldCount}
        filteredFieldGuideSections={filteredFieldGuideSections}
        copyBuiltinField={copyBuiltinField}
        applyBuiltinField={applyBuiltinField}
        fieldGuideActionLabel={fieldGuideActionLabel}
        onCancel={() => setFieldGuideVisible(false)}
      />
    </>
  );
};

export default ParamOverrideEditorModal;
