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
  MODE_DESCRIPTIONS,
  OPERATION_MODE_LABEL_MAP,
} from './paramOverrideEditorModalConstants';

export const getModePathLabel = (mode) => {
  if (mode === 'set_header' || mode === 'delete_header') {
    return '请求头名称';
  }
  if (mode === 'prune_objects') {
    return '目标路径（可选）';
  }
  return '目标字段路径';
};

export const getModePathPlaceholder = (mode) => {
  if (mode === 'set_header') return 'Authorization';
  if (mode === 'delete_header') return 'X-Debug-Mode';
  if (mode === 'prune_objects') return 'messages';
  return 'temperature';
};

export const getModeFromLabel = (mode) => {
  if (mode === 'replace') return '匹配文本';
  if (mode === 'regex_replace') return '正则表达式';
  if (mode === 'copy_header' || mode === 'move_header') return '来源请求头';
  return '来源字段';
};

export const getModeFromPlaceholder = (mode) => {
  if (mode === 'replace') return 'openai/';
  if (mode === 'regex_replace') return '^gpt-';
  if (mode === 'copy_header' || mode === 'move_header') return 'Authorization';
  return 'model';
};

export const getModeToLabel = (mode) => {
  if (mode === 'replace' || mode === 'regex_replace') return '替换为';
  if (mode === 'copy_header' || mode === 'move_header') return '目标请求头';
  return '目标字段';
};

export const getModeToPlaceholder = (mode) => {
  if (mode === 'replace') return '（可留空）';
  if (mode === 'regex_replace') return 'openai/gpt-';
  if (mode === 'copy_header' || mode === 'move_header') return 'X-Upstream-Auth';
  return 'original_model';
};

export const getModeValueLabel = (mode) => {
  if (mode === 'set_header') return '请求头值（支持字符串或 JSON 映射）';
  if (mode === 'pass_headers') return '透传请求头（支持逗号分隔或 JSON 数组）';
  if (
    mode === 'trim_prefix' ||
    mode === 'trim_suffix' ||
    mode === 'ensure_prefix' ||
    mode === 'ensure_suffix'
  ) {
    return '前后缀文本';
  }
  if (mode === 'prune_objects') {
    return '清理规则（字符串或 JSON 对象）';
  }
  return '值（支持 JSON 或普通文本）';
};

export const getModeValuePlaceholder = (mode) => {
  if (mode === 'set_header') {
    return [
      '纯字符串（整条覆盖）：',
      'Bearer sk-xxx',
      '',
      '或使用 JSON 规则：',
      '{',
      '  "files-api-2025-04-14": null,',
      '  "advanced-tool-use-2025-11-20": "tool-search-tool-2025-10-19",',
      '  "$append": ["context-1m-2025-08-07"]',
      '}',
    ].join('\n');
  }
  if (mode === 'pass_headers') return 'Authorization, X-Request-Id';
  if (
    mode === 'trim_prefix' ||
    mode === 'trim_suffix' ||
    mode === 'ensure_prefix' ||
    mode === 'ensure_suffix'
  ) {
    return 'openai/';
  }
  if (mode === 'prune_objects') {
    return '{"type":"redacted_thinking"}';
  }
  return '0.7';
};

export const getOperationSummary = (operation = {}, index = 0) => {
  const mode = operation.mode || 'set';
  const modeLabel = OPERATION_MODE_LABEL_MAP[mode] || mode;
  if (mode === 'sync_fields') {
    const from = String(operation.from || '').trim();
    const to = String(operation.to || '').trim();
    return `${index + 1}. ${modeLabel} · ${from || to || '-'}`;
  }
  const path = String(operation.path || '').trim();
  const from = String(operation.from || '').trim();
  const to = String(operation.to || '').trim();
  return `${index + 1}. ${modeLabel} · ${path || from || to || '-'}`;
};

export const getOperationModeTagColor = (mode = 'set') => {
  if (mode.includes('header')) return 'cyan';
  if (mode.includes('replace') || mode.includes('trim')) return 'violet';
  if (mode.includes('copy') || mode.includes('move')) return 'blue';
  if (mode.includes('error') || mode.includes('prune')) return 'red';
  if (mode.includes('sync')) return 'green';
  return 'grey';
};

export const getModeDescription = (mode) => MODE_DESCRIPTIONS[mode] || '';
