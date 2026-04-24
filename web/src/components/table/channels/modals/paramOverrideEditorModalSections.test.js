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

import { existsSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';

describe('paramOverrideEditorModal sections', () => {
  test('exposes extracted editor section files', () => {
    expect(
      existsSync(
        new URL('./ParamOverrideEditorModalOperationHeaderSection.jsx', import.meta.url),
      ),
    ).toBe(true);
    expect(
      existsSync(
        new URL('./ParamOverrideEditorModalValueEditorSection.jsx', import.meta.url),
      ),
    ).toBe(true);
    expect(
      existsSync(
        new URL('./ParamOverrideEditorModalConditionsSection.jsx', import.meta.url),
      ),
    ).toBe(true);
    expect(
      existsSync(new URL('./useParamOverrideEditorModalState.js', import.meta.url)),
    ).toBe(true);
    expect(
      existsSync(new URL('./useParamOverrideEditorModalEffects.jsx', import.meta.url)),
    ).toBe(true);
    expect(
      existsSync(
        new URL('./ParamOverrideEditorModalReturnErrorSection.jsx', import.meta.url),
      ),
    ).toBe(true);
    expect(
      existsSync(
        new URL('./ParamOverrideEditorModalPruneObjectsSection.jsx', import.meta.url),
      ),
    ).toBe(true);
    expect(
      existsSync(
        new URL('./ParamOverrideEditorModalSyncFieldsSection.jsx', import.meta.url),
      ),
    ).toBe(true);
    expect(
      existsSync(
        new URL('./ParamOverrideEditorModalBasicValueSection.jsx', import.meta.url),
      ),
    ).toBe(true);
  });
});
