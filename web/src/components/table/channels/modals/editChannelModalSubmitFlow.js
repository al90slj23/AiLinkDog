import { collectMissingMappedModels } from './editChannelModalSubmitValidation';

export function buildSubmitInteractionState({
  parsedModelMapping,
  normalizedModels,
  modelMappingStr,
  hasModelConfigChanged,
  collectInvalidStatusCodeEntries,
  collectNewDisallowedStatusCodeRedirects,
  initialStatusCodeMapping,
  statusCodeMapping,
}) {
  const missingModels = parsedModelMapping
    ? collectMissingMappedModels({ parsedModelMapping, normalizedModels })
    : [];

  const shouldPromptMissing =
    missingModels.length > 0 &&
    hasModelConfigChanged(normalizedModels, modelMappingStr);

  const invalidStatusCodeEntries =
    collectInvalidStatusCodeEntries(statusCodeMapping);

  const riskyStatusCodeRedirects = collectNewDisallowedStatusCodeRedirects(
    initialStatusCodeMapping,
    statusCodeMapping,
  );

  return {
    missingModels,
    shouldPromptMissing,
    invalidStatusCodeEntries,
    riskyStatusCodeRedirects,
  };
}
