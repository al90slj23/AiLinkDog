export function normalizeFetchedModels(models) {
  return Array.from(
    new Set((models || []).map((model) => String(model ?? '').trim()).filter(Boolean)),
  );
}

export function prepareModelMappingModalState({ pairKey, value, models }) {
  const mappingKey = String(pairKey ?? '').trim();
  const normalizedModels = normalizeFetchedModels(models);
  const currentValue = String(value ?? '').trim();

  return {
    mappingKey,
    models: normalizedModels,
    selected: normalizedModels.includes(currentValue) ? currentValue : '',
  };
}
