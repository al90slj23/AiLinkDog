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

import { describe, expect, test } from 'bun:test';
import {
  CONDITION_MODE_OPTIONS,
  HEADER_VALUE_JSONC_EXAMPLE,
  MODE_DESCRIPTIONS,
  OPERATION_MODE_OPTIONS,
} from './paramOverrideEditorModalConstants';
import {
  getModeFromLabel,
  getModePathPlaceholder,
  getModeToPlaceholder,
  getOperationModeTagColor,
  getOperationSummary,
} from './paramOverrideEditorModalDerived';
import {
  buildConditionPayload,
  buildPruneObjectsValueText,
  buildReturnErrorValueText,
  createDefaultOperation,
  normalizeOperation,
  parseInitialState,
  parsePassHeaderNames,
  parsePruneObjectsDraft,
  parseReturnErrorDraft,
  parseSyncTargetSpec,
} from './paramOverrideEditorModalData';
import { validateOperations } from './paramOverrideEditorModalValidation';

describe('paramOverrideEditorModal constants', () => {
  test('exposes stable option sets and examples', () => {
    expect(OPERATION_MODE_OPTIONS.some((item) => item.value === 'set_header')).toBe(true);
    expect(CONDITION_MODE_OPTIONS.some((item) => item.value === 'prefix')).toBe(true);
    expect(MODE_DESCRIPTIONS.pass_headers).toContain('透传');
    expect(HEADER_VALUE_JSONC_EXAMPLE).toContain('$append');
  });
});

describe('paramOverrideEditorModal derived helpers', () => {
  test('returns mode-specific labels and summaries', () => {
    expect(getModePathPlaceholder('set_header')).toBe('Authorization');
    expect(getModeFromLabel('copy_header')).toBe('来源请求头');
    expect(getModeToPlaceholder('regex_replace')).toBe('openai/gpt-');
    expect(getOperationModeTagColor('move_header')).toBe('cyan');
    expect(
      getOperationSummary({ mode: 'sync_fields', from: 'json:model', to: 'json:alias' }, 1),
    ).toContain('json:model');
  });
});

describe('paramOverrideEditorModal data helpers', () => {
  test('creates default operation and parses initial operations state', () => {
    const operation = createDefaultOperation();
    expect(operation.mode).toBe('set');
    expect(typeof operation.id).toBe('string');

    const parsed = parseInitialState('{"operations":[{"mode":"delete","path":"temperature"}]}');
    expect(parsed.editMode).toBe('visual');
    expect(parsed.visualMode).toBe('operations');
    expect(parsed.operations).toHaveLength(1);
    expect(parsed.operations[0].mode).toBe('delete');
    expect(parsed.operations[0].path).toBe('temperature');
  });

  test('parses and serializes structured drafts', () => {
    expect(parsePassHeaderNames('Authorization, X-Request-Id')).toEqual([
      'Authorization',
      'X-Request-Id',
    ]);
    expect(parseSyncTargetSpec('header:session_id')).toEqual({
      type: 'header',
      key: 'session_id',
    });

    const returnDraft = parseReturnErrorDraft('{"message":"blocked","status_code":403}');
    expect(returnDraft.message).toBe('blocked');
    expect(returnDraft.statusCode).toBe(403);
    expect(buildReturnErrorValueText({ ...returnDraft, code: 'forbidden', simpleMode: false })).toBe(
      '{"message":"blocked","status_code":403,"code":"forbidden"}',
    );

    const pruneDraft = parsePruneObjectsDraft(
      '{"type":"redacted_thinking","logic":"OR","conditions":[{"path":"type","mode":"full","value":"redacted_thinking"}]}',
    );
    expect(pruneDraft.simpleMode).toBe(false);
    expect(pruneDraft.logic).toBe('OR');
    expect(pruneDraft.rules).toHaveLength(1);
    expect(buildPruneObjectsValueText(pruneDraft)).toContain('redacted_thinking');
  });

  test('normalizes operations and builds condition payloads', () => {
    const normalized = normalizeOperation({
      mode: 'copy_header',
      description: 'copy auth',
      conditions: [{ path: 'model', value: 'claude' }],
    });

    expect(normalized.mode).toBe('copy_header');
    expect(normalized.conditions).toHaveLength(1);
    expect(buildConditionPayload(normalized.conditions[0])).toEqual({
      path: 'model',
      mode: 'full',
      value: 'claude',
    });
  });
});

describe('paramOverrideEditorModal validation', () => {
  test('validates required operation fields', () => {
    const t = (key, params) => key.replace('{{line}}', String(params?.line ?? ''));
    expect(
      validateOperations([
        {
          mode: 'set',
          path: '',
          from: '',
          to: '',
          value_text: '1',
          keep_origin: false,
          conditions: [],
        },
      ], t),
    ).toBe('第 1 条操作缺少目标路径');

    expect(
      validateOperations([
        {
          mode: 'pass_headers',
          path: '',
          from: '',
          to: '',
          value_text: 'Authorization',
          keep_origin: true,
          conditions: [],
        },
      ], t),
    ).toBe('');
  });
});
