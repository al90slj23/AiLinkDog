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
import { describe, expect, it } from 'vitest';
import {
  deriveAdvancedSettingsOpen,
  normalizeLoadedChannelData,
  parseIonetMetadata,
} from './editChannelModalLoadChannel';

describe('editChannelModalLoadChannel', () => {
  it('normalizes loaded channel payload', () => {
    const normalized = normalizeLoadedChannelData({
      models: 'gpt-4,gpt-4o',
      group: 'default,vip',
      model_mapping: '{"a":"b"}',
      type: 45,
      base_url: '',
      setting: '{"force_format":true}',
      settings:
        '{"vertex_key_type":"api_key","aws_key_type":"api_key","allow_service_tier":true}',
    });

    expect(normalized.models).toEqual(['gpt-4', 'gpt-4o']);
    expect(normalized.groups).toEqual(['default', 'vip']);
    expect(normalized.base_url).toBe('https://ark.cn-beijing.volces.com');
    expect(normalized.force_format).toBe(true);
    expect(normalized.vertex_key_type).toBe('api_key');
    expect(normalized.allow_service_tier).toBe(true);
  });

  it('parses ionet metadata and advanced flags', () => {
    expect(
      parseIonetMetadata('{"source":"ionet","deployment_id":"1"}'),
    ).toEqual({
      source: 'ionet',
      deployment_id: '1',
    });
    expect(parseIonetMetadata('{"source":"other"}')).toBeNull();
    expect(deriveAdvancedSettingsOpen({ model_mapping: '{"a":"b"}' })).toBe(
      true,
    );
    expect(deriveAdvancedSettingsOpen({ model_mapping: '' })).toBe(false);
  });
});
