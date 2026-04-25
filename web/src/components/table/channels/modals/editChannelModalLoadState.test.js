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
import { describe, expect, test } from 'bun:test';
import { buildLoadedChannelStateBundle } from './editChannelModalLoadState';

describe('editChannelModalLoadState', () => {
  test('builds state bundle from normalized channel data', () => {
    const bundle = buildLoadedChannelStateBundle({
      data: {
        base_url: 'https://api.example.com',
        auto_ban: 0,
        is_enterprise_account: true,
        type: 1,
        force_format: true,
        thinking_to_content: false,
        proxy: 'http://proxy',
        pass_through_body_enabled: true,
        system_prompt: 'hello',
        system_prompt_override: true,
        models: ['gpt-4o'],
        model_mapping: '{"a":"b"}',
        status_code_mapping: '{"400":"500"}',
        other_info: '{"source":"ionet","deployment_id":"1"}',
      },
      getChannelModels: () => ['gpt-4o'],
      deriveAdvancedSettingsOpen: () => true,
      parseIonetMetadata: () => ({ source: 'ionet', deployment_id: '1' }),
    });

    expect(bundle.initialBaseUrl).toBe('https://api.example.com');
    expect(bundle.autoBan).toBe(false);
    expect(bundle.isEnterpriseAccount).toBe(true);
    expect(bundle.basicModels).toEqual(['gpt-4o']);
    expect(bundle.channelSettings.force_format).toBe(true);
    expect(bundle.initialModels).toEqual(['gpt-4o']);
    expect(bundle.parsedIonet).toEqual({ source: 'ionet', deployment_id: '1' });
    expect(bundle.shouldOpenAdvanced).toBe(true);
  });
});
