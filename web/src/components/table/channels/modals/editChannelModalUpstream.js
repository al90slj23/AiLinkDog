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
export function normalizeFetchedModels(models) {
  return Array.from(
    new Set(
      (models || []).map((model) => String(model ?? '').trim()).filter(Boolean),
    ),
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
