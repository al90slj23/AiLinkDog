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
export function buildUniqueModels(models) {
  return Array.from(new Set(models || []));
}

export function buildModelOptions(models) {
  return (models || []).map((model) => {
    const id = String(model.id || '').trim();
    return {
      key: id,
      label: id,
      value: id,
    };
  });
}

export function buildGroupOptions(groups) {
  return (groups || []).map((group) => ({
    label: group,
    value: group,
  }));
}
