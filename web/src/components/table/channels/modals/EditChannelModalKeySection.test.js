import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';

describe('EditChannelModalKeySection file', () => {
  it('exists for key section extraction', () => {
    expect(
      existsSync(new URL('./EditChannelModalKeySection.jsx', import.meta.url)),
    ).toBe(true);
  });
});
