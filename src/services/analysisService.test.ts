import { describe, it, expect, vi } from 'vitest';

import type { LexiconEntry } from '@/@types/analysis.types';

import { getHighlightedTranscript, getSessionAnalysis } from './analysisService';

// Mock the lexicon data since we're testing the service logic
vi.mock('@/utils/lexicon.json', () => ({
  default: [
    {
      category: 'FILLED_PAUSE',
      term: 'um',
      language: 'en',
      bcp47Tags: ['en-US'],
      notes: 'A common nasal-final filled pause in American English.',
    },
    {
      category: 'FILLED_PAUSE',
      term: 'er',
      language: 'en',
      bcp47Tags: ['en-GB', 'en-AU', 'en-NZ'],
      notes: 'The primary non-nasal filled pause in British, Australian, and New Zealand English.',
    },
    {
      category: 'DISCOURSE_MARKER',
      term: 'like',
      language: 'en',
      bcp47Tags: ['en-US', 'en-GB'],
      notes: 'Common discourse marker used in informal speech.',
    },
    {
      category: 'FILLED_PAUSE',
      term: 'euh',
      language: 'fr',
      bcp47Tags: ['fr', 'fr-FR', 'fr-CA'],
      notes: 'French hesitation marker.',
    },
  ] as LexiconEntry[],
}));

// Mock the logger to avoid console output during tests
vi.mock('@/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('analysisService', () => {
  describe('getHighlightedTranscript', () => {
    it('correctly identifies filler words for US English', () => {
      const transcript = 'Hello um, this is like a test';
      const result = getHighlightedTranscript(transcript, 'en-US');

      expect(result).toHaveLength(5);
      expect(result[0]).toEqual({ text: 'Hello ', isFiller: false, category: null });
      expect(result[1]).toEqual({ text: 'um', isFiller: true, category: 'FILLED_PAUSE' });
      expect(result[2]).toEqual({ text: ', this is ', isFiller: false, category: null });
      expect(result[3]).toEqual({ text: 'like', isFiller: true, category: 'DISCOURSE_MARKER' });
      expect(result[4]).toEqual({ text: ' a test', isFiller: false, category: null });
    });

    it('correctly identifies filler words for British English', () => {
      const transcript = 'Hello er, this is a test';
      const result = getHighlightedTranscript(transcript, 'en-GB');

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ text: 'Hello ', isFiller: false, category: null });
      expect(result[1]).toEqual({ text: 'er', isFiller: true, category: 'FILLED_PAUSE' });
      expect(result[2]).toEqual({ text: ', this is a test', isFiller: false, category: null });
    });

    it('works with French language', () => {
      const transcript = 'Bonjour euh, comment allez-vous';
      const result = getSessionAnalysis(transcript, 1, 'fr');

      expect(result.totalFillerCount).toBe(1);
      expect(result.categoryCounts.FILLED_PAUSE).toBe(1);
    });

    it('returns empty segments for empty transcript', () => {
      const result = getHighlightedTranscript('', 'en');
      expect(result).toEqual([{ text: '', isFiller: false, category: null }]);
    });

    it('returns all non-filler text when no fillers match', () => {
      const transcript = 'This is a clean sentence without fillers';
      const result = getHighlightedTranscript(transcript, 'en');
      expect(result).toEqual([
        {
          text: 'This is a clean sentence without fillers',
          isFiller: false,
          category: null,
        },
      ]);
    });

    it('filters correctly with regional variants', () => {
      // Test that 'en-US' matches US English entries
      const usTranscript = 'um like test';
      const usResult = getHighlightedTranscript(usTranscript, 'en-US');
      expect(usResult.some((segment) => segment.isFiller)).toBe(true);

      // Test that 'en-GB' matches British English entries
      const gbTranscript = 'er test';
      const gbResult = getHighlightedTranscript(gbTranscript, 'en-GB');
      expect(gbResult.some((segment) => segment.isFiller)).toBe(true);

      // Test that 'fr' only matches French entries
      const frTranscript = 'euh test';
      const frResult = getHighlightedTranscript(frTranscript, 'fr');
      expect(frResult.some((segment) => segment.isFiller)).toBe(true);
    });
  });

  describe('getSessionAnalysis', () => {
    it('calculates correct metrics for US English', () => {
      const transcript = 'Hello um like this is a test with some fillers';
      const result = getSessionAnalysis(transcript, 1, 'en-US');

      expect(result.totalWordCount).toBe(10); // 'Hello', 'um', 'like', 'this', 'is', 'a', 'test', 'with', 'some', 'fillers'
      expect(result.totalFillerCount).toBe(2); // 'um', 'like'
      expect(result.fillerDensityPercent).toBeCloseTo(20, 1); // (2/10) * 100
      expect(result.fillersPerMinute).toBe(2); // 2 fillers / 1 minute
      expect(result.categoryCounts.FILLED_PAUSE).toBe(1);
      expect(result.categoryCounts.DISCOURSE_MARKER).toBe(1);
      expect(result.categoryCounts.PLACATING_TAG || 0).toBe(0);
    });

    it('handles empty transcript correctly', () => {
      const result = getSessionAnalysis('', 1, 'en-US');

      expect(result.totalWordCount).toBe(0);
      expect(result.totalFillerCount).toBe(0);
      expect(result.fillerDensityPercent).toBe(0);
      expect(result.fillersPerMinute).toBe(0);
      expect(result.categoryCounts.FILLED_PAUSE || 0).toBe(0);
      expect(result.categoryCounts.DISCOURSE_MARKER || 0).toBe(0);
      expect(result.categoryCounts.PLACATING_TAG || 0).toBe(0);
    });

    it('handles zero duration correctly', () => {
      const transcript = 'Hello um like test';
      const result = getSessionAnalysis(transcript, 0, 'en-US');

      expect(result.totalFillerCount).toBe(2);
      expect(result.fillersPerMinute).toBe(0); // Division by zero should return 0
    });

    it('filters by BCP 47 tags correctly', () => {
      const transcript = 'um like test';
      const result = getSessionAnalysis(transcript, 1, 'en-US');

      // Should match 'um' and 'like' for en-US
      expect(result.totalFillerCount).toBe(2);
      expect(result.categoryCounts.FILLED_PAUSE).toBe(1); // 'um'
      expect(result.categoryCounts.DISCOURSE_MARKER).toBe(1); // 'like'
    });
  });
});
