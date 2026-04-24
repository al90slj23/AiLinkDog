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
