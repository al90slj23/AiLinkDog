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
