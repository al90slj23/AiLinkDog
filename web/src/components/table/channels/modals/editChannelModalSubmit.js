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
export function buildSubmitPayload({
  localInputs,
  batch,
  multiToSingle,
  multiKeyMode,
  isEdit,
  isMultiKeyChannel,
  keyMode,
  channelId,
}) {
  const nextInputs = { ...localInputs };

  const channelExtraSettings = {
    force_format: nextInputs.force_format || false,
    thinking_to_content: nextInputs.thinking_to_content || false,
    proxy: nextInputs.proxy || '',
    pass_through_body_enabled: nextInputs.pass_through_body_enabled || false,
    system_prompt: nextInputs.system_prompt || '',
    system_prompt_override: nextInputs.system_prompt_override || false,
  };
  nextInputs.setting = JSON.stringify(channelExtraSettings);

  let settings = {};
  if (nextInputs.settings) {
    try {
      settings = JSON.parse(nextInputs.settings);
    } catch {
      settings = {};
    }
  }

  if (nextInputs.type === 20) {
    settings.openrouter_enterprise = nextInputs.is_enterprise_account === true;
  }

  if (nextInputs.type === 33) {
    settings.aws_key_type = nextInputs.aws_key_type || 'ak_sk';
  }

  if (nextInputs.type === 41) {
    settings.vertex_key_type = nextInputs.vertex_key_type || 'json';
  } else if ('vertex_key_type' in settings) {
    delete settings.vertex_key_type;
  }

  if (nextInputs.type === 1 || nextInputs.type === 14) {
    settings.allow_service_tier = nextInputs.allow_service_tier === true;
    if (nextInputs.type === 1) {
      settings.disable_store = nextInputs.disable_store === true;
      settings.allow_safety_identifier =
        nextInputs.allow_safety_identifier === true;
      settings.allow_include_obfuscation =
        nextInputs.allow_include_obfuscation === true;
    }
    if (nextInputs.type === 14) {
      settings.allow_inference_geo = nextInputs.allow_inference_geo === true;
      settings.allow_speed = nextInputs.allow_speed === true;
      settings.claude_beta_query = nextInputs.claude_beta_query === true;
    }
  }

  settings.upstream_model_update_check_enabled =
    nextInputs.upstream_model_update_check_enabled === true;
  settings.upstream_model_update_auto_sync_enabled =
    settings.upstream_model_update_check_enabled &&
    nextInputs.upstream_model_update_auto_sync_enabled === true;
  settings.upstream_model_update_ignored_models = Array.from(
    new Set(
      String(nextInputs.upstream_model_update_ignored_models || '')
        .split(',')
        .map((model) => model.trim())
        .filter(Boolean),
    ),
  );
  if (
    !Array.isArray(settings.upstream_model_update_last_detected_models) ||
    !settings.upstream_model_update_check_enabled
  ) {
    settings.upstream_model_update_last_detected_models = [];
  }
  if (typeof settings.upstream_model_update_last_check_time !== 'number') {
    settings.upstream_model_update_last_check_time = 0;
  }

  nextInputs.settings = JSON.stringify(settings);

  delete nextInputs.force_format;
  delete nextInputs.thinking_to_content;
  delete nextInputs.proxy;
  delete nextInputs.pass_through_body_enabled;
  delete nextInputs.system_prompt;
  delete nextInputs.system_prompt_override;
  delete nextInputs.is_enterprise_account;
  delete nextInputs.vertex_key_type;
  delete nextInputs.aws_key_type;
  delete nextInputs.allow_service_tier;
  delete nextInputs.disable_store;
  delete nextInputs.allow_safety_identifier;
  delete nextInputs.allow_include_obfuscation;
  delete nextInputs.allow_inference_geo;
  delete nextInputs.allow_speed;
  delete nextInputs.claude_beta_query;
  delete nextInputs.upstream_model_update_check_enabled;
  delete nextInputs.upstream_model_update_auto_sync_enabled;
  delete nextInputs.upstream_model_update_last_check_time;
  delete nextInputs.upstream_model_update_last_detected_models;
  delete nextInputs.upstream_model_update_ignored_models;

  nextInputs.auto_ban = nextInputs.auto_ban ? 1 : 0;
  nextInputs.models = (nextInputs.models || []).join(',');
  nextInputs.group = (nextInputs.groups || []).join(',');

  const mode = batch ? (multiToSingle ? 'multi_to_single' : 'batch') : 'single';

  if (isEdit) {
    return {
      ...nextInputs,
      id: parseInt(channelId),
      key_mode: isMultiKeyChannel ? keyMode : undefined,
    };
  }

  return {
    mode,
    multi_key_mode: mode === 'multi_to_single' ? multiKeyMode : undefined,
    channel: nextInputs,
  };
}
