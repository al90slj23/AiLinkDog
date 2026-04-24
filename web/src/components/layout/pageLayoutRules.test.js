import { describe, expect, test } from 'bun:test';
import { shouldShowGlobalHeader } from './pageLayoutRules';

describe('pageLayoutRules', () => {
  test('hides global header on homepage route', () => {
    expect(shouldShowGlobalHeader('/')).toBe(false);
  });

  test('keeps global header on console routes', () => {
    expect(shouldShowGlobalHeader('/console')).toBe(true);
  });
});
