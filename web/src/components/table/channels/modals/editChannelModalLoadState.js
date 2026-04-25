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
export function buildLoadedChannelStateBundle({
  data,
  getChannelModels,
  deriveAdvancedSettingsOpen,
  parseIonetMetadata,
}) {
  const parsedIonet = parseIonetMetadata(data.other_info);

  return {
    initialBaseUrl: data.base_url || '',
    autoBan: data.auto_ban !== 0,
    isEnterpriseAccount: data.is_enterprise_account || false,
    basicModels: getChannelModels(data.type),
    channelSettings: {
      force_format: data.force_format,
      thinking_to_content: data.thinking_to_content,
      proxy: data.proxy,
      pass_through_body_enabled: data.pass_through_body_enabled,
      system_prompt: data.system_prompt,
      system_prompt_override: data.system_prompt_override || false,
    },
    initialModels: (data.models || [])
      .map((model) => (model || '').trim())
      .filter(Boolean),
    initialModelMapping: data.model_mapping || '',
    initialStatusCodeMapping: data.status_code_mapping || '',
    managedByIonet: !!parsedIonet,
    parsedIonet,
    shouldOpenAdvanced: deriveAdvancedSettingsOpen(data),
  };
}
