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

import {
  CONDITION_MODE_VALUES,
  MODE_META,
  OPERATION_MODE_VALUES,
} from './paramOverrideEditorModalConstants';

const verifyJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

let localIdSeed = 0;
const nextLocalId = () => `param_override_${Date.now()}_${localIdSeed++}`;

export const toValueText = (value) => {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

export const parseLooseValue = (valueText) => {
  const raw = String(valueText ?? '');
  if (raw.trim() === '') return '';
  try {
    return JSON.parse(raw);
  } catch (error) {
    return raw;
  }
};

export const parsePassHeaderNames = (rawValue) => {
  if (Array.isArray(rawValue)) {
    return rawValue.map((item) => String(item ?? '').trim()).filter(Boolean);
  }
  if (rawValue && typeof rawValue === 'object') {
    if (Array.isArray(rawValue.headers)) {
      return rawValue.headers.map((item) => String(item ?? '').trim()).filter(Boolean);
    }
    if (rawValue.header !== undefined) {
      const single = String(rawValue.header ?? '').trim();
      return single ? [single] : [];
    }
    return [];
  }
  if (typeof rawValue === 'string') {
    return rawValue
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export const parseReturnErrorDraft = (valueText) => {
  const defaults = {
    message: '',
    statusCode: 400,
    code: '',
    type: '',
    skipRetry: true,
    simpleMode: true,
  };
  const raw = String(valueText ?? '').trim();
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const statusRaw = parsed.status_code !== undefined ? parsed.status_code : parsed.status;
      const statusValue = Number(statusRaw);
      return {
        ...defaults,
        message: String(parsed.message || parsed.msg || '').trim(),
        statusCode:
          Number.isInteger(statusValue) && statusValue >= 100 && statusValue <= 599
            ? statusValue
            : 400,
        code: String(parsed.code || '').trim(),
        type: String(parsed.type || '').trim(),
        skipRetry: parsed.skip_retry !== false,
        simpleMode: false,
      };
    }
  } catch (error) {
    // treat as plain text message
  }
  return {
    ...defaults,
    message: raw,
    simpleMode: true,
  };
};

export const buildReturnErrorValueText = (draft = {}) => {
  const message = String(draft.message || '').trim();
  if (draft.simpleMode) {
    return message;
  }
  const statusCode = Number(draft.statusCode);
  const payload = {
    message,
    status_code:
      Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
        ? statusCode
        : 400,
  };
  const code = String(draft.code || '').trim();
  const type = String(draft.type || '').trim();
  if (code) payload.code = code;
  if (type) payload.type = type;
  if (draft.skipRetry === false) {
    payload.skip_retry = false;
  }
  return JSON.stringify(payload);
};

export const normalizePruneRule = (rule = {}) => ({
  id: nextLocalId(),
  path: typeof rule.path === 'string' ? rule.path : '',
  mode: CONDITION_MODE_VALUES.has(rule.mode) ? rule.mode : 'full',
  value_text: toValueText(rule.value),
  invert: rule.invert === true,
  pass_missing_key: rule.pass_missing_key === true,
});

export const parsePruneObjectsDraft = (valueText) => {
  const defaults = {
    simpleMode: true,
    typeText: '',
    logic: 'AND',
    recursive: true,
    rules: [],
  };
  const raw = String(valueText ?? '').trim();
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') {
      return { ...defaults, simpleMode: true, typeText: parsed.trim() };
    }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const rules = [];
      if (parsed.where && typeof parsed.where === 'object' && !Array.isArray(parsed.where)) {
        Object.entries(parsed.where).forEach(([path, value]) => {
          rules.push(normalizePruneRule({ path, mode: 'full', value }));
        });
      }
      if (Array.isArray(parsed.conditions)) {
        parsed.conditions.forEach((item) => {
          if (item && typeof item === 'object') {
            rules.push(normalizePruneRule(item));
          }
        });
      } else if (
        parsed.conditions &&
        typeof parsed.conditions === 'object' &&
        !Array.isArray(parsed.conditions)
      ) {
        Object.entries(parsed.conditions).forEach(([path, value]) => {
          rules.push(normalizePruneRule({ path, mode: 'full', value }));
        });
      }
      const typeText = parsed.type === undefined ? '' : String(parsed.type).trim();
      const logic = String(parsed.logic || 'AND').toUpperCase() === 'OR' ? 'OR' : 'AND';
      const recursive = parsed.recursive !== false;
      const hasAdvancedFields =
        parsed.logic !== undefined ||
        parsed.recursive !== undefined ||
        parsed.where !== undefined ||
        parsed.conditions !== undefined;
      return {
        ...defaults,
        simpleMode: !hasAdvancedFields,
        typeText,
        logic,
        recursive,
        rules,
      };
    }
    return {
      ...defaults,
      simpleMode: true,
      typeText: String(parsed ?? '').trim(),
    };
  } catch (error) {
    return {
      ...defaults,
      simpleMode: true,
      typeText: raw,
    };
  }
};

export const buildPruneObjectsValueText = (draft = {}) => {
  const typeText = String(draft.typeText || '').trim();
  if (draft.simpleMode) return typeText;
  const payload = {};
  if (typeText) payload.type = typeText;
  if (String(draft.logic || 'AND').toUpperCase() === 'OR') {
    payload.logic = 'OR';
  }
  if (draft.recursive === false) {
    payload.recursive = false;
  }
  const conditions = (draft.rules || [])
    .filter((rule) => String(rule.path || '').trim())
    .map((rule) => {
      const conditionPayload = {
        path: String(rule.path || '').trim(),
        mode: CONDITION_MODE_VALUES.has(rule.mode) ? rule.mode : 'full',
      };
      const valueRaw = String(rule.value_text || '').trim();
      if (valueRaw !== '') {
        conditionPayload.value = parseLooseValue(valueRaw);
      }
      if (rule.invert) conditionPayload.invert = true;
      if (rule.pass_missing_key) conditionPayload.pass_missing_key = true;
      return conditionPayload;
    });
  if (conditions.length > 0) {
    payload.conditions = conditions;
  }
  if (!payload.type && !payload.conditions) {
    return JSON.stringify({ logic: 'AND' });
  }
  return JSON.stringify(payload);
};

export const parseSyncTargetSpec = (spec) => {
  const raw = String(spec ?? '').trim();
  if (!raw) return { type: 'json', key: '' };
  const idx = raw.indexOf(':');
  if (idx < 0) return { type: 'json', key: raw };
  const prefix = raw.slice(0, idx).trim().toLowerCase();
  const key = raw.slice(idx + 1).trim();
  if (prefix === 'header') {
    return { type: 'header', key };
  }
  return { type: 'json', key };
};

export const buildSyncTargetSpec = (type, key) => {
  const normalizedType = type === 'header' ? 'header' : 'json';
  const normalizedKey = String(key ?? '').trim();
  if (!normalizedKey) return '';
  return `${normalizedType}:${normalizedKey}`;
};

export const normalizeCondition = (condition = {}) => ({
  id: nextLocalId(),
  path: typeof condition.path === 'string' ? condition.path : '',
  mode: CONDITION_MODE_VALUES.has(condition.mode) ? condition.mode : 'full',
  value_text: toValueText(condition.value),
  invert: condition.invert === true,
  pass_missing_key: condition.pass_missing_key === true,
});

export const createDefaultCondition = () => normalizeCondition({});

export const normalizeOperation = (operation = {}) => ({
  id: nextLocalId(),
  description: typeof operation.description === 'string' ? operation.description : '',
  path: typeof operation.path === 'string' ? operation.path : '',
  mode: OPERATION_MODE_VALUES.has(operation.mode) ? operation.mode : 'set',
  value_text: toValueText(operation.value),
  keep_origin: operation.keep_origin === true,
  from: typeof operation.from === 'string' ? operation.from : '',
  to: typeof operation.to === 'string' ? operation.to : '',
  logic: String(operation.logic || 'OR').toUpperCase() === 'AND' ? 'AND' : 'OR',
  conditions: Array.isArray(operation.conditions)
    ? operation.conditions.map(normalizeCondition)
    : [],
});

export const createDefaultOperation = () => normalizeOperation({ mode: 'set' });

export const reorderOperations = (
  sourceOperations = [],
  sourceId,
  targetId,
  position = 'before',
) => {
  if (!sourceId || !targetId || sourceId === targetId) {
    return sourceOperations;
  }
  const sourceIndex = sourceOperations.findIndex((item) => item.id === sourceId);
  if (sourceIndex < 0) {
    return sourceOperations;
  }
  const nextOperations = [...sourceOperations];
  const [moved] = nextOperations.splice(sourceIndex, 1);
  let insertIndex = nextOperations.findIndex((item) => item.id === targetId);
  if (insertIndex < 0) {
    return sourceOperations;
  }
  if (position === 'after') {
    insertIndex += 1;
  }
  nextOperations.splice(insertIndex, 0, moved);
  return nextOperations;
};

export const parseInitialState = (rawValue) => {
  const text = typeof rawValue === 'string' ? rawValue : '';
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      editMode: 'visual',
      visualMode: 'operations',
      legacyValue: '',
      operations: [createDefaultOperation()],
      jsonText: '',
      jsonError: '',
    };
  }
  if (!verifyJSON(trimmed)) {
    return {
      editMode: 'json',
      visualMode: 'operations',
      legacyValue: '',
      operations: [createDefaultOperation()],
      jsonText: text,
      jsonError: 'JSON 格式不正确',
    };
  }
  const parsed = JSON.parse(trimmed);
  const pretty = JSON.stringify(parsed, null, 2);
  if (
    parsed &&
    typeof parsed === 'object' &&
    !Array.isArray(parsed) &&
    Array.isArray(parsed.operations)
  ) {
    return {
      editMode: 'visual',
      visualMode: 'operations',
      legacyValue: '',
      operations:
        parsed.operations.length > 0
          ? parsed.operations.map(normalizeOperation)
          : [createDefaultOperation()],
      jsonText: pretty,
      jsonError: '',
    };
  }
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return {
      editMode: 'visual',
      visualMode: 'legacy',
      legacyValue: pretty,
      operations: [createDefaultOperation()],
      jsonText: pretty,
      jsonError: '',
    };
  }
  return {
    editMode: 'json',
    visualMode: 'operations',
    legacyValue: '',
    operations: [createDefaultOperation()],
    jsonText: pretty,
    jsonError: '',
  };
};

export const isOperationBlank = (operation) => {
  const hasCondition = (operation.conditions || []).some(
    (condition) =>
      condition.path.trim() ||
      String(condition.value_text ?? '').trim() ||
      condition.mode !== 'full' ||
      condition.invert ||
      condition.pass_missing_key,
  );
  return (
    operation.mode === 'set' &&
    !operation.path.trim() &&
    !operation.from.trim() &&
    !operation.to.trim() &&
    String(operation.value_text ?? '').trim() === '' &&
    !operation.keep_origin &&
    !hasCondition
  );
};

export const buildConditionPayload = (condition) => {
  const path = condition.path.trim();
  if (!path) return null;
  const payload = {
    path,
    mode: condition.mode || 'full',
    value: parseLooseValue(condition.value_text),
  };
  if (condition.invert) payload.invert = true;
  if (condition.pass_missing_key) payload.pass_missing_key = true;
  return payload;
};

export const buildOperationsJson = (sourceOperations, t, validateOperations, options = {}) => {
  const { validate = true } = options;
  const filteredOps = sourceOperations.filter((item) => !isOperationBlank(item));
  if (filteredOps.length === 0) return '';
  if (validate) {
    const message = validateOperations(filteredOps, t);
    if (message) {
      throw new Error(message);
    }
  }
  const payloadOps = filteredOps.map((operation) => {
    const mode = operation.mode || 'set';
    const meta = MODE_META[mode] || MODE_META.set;
    const descriptionValue = String(operation.description || '').trim();
    const pathValue = operation.path.trim();
    const fromValue = operation.from.trim();
    const toValue = operation.to.trim();
    const payload = { mode };
    if (descriptionValue) payload.description = descriptionValue;
    if (meta.path) payload.path = pathValue;
    if (meta.pathOptional && pathValue) payload.path = pathValue;
    if (meta.value) payload.value = parseLooseValue(operation.value_text);
    if (meta.keepOrigin && operation.keep_origin) payload.keep_origin = true;
    if (meta.from) payload.from = fromValue;
    if (!meta.to && operation.to.trim()) payload.to = toValue;
    if (meta.to) payload.to = toValue;
    if (meta.pathAlias) {
      if (!payload.from && pathValue) payload.from = pathValue;
      if (!payload.to && pathValue) payload.to = pathValue;
    }
    const conditions = (operation.conditions || []).map(buildConditionPayload).filter(Boolean);
    if (conditions.length > 0) {
      payload.conditions = conditions;
      payload.logic = operation.logic === 'AND' ? 'AND' : 'OR';
    }
    return payload;
  });
  return JSON.stringify({ operations: payloadOps }, null, 2);
};
