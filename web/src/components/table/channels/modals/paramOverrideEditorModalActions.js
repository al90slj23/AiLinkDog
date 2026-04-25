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

export const buildOperationPatchResult = ({ operations, operationId, patch }) =>
  (operations || []).map((item) =>
    item.id === operationId ? { ...item, ...(patch || {}) } : item,
  );

export const buildAddOperationResult = ({
  operations,
  createDefaultOperation,
}) => {
  const created = createDefaultOperation();
  return {
    operations: [...(operations || []), created],
    selectedOperationId: created.id,
  };
};

export const buildRemoveOperationResult = ({
  operations,
  operationId,
  createDefaultOperation,
}) => {
  const sourceOperations = operations || [];
  if (sourceOperations.length <= 1) {
    return { operations: [createDefaultOperation()] };
  }
  return {
    operations: sourceOperations.filter((item) => item.id !== operationId),
  };
};

export const buildAddConditionResult = ({
  operations,
  operationId,
  createDefaultCondition,
  expandedConditionMap,
}) => {
  const createdCondition = createDefaultCondition();
  return {
    operations: (operations || []).map((operation) =>
      operation.id === operationId
        ? {
            ...operation,
            conditions: [...(operation.conditions || []), createdCondition],
          }
        : operation,
    ),
    expandedConditionMap: {
      ...(expandedConditionMap || {}),
      [operationId]: [
        ...((expandedConditionMap || {})[operationId] || []),
        createdCondition.id,
      ],
    },
  };
};

export const buildConditionUpdateResult = ({
  operations,
  operationId,
  conditionId,
  patch,
}) =>
  (operations || []).map((operation) => {
    if (operation.id !== operationId) return operation;
    return {
      ...operation,
      conditions: (operation.conditions || []).map((condition) =>
        condition.id === conditionId
          ? { ...condition, ...(patch || {}) }
          : condition,
      ),
    };
  });

export const buildRemoveConditionResult = ({
  operations,
  operationId,
  conditionId,
  expandedConditionMap,
}) => ({
  operations: (operations || []).map((operation) => {
    if (operation.id !== operationId) return operation;
    return {
      ...operation,
      conditions: (operation.conditions || []).filter(
        (condition) => condition.id !== conditionId,
      ),
    };
  }),
  expandedConditionMap: {
    ...(expandedConditionMap || {}),
    [operationId]: ((expandedConditionMap || {})[operationId] || []).filter(
      (id) => id !== conditionId,
    ),
  },
});
