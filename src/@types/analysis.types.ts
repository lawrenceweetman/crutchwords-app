/**
 * Type definitions for speech analysis and lexicon functionality
 */

export interface LexiconEntry {
  category: string; // 'FILLED_PAUSE' | 'DISCOURSE_MARKER' | 'PLACATING_TAG'
  term: string;
  language: string; // e.g., 'en', 'es', 'fr'
  bcp47Tags: string[]; // e.g., ['en-US', 'en-GB', 'en'], ['fr', 'fr-FR']
  notes: string;
}

export interface TranscriptSegment {
  text: string;
  isFiller: boolean;
  category: string | null;
}

export interface CategoryCounts {
  [key: string]: number;
}

export interface AnalysisResult {
  totalWordCount: number;
  totalFillerCount: number;
  fillerDensityPercent: number;
  fillersPerMinute: number;
  categoryCounts: CategoryCounts;
}
