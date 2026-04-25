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
