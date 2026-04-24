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

import { useMemo, useState } from 'react';
import { BUILTIN_FIELD_SECTIONS, TEMPLATE_PRESET_CONFIG } from './paramOverrideEditorModalConstants';
import { createDefaultOperation, isOperationBlank, parsePruneObjectsDraft, parseReturnErrorDraft } from './paramOverrideEditorModalData';

const useParamOverrideEditorModalState = () => {
  const [editMode, setEditMode] = useState('visual');
  const [visualMode, setVisualMode] = useState('operations');
  const [legacyValue, setLegacyValue] = useState('');
  const [operations, setOperations] = useState([createDefaultOperation()]);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [operationSearch, setOperationSearch] = useState('');
  const [selectedOperationId, setSelectedOperationId] = useState('');
  const [expandedConditionMap, setExpandedConditionMap] = useState({});
  const [draggedOperationId, setDraggedOperationId] = useState('');
  const [dragOverOperationId, setDragOverOperationId] = useState('');
  const [dragOverPosition, setDragOverPosition] = useState('before');
  const [templateGroupKey, setTemplateGroupKey] = useState('basic');
  const [templatePresetKey, setTemplatePresetKey] = useState('operations_default');
  const [headerValueExampleVisible, setHeaderValueExampleVisible] = useState(false);
  const [fieldGuideVisible, setFieldGuideVisible] = useState(false);
  const [fieldGuideTarget, setFieldGuideTarget] = useState('path');
  const [fieldGuideKeyword, setFieldGuideKeyword] = useState('');

  const templatePresetOptions = useMemo(
    () =>
      Object.entries(TEMPLATE_PRESET_CONFIG)
        .filter(([, config]) => config.group === templateGroupKey)
        .map(([value, config]) => ({
          value,
          label: config.label,
        })),
    [templateGroupKey],
  );

  const operationCount = useMemo(
    () => operations.filter((item) => !isOperationBlank(item)).length,
    [operations],
  );

  const filteredOperations = useMemo(() => {
    const keyword = operationSearch.trim().toLowerCase();
    if (!keyword) return operations;
    return operations.filter((operation) => {
      const searchableText = [
        operation.description,
        operation.mode,
        operation.path,
        operation.from,
        operation.to,
        operation.value_text,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(keyword);
    });
  }, [operationSearch, operations]);

  const selectedOperation = useMemo(
    () => operations.find((operation) => operation.id === selectedOperationId),
    [operations, selectedOperationId],
  );

  const selectedOperationIndex = useMemo(
    () => operations.findIndex((operation) => operation.id === selectedOperationId),
    [operations, selectedOperationId],
  );

  const returnErrorDraft = useMemo(() => {
    if (!selectedOperation || (selectedOperation.mode || '') !== 'return_error') {
      return null;
    }
    return parseReturnErrorDraft(selectedOperation.value_text);
  }, [selectedOperation]);

  const pruneObjectsDraft = useMemo(() => {
    if (!selectedOperation || (selectedOperation.mode || '') !== 'prune_objects') {
      return null;
    }
    return parsePruneObjectsDraft(selectedOperation.value_text);
  }, [selectedOperation]);

  const topOperationModes = useMemo(() => {
    const counts = operations.reduce((acc, operation) => {
      const mode = operation.mode || 'set';
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [operations]);

  const filteredFieldGuideSections = useMemo(() => {
    const keyword = fieldGuideKeyword.trim().toLowerCase();
    if (!keyword) {
      return BUILTIN_FIELD_SECTIONS;
    }
    return BUILTIN_FIELD_SECTIONS.map((section) => ({
      ...section,
      fields: section.fields.filter((field) =>
        [field.key, field.label, field.tip]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(keyword),
      ),
    })).filter((section) => section.fields.length > 0);
  }, [fieldGuideKeyword]);

  const fieldGuideActionLabel = useMemo(() => {
    if (fieldGuideTarget === 'from') return '填入来源';
    if (fieldGuideTarget === 'to') return '填入目标';
    return '填入路径';
  }, [fieldGuideTarget]);

  const fieldGuideFieldCount = useMemo(
    () =>
      filteredFieldGuideSections.reduce(
        (total, section) => total + section.fields.length,
        0,
      ),
    [filteredFieldGuideSections],
  );

  const selectedConditionKeys = useMemo(
    () => expandedConditionMap[selectedOperationId] || [],
    [expandedConditionMap, selectedOperationId],
  );

  return {
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
  };
};

export default useParamOverrideEditorModalState;
