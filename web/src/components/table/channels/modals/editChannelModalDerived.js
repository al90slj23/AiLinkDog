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
export function buildRedirectModelList(mapping) {
  if (typeof mapping !== 'string') return [];
  const trimmed = mapping.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return [];
    }
    return Array.from(
      new Set(
        Object.values(parsed)
          .map((value) =>
            typeof value === 'string' ? value.trim() : undefined,
          )
          .filter(Boolean),
      ),
    );
  } catch {
    return [];
  }
}

export function buildUpstreamDetectedModels(models) {
  return Array.from(
    new Set(
      (models || []).map((model) => String(model || '').trim()).filter(Boolean),
    ),
  );
}

export function buildParamOverrideMeta(
  paramOverride,
  t,
  verifyJSON = defaultVerifyJSON,
) {
  const raw = typeof paramOverride === 'string' ? paramOverride.trim() : '';
  if (!raw) {
    return {
      tagLabel: t('不更改'),
      tagColor: 'grey',
      preview: t('此项可选，用于覆盖请求参数。不支持覆盖 stream 参数'),
    };
  }
  if (!verifyJSON(raw)) {
    return {
      tagLabel: t('JSON格式错误'),
      tagColor: 'red',
      preview: raw,
    };
  }
  try {
    const parsed = JSON.parse(raw);
    const pretty = JSON.stringify(parsed, null, 2);
    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      Array.isArray(parsed.operations)
    ) {
      return {
        tagLabel: `${t('新格式模板')} (${parsed.operations.length})`,
        tagColor: 'cyan',
        preview: pretty,
      };
    }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        tagLabel: `${t('旧格式模板')} (${Object.keys(parsed).length})`,
        tagColor: 'blue',
        preview: pretty,
      };
    }
    return {
      tagLabel: t('自定义 JSON'),
      tagColor: 'orange',
      preview: pretty,
    };
  } catch {
    return {
      tagLabel: t('JSON格式错误'),
      tagColor: 'red',
      preview: raw,
    };
  }
}

export function formatUnixTimeValue(timestamp, t) {
  const value = Number(timestamp || 0);
  if (!value) {
    return t('暂无');
  }
  return new Date(value * 1000).toLocaleString();
}

function defaultVerifyJSON(raw) {
  try {
    JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}
