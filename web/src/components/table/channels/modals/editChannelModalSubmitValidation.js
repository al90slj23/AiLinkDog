export function parseModelMappingOrThrow(modelMapping, verifyJSON) {
  const hasModelMapping =
    typeof modelMapping === 'string' && modelMapping.trim() !== '';
  if (!hasModelMapping) {
    return null;
  }
  if (!verifyJSON(modelMapping)) {
    throw new Error('invalid_model_mapping');
  }
  try {
    return JSON.parse(modelMapping);
  } catch {
    throw new Error('invalid_model_mapping');
  }
}

export function normalizeSubmitInputs({ localInputs }) {
  const nextInputs = { ...localInputs };

  nextInputs.models = (nextInputs.models || [])
    .map((model) => (model || '').trim())
    .filter(Boolean);

  if (nextInputs.base_url && nextInputs.base_url.endsWith('/')) {
    nextInputs.base_url = nextInputs.base_url.slice(
      0,
      nextInputs.base_url.length - 1,
    );
  }

  if (nextInputs.type === 18 && nextInputs.other === '') {
    nextInputs.other = 'v2.1';
  }

  return nextInputs;
}

export function collectMissingMappedModels({
  parsedModelMapping,
  normalizedModels,
}) {
  if (
    !parsedModelMapping ||
    typeof parsedModelMapping !== 'object' ||
    Array.isArray(parsedModelMapping)
  ) {
    return [];
  }
  const modelSet = new Set(normalizedModels);
  return Object.keys(parsedModelMapping)
    .map((key) => (key || '').trim())
    .filter((key) => key && !modelSet.has(key));
}
