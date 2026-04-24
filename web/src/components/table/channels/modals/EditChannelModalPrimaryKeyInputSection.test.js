import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';

describe('EditChannelModalPrimaryKeyInputSection file', () => {
  it('exists for primary key section extraction', () => {
    expect(
      existsSync(
        new URL('./EditChannelModalPrimaryKeyInputSection.jsx', import.meta.url),
      ),
    ).toBe(true);
  });
});
