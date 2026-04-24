const DEFAULT_CHANNEL_SETTING_FIELDS = {
  force_format: false,
  thinking_to_content: false,
  proxy: '',
  pass_through_body_enabled: false,
  system_prompt: '',
  system_prompt_override: false,
};

const DEFAULT_EXTRA_SETTING_FIELDS = {
  azure_responses_version: '',
  vertex_key_type: 'json',
  aws_key_type: 'ak_sk',
  is_enterprise_account: false,
  allow_service_tier: false,
  disable_store: false,
  allow_safety_identifier: false,
  allow_include_obfuscation: false,
  allow_inference_geo: false,
  allow_speed: false,
  claude_beta_query: false,
  upstream_model_update_check_enabled: false,
  upstream_model_update_auto_sync_enabled: false,
  upstream_model_update_last_check_time: 0,
  upstream_model_update_last_detected_models: [],
  upstream_model_update_ignored_models: '',
};

export function normalizeLoadedChannelData(rawData) {
  const data = { ...rawData };

  if (data.models === '') {
    data.models = [];
  } else {
    data.models = String(data.models || '')
      .split(',')
      .filter(Boolean);
  }

  if (data.group === '') {
    data.groups = [];
  } else {
    data.groups = String(data.group || '')
      .split(',')
      .filter(Boolean);
  }

  if (data.model_mapping !== '') {
    data.model_mapping = JSON.stringify(JSON.parse(data.model_mapping), null, 2);
  }

  Object.assign(data, parseChannelSettingFields(data.setting));
  Object.assign(data, parseExtraSettingFields(data.settings));

  if (
    data.type === 45 &&
    (!data.base_url ||
      (typeof data.base_url === 'string' && data.base_url.trim() === ''))
  ) {
    data.base_url = 'https://ark.cn-beijing.volces.com';
  }

  return data;
}

export function parseIonetMetadata(otherInfo) {
  if (!otherInfo) return null;
  try {
    const maybeMeta = JSON.parse(otherInfo);
    if (
      maybeMeta &&
      typeof maybeMeta === 'object' &&
      maybeMeta.source === 'ionet'
    ) {
      return maybeMeta;
    }
  } catch {
    return null;
  }
  return null;
}

export function deriveAdvancedSettingsOpen(data) {
  return !!(
    (data.model_mapping && data.model_mapping.trim()) ||
    (data.param_override && data.param_override.trim()) ||
    (data.status_code_mapping && data.status_code_mapping.trim()) ||
    (data.header_override && data.header_override.trim()) ||
    (data.tag && data.tag.trim()) ||
    (data.remark && data.remark.trim()) ||
    (data.priority && data.priority !== 0) ||
    (data.weight && data.weight !== 0) ||
    (data.proxy && data.proxy.trim()) ||
    (data.system_prompt && data.system_prompt.trim()) ||
    data.thinking_to_content ||
    data.pass_through_body_enabled ||
    data.force_format ||
    data.claude_beta_query ||
    data.system_prompt_override
  );
}

function parseChannelSettingFields(setting) {
  if (!setting) {
    return { ...DEFAULT_CHANNEL_SETTING_FIELDS };
  }
  try {
    const parsed = JSON.parse(setting);
    return {
      force_format: parsed.force_format || false,
      thinking_to_content: parsed.thinking_to_content || false,
      proxy: parsed.proxy || '',
      pass_through_body_enabled: parsed.pass_through_body_enabled || false,
      system_prompt: parsed.system_prompt || '',
      system_prompt_override: parsed.system_prompt_override || false,
    };
  } catch {
    return { ...DEFAULT_CHANNEL_SETTING_FIELDS };
  }
}

function parseExtraSettingFields(settings) {
  if (!settings) {
    return { ...DEFAULT_EXTRA_SETTING_FIELDS };
  }
  try {
    const parsed = JSON.parse(settings);
    return {
      azure_responses_version: parsed.azure_responses_version || '',
      vertex_key_type: parsed.vertex_key_type || 'json',
      aws_key_type: parsed.aws_key_type || 'ak_sk',
      is_enterprise_account: parsed.openrouter_enterprise === true,
      allow_service_tier: parsed.allow_service_tier || false,
      disable_store: parsed.disable_store || false,
      allow_safety_identifier: parsed.allow_safety_identifier || false,
      allow_include_obfuscation: parsed.allow_include_obfuscation || false,
      allow_inference_geo: parsed.allow_inference_geo || false,
      allow_speed: parsed.allow_speed || false,
      claude_beta_query: parsed.claude_beta_query || false,
      upstream_model_update_check_enabled:
        parsed.upstream_model_update_check_enabled === true,
      upstream_model_update_auto_sync_enabled:
        parsed.upstream_model_update_auto_sync_enabled === true,
      upstream_model_update_last_check_time:
        Number(parsed.upstream_model_update_last_check_time) || 0,
      upstream_model_update_last_detected_models: Array.isArray(
        parsed.upstream_model_update_last_detected_models,
      )
        ? parsed.upstream_model_update_last_detected_models
        : [],
      upstream_model_update_ignored_models: Array.isArray(
        parsed.upstream_model_update_ignored_models,
      )
        ? parsed.upstream_model_update_ignored_models.join(',')
        : '',
    };
  } catch {
    return { ...DEFAULT_EXTRA_SETTING_FIELDS };
  }
}
