import { describe, expect, it } from 'vitest';
import { buildSubmitInteractionState } from './editChannelModalSubmitFlow';

describe('editChannelModalSubmitFlow', () => {
  it('builds interaction state', () => {
    const state = buildSubmitInteractionState({
      parsedModelMapping: { 'gpt-4': 'alias' },
      normalizedModels: ['gpt-4o'],
      modelMappingStr: '{"gpt-4":"alias"}',
      hasModelConfigChanged: () => true,
      collectInvalidStatusCodeEntries: () => ['abc'],
      collectNewDisallowedStatusCodeRedirects: () => ['400->500'],
      initialStatusCodeMapping: '',
      statusCodeMapping: '{"400":"500"}',
    });

    expect(state.missingModels).toEqual(['gpt-4']);
    expect(state.shouldPromptMissing).toBe(true);
    expect(state.invalidStatusCodeEntries).toEqual(['abc']);
    expect(state.riskyStatusCodeRedirects).toEqual(['400->500']);
  });
});
