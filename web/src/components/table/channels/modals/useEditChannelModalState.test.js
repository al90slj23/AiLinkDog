import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';

describe('useEditChannelModalState file', () => {
  it('exists for modal state extraction', () => {
    expect(
      existsSync(new URL('./useEditChannelModalState.js', import.meta.url)),
    ).toBe(true);
  });
});
