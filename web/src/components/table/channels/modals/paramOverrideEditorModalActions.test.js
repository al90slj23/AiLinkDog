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

import { describe, expect, it } from 'vitest';
import {
  buildAddConditionResult,
  buildAddOperationResult,
  buildConditionUpdateResult,
  buildOperationPatchResult,
  buildRemoveConditionResult,
  buildRemoveOperationResult,
} from './paramOverrideEditorModalActions';
import {
  createDefaultCondition,
  createDefaultOperation,
} from './paramOverrideEditorModalData';

describe('paramOverrideEditorModalActions', () => {
  it('updates a single operation by id', () => {
    const first = createDefaultOperation();
    const second = createDefaultOperation();
    const result = buildOperationPatchResult({
      operations: [first, second],
      operationId: second.id,
      patch: { path: 'temperature' },
    });

    expect(result[0].path).toBe('');
    expect(result[1].path).toBe('temperature');
  });

  it('adds and removes operations with fallback', () => {
    const first = createDefaultOperation();
    const added = buildAddOperationResult({
      operations: [first],
      createDefaultOperation,
    });

    expect(added.operations).toHaveLength(2);
    expect(added.selectedOperationId).toBe(added.operations[1].id);

    const removed = buildRemoveOperationResult({
      operations: [first],
      operationId: first.id,
      createDefaultOperation,
    });

    expect(removed.operations).toHaveLength(1);
    expect(removed.operations[0].id).not.toBe(first.id);
  });

  it('adds updates and removes conditions', () => {
    const operation = createDefaultOperation();
    const added = buildAddConditionResult({
      operations: [operation],
      operationId: operation.id,
      createDefaultCondition,
      expandedConditionMap: {},
    });

    const addedCondition = added.operations[0].conditions[0];
    expect(added.operations[0].conditions).toHaveLength(1);
    expect(added.expandedConditionMap[operation.id]).toEqual([
      addedCondition.id,
    ]);

    const updated = buildConditionUpdateResult({
      operations: added.operations,
      operationId: operation.id,
      conditionId: addedCondition.id,
      patch: { path: 'model' },
    });
    expect(updated[0].conditions[0].path).toBe('model');

    const removed = buildRemoveConditionResult({
      operations: updated,
      operationId: operation.id,
      conditionId: addedCondition.id,
      expandedConditionMap: added.expandedConditionMap,
    });
    expect(removed.operations[0].conditions).toHaveLength(0);
    expect(removed.expandedConditionMap[operation.id]).toEqual([]);
  });
});
