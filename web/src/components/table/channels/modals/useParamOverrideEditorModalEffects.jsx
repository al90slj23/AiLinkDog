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

import { useEffect } from 'react';
import { parseInitialState } from './paramOverrideEditorModalData';

const useParamOverrideEditorModalEffects = ({ visible, value, state }) => {
  const {
    setEditMode,
    setVisualMode,
    setLegacyValue,
    setOperations,
    setJsonText,
    setJsonError,
    setOperationSearch,
    setSelectedOperationId,
    setExpandedConditionMap,
    setDraggedOperationId,
    setDragOverOperationId,
    setDragOverPosition,
    setTemplateGroupKey,
    setTemplatePresetKey,
    setHeaderValueExampleVisible,
    setFieldGuideVisible,
    setFieldGuideTarget,
    setFieldGuideKeyword,
    operations,
    selectedOperationId,
    templatePresetKey,
    templatePresetOptions,
  } = state;

  useEffect(() => {
    if (!visible) return;
    const nextState = parseInitialState(value);
    setEditMode(nextState.editMode);
    setVisualMode(nextState.visualMode);
    setLegacyValue(nextState.legacyValue);
    setOperations(nextState.operations);
    setJsonText(nextState.jsonText);
    setJsonError(nextState.jsonError);
    setOperationSearch('');
    setSelectedOperationId(nextState.operations[0]?.id || '');
    setExpandedConditionMap({});
    setDraggedOperationId('');
    setDragOverOperationId('');
    setDragOverPosition('before');
    if (nextState.visualMode === 'legacy') {
      setTemplateGroupKey('basic');
      setTemplatePresetKey('legacy_default');
    } else {
      setTemplateGroupKey('basic');
      setTemplatePresetKey('operations_default');
    }
    setHeaderValueExampleVisible(false);
    setFieldGuideVisible(false);
    setFieldGuideTarget('path');
    setFieldGuideKeyword('');
  }, [
    setDragOverOperationId,
    setDragOverPosition,
    setDraggedOperationId,
    setEditMode,
    setExpandedConditionMap,
    setFieldGuideKeyword,
    setFieldGuideTarget,
    setFieldGuideVisible,
    setHeaderValueExampleVisible,
    setJsonError,
    setJsonText,
    setLegacyValue,
    setOperations,
    setOperationSearch,
    setSelectedOperationId,
    setTemplateGroupKey,
    setTemplatePresetKey,
    setVisualMode,
    value,
    visible,
  ]);

  useEffect(() => {
    if (operations.length === 0) {
      setSelectedOperationId('');
      return;
    }
    if (!operations.some((item) => item.id === selectedOperationId)) {
      setSelectedOperationId(operations[0].id);
    }
  }, [operations, selectedOperationId, setSelectedOperationId]);

  useEffect(() => {
    if (templatePresetOptions.length === 0) return;
    const exists = templatePresetOptions.some(
      (item) => item.value === templatePresetKey,
    );
    if (!exists) {
      setTemplatePresetKey(templatePresetOptions[0].value);
    }
  }, [setTemplatePresetKey, templatePresetKey, templatePresetOptions]);
};

export default useParamOverrideEditorModalEffects;
