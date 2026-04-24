import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';

describe('useEditChannelModalEffects file', () => {
  it('exists for modal effects extraction', () => {
    expect(
      existsSync(new URL('./useEditChannelModalEffects.jsx', import.meta.url)),
    ).toBe(true);
  });
});
