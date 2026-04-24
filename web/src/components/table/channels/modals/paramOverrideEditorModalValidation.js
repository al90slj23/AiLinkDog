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
  FROM_REQUIRED_MODES,
  MODE_META,
  TO_REQUIRED_MODES,
  VALUE_REQUIRED_MODES,
} from './paramOverrideEditorModalConstants';
import { parseLooseValue, parsePassHeaderNames } from './paramOverrideEditorModalData';

export const validateOperations = (operations, t) => {
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const mode = op.mode || 'set';
    const meta = MODE_META[mode] || MODE_META.set;
    const line = i + 1;
    const pathValue = op.path.trim();
    const fromValue = op.from.trim();
    const toValue = op.to.trim();

    if (meta.path && !pathValue) {
      return t('第 {{line}} 条操作缺少目标路径', { line });
    }
    if (FROM_REQUIRED_MODES.has(mode) && !fromValue) {
      if (!(meta.pathAlias && pathValue)) {
        return t('第 {{line}} 条操作缺少来源字段', { line });
      }
    }
    if (TO_REQUIRED_MODES.has(mode) && !toValue) {
      if (!(meta.pathAlias && pathValue)) {
        return t('第 {{line}} 条操作缺少目标字段', { line });
      }
    }
    if (meta.from && !fromValue) {
      return t('第 {{line}} 条操作缺少来源字段', { line });
    }
    if (meta.to && !toValue) {
      return t('第 {{line}} 条操作缺少目标字段', { line });
    }
    if (VALUE_REQUIRED_MODES.has(mode) && String(op.value_text ?? '').trim() === '') {
      return t('第 {{line}} 条操作缺少值', { line });
    }
    if (mode === 'return_error') {
      const raw = String(op.value_text ?? '').trim();
      if (!raw) {
        return t('第 {{line}} 条操作缺少值', { line });
      }
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          if (!String(parsed.message || '').trim()) {
            return t('第 {{line}} 条 return_error 需要 message 字段', { line });
          }
        }
      } catch (error) {
        // plain string value is allowed
      }
    }
    if (mode === 'prune_objects') {
      const raw = String(op.value_text ?? '').trim();
      if (!raw) {
        return t('第 {{line}} 条 prune_objects 缺少条件', { line });
      }
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const hasType = parsed.type !== undefined && String(parsed.type).trim() !== '';
          const hasWhere =
            parsed.where &&
            typeof parsed.where === 'object' &&
            !Array.isArray(parsed.where) &&
            Object.keys(parsed.where).length > 0;
          const hasConditionsArray = Array.isArray(parsed.conditions) && parsed.conditions.length > 0;
          const hasConditionsObject =
            parsed.conditions &&
            typeof parsed.conditions === 'object' &&
            !Array.isArray(parsed.conditions) &&
            Object.keys(parsed.conditions).length > 0;
          if (!hasType && !hasWhere && !hasConditionsArray && !hasConditionsObject) {
            return t('第 {{line}} 条 prune_objects 需要至少一个匹配条件', { line });
          }
        }
      } catch (error) {
        // non-JSON string is treated as type string
      }
    }
    if (mode === 'pass_headers') {
      const raw = String(op.value_text ?? '').trim();
      if (!raw) {
        return t('第 {{line}} 条请求头透传缺少请求头名称', { line });
      }
      const parsed = parseLooseValue(raw);
      const headers = parsePassHeaderNames(parsed);
      if (headers.length === 0) {
        return t('第 {{line}} 条请求头透传格式无效', { line });
      }
    }
  }
  return '';
};
