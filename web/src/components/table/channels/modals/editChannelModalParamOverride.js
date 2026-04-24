export function buildCopiedParamOverrideContent(raw) {
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  if (!trimmed) return '';

  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return trimmed;
  }
}

export function parseParamOverrideInputValue(raw, verifyJSON, t) {
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  if (!trimmed) return null;
  if (!verifyJSON(trimmed)) {
    throw new Error(t('当前参数覆盖不是合法的 JSON'));
  }
  return JSON.parse(trimmed);
}

export function buildParamOverrideTemplateValue({
  templateType = 'operations',
  applyMode = 'fill',
  parsedCurrent,
  legacyTemplate,
  operationsTemplate,
}) {
  if (templateType === 'legacy') {
    if (applyMode === 'fill') {
      return JSON.stringify(legacyTemplate, null, 2);
    }
    const currentLegacy =
      parsedCurrent &&
      typeof parsedCurrent === 'object' &&
      !Array.isArray(parsedCurrent) &&
      !Array.isArray(parsedCurrent.operations)
        ? parsedCurrent
        : {};
    return JSON.stringify(
      {
        ...legacyTemplate,
        ...currentLegacy,
      },
      null,
      2,
    );
  }

  if (applyMode === 'fill') {
    return JSON.stringify(operationsTemplate, null, 2);
  }
  const currentOperations =
    parsedCurrent &&
    typeof parsedCurrent === 'object' &&
    !Array.isArray(parsedCurrent) &&
    Array.isArray(parsedCurrent.operations)
      ? parsedCurrent.operations
      : [];

  return JSON.stringify(
    {
      operations: [...currentOperations, ...operationsTemplate.operations],
    },
    null,
    2,
  );
}
