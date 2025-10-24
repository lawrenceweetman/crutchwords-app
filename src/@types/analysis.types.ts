/**
 * Type definitions for speech analysis and lexicon functionality
 */

export interface LexiconEntry {
  category: 'FILLED_PAUSE' | 'DISCOURSE_MARKER' | 'PLACATING_TAG';
  term: string;
  language: string; // e.g., 'en', 'es', 'fr'
  region: string; // e.g., 'Global', 'UK', 'US'
  notes: string;
}

export interface TranscriptSegment {
  text: string;
  isFiller: boolean;
  category: string | null;
}

export interface CategoryCounts {
  FILLED_PAUSE: number;
  DISCOURSE_MARKER: number;
  PLACATING_TAG: number;
}

export interface AnalysisResult {
  totalWordCount: number;
  totalFillerCount: number;
  fillerDensityPercent: number;
  fillersPerMinute: number;
  categoryCounts: CategoryCounts;
}

// Re-export types for easy importing
export type { LexiconEntry, TranscriptSegment, CategoryCounts, AnalysisResult };
