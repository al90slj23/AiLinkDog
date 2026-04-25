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
export function buildDeduplicatedKeysResult(currentKey) {
  const keyLines = String(currentKey || '').split('\n');
  const beforeCount = keyLines.length;

  const keySet = new Set();
  const deduplicatedKeys = [];

  keyLines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !keySet.has(trimmedLine)) {
      keySet.add(trimmedLine);
      deduplicatedKeys.push(trimmedLine);
    }
  });

  return {
    beforeCount,
    afterCount: deduplicatedKeys.length,
    text: deduplicatedKeys.join('\n'),
  };
}

export function buildCustomModelMergeResult({
  customModel,
  currentModels,
  currentModelOptions,
}) {
  const modelArray = String(customModel || '')
    .split(',')
    .map((model) => model.trim());

  const models = [...(currentModels || [])];
  const modelOptions = [...(currentModelOptions || [])];
  const addedModels = [];

  modelArray.forEach((model) => {
    if (model && !models.includes(model)) {
      models.push(model);
      modelOptions.push({
        key: model,
        label: model,
        value: model,
      });
      addedModels.push(model);
    }
  });

  return {
    models,
    modelOptions,
    addedModels,
    nextCustomModel: '',
  };
}
