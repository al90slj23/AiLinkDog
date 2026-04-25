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
export async function prepareSubmitInputsBeforeValidation({
  localInputs,
  batch,
  isEdit,
  useManualInput,
  vertexKeys,
  vertexFileList,
  t,
  verifyJSON,
}) {
  const nextInputs = { ...localInputs };

  if (nextInputs.type === 57) {
    if (batch) {
      return { ok: false, reason: 'codex_batch_not_supported' };
    }

    const rawKey = (nextInputs.key || '').trim();
    if (!isEdit && rawKey === '') {
      return { ok: false, reason: 'missing_key' };
    }

    if (rawKey !== '') {
      if (!verifyJSON(rawKey)) {
        return { ok: false, reason: 'codex_invalid_json' };
      }
      try {
        const parsed = JSON.parse(rawKey);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          return { ok: false, reason: 'codex_not_object' };
        }
        const accessToken = String(parsed.access_token || '').trim();
        const accountId = String(parsed.account_id || '').trim();
        if (!accessToken) {
          return { ok: false, reason: 'codex_missing_access_token' };
        }
        if (!accountId) {
          return { ok: false, reason: 'codex_missing_account_id' };
        }
        nextInputs.key = JSON.stringify(parsed);
      } catch {
        return { ok: false, reason: 'codex_invalid_json' };
      }
    }
  }

  if (nextInputs.type === 41) {
    const keyType = nextInputs.vertex_key_type || 'json';
    if (keyType === 'api_key') {
      if (!isEdit && (!nextInputs.key || nextInputs.key.trim() === '')) {
        return { ok: false, reason: 'missing_key' };
      }
    } else {
      if (useManualInput) {
        if (nextInputs.key && nextInputs.key.trim() !== '') {
          try {
            const parsedKey = JSON.parse(nextInputs.key);
            nextInputs.key = JSON.stringify(parsedKey);
          } catch {
            return { ok: false, reason: 'vertex_invalid_manual_json' };
          }
        } else if (!isEdit) {
          return { ok: false, reason: 'missing_key' };
        }
      } else {
        let keys = vertexKeys;
        if (keys.length === 0 && vertexFileList.length > 0) {
          try {
            const parsed = await Promise.all(
              vertexFileList.map(async (item) => {
                const fileObj = item.fileInstance;
                if (!fileObj) return null;
                const txt = await fileObj.text();
                return JSON.parse(txt);
              }),
            );
            keys = parsed.filter(Boolean);
          } catch (err) {
            return {
              ok: false,
              reason: 'vertex_file_parse_failed',
              errorMessage: err.message,
            };
          }
        }
        if (keys.length === 0) {
          if (!isEdit) {
            return { ok: false, reason: 'missing_vertex_file' };
          }
          delete nextInputs.key;
        } else {
          nextInputs.key = batch
            ? JSON.stringify(keys)
            : JSON.stringify(keys[0]);
        }
      }
    }
  }

  if (isEdit && (!nextInputs.key || nextInputs.key.trim() === '')) {
    delete nextInputs.key;
  }
  delete nextInputs.vertex_files;

  return { ok: true, localInputs: nextInputs };
}
