import {
  LexiconEntry,
  TranscriptSegment,
  AnalysisResult,
  CategoryCounts,
} from '@/@types/analysis.types';
import lexiconData from '@/utils/lexicon.json';
import { logger } from '@/utils/logger';

/**
 * Service for analyzing speech transcripts and identifying filler words
 * Now supports internationalization through language-aware filtering
 */

/**
 * Filters the master lexicon by language code using BCP 47 tags
 * @param language - Language code (e.g., 'en', 'en-US', 'fr')
 * @returns Array of lexicon entries that match the specified language via BCP 47 tags
 */
function getLexiconForLanguage(language: string): LexiconEntry[] {
  return lexiconData.filter((entry: unknown) => {
    const lexiconEntry = entry as Partial<LexiconEntry>;
    return (
      lexiconEntry.term && // Ensure term exists
      lexiconEntry.bcp47Tags &&
      lexiconEntry.bcp47Tags.some(
        (tag: string) => tag === language || tag.startsWith(language + '-')
      )
    );
  }) as LexiconEntry[];
}

/**
 * Creates a regex pattern from the filtered lexicon entries
 * @param lexicon - Array of lexicon entries for a specific language
 * @returns RegExp object for matching filler words
 */
function createRegexFromLexicon(lexicon: LexiconEntry[], language: string): RegExp {
  if (lexicon.length === 0) {
    logger.warn(`No lexicon entries found for language: ${language}`);
    return /(?!.*)/; // Match nothing
  }

  // Escape special regex characters and create pattern
  const patterns = lexicon.map((entry) => entry.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  return new RegExp(`\\b(${patterns.join('|')})\\b`, 'gi');
}

/**
 * Analyzes transcript and returns highlighted segments with filler word detection
 * @param text - The transcript text to analyze
 * @param language - Language code for filtering the lexicon (default: 'en')
 * @returns Array of transcript segments with filler word metadata
 */
export function getHighlightedTranscript(
  text: string,
  language: string = 'en'
): TranscriptSegment[] {
  try {
    if (!text || text.trim().length === 0) {
      return [{ text: '', isFiller: false, category: null }];
    }

    const lexicon = getLexiconForLanguage(language);
    const regex = createRegexFromLexicon(lexicon, language);

    const segments: TranscriptSegment[] = [];
    let lastIndex = 0;
    let match;

    // Reset regex state
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText) {
          segments.push({
            text: beforeText,
            isFiller: false,
            category: null,
          });
        }
      }

      // Find the matching lexicon entry to get category
      const matchedTerm = match[1].toLowerCase();
      const lexiconEntry = lexicon.find((entry) => entry.term.toLowerCase() === matchedTerm);

      // Add the filler word
      segments.push({
        text: match[0],
        isFiller: true,
        category: lexiconEntry?.category || null,
      });

      lastIndex = regex.lastIndex;
    }

    // Add remaining text after the last match
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText) {
        segments.push({
          text: remainingText,
          isFiller: false,
          category: null,
        });
      }
    }

    // If no matches found, return the whole text as one segment
    if (segments.length === 0) {
      segments.push({
        text: text,
        isFiller: false,
        category: null,
      });
    }

    return segments;
  } catch (error) {
    logger.error('Error in getHighlightedTranscript:', error);
    // Return safe fallback
    return [
      {
        text: text || '',
        isFiller: false,
        category: null,
      },
    ];
  }
}

/**
 * Analyzes transcript and returns comprehensive analysis results
 * @param text - The transcript text to analyze
 * @param duration - Speech duration in minutes
 * @param language - Language code for filtering the lexicon (default: 'en')
 * @returns Analysis results including counts, density, and category breakdown
 */
export function getSessionAnalysis(
  text: string,
  duration: number,
  language: string = 'en'
): AnalysisResult {
  try {
    if (!text || text.trim().length === 0) {
      return {
        totalWordCount: 0,
        totalFillerCount: 0,
        fillerDensityPercent: 0,
        fillersPerMinute: 0,
        categoryCounts: {},
      };
    }

    const lexicon = getLexiconForLanguage(language);
    const regex = createRegexFromLexicon(lexicon, language);

    // Count total words
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const totalWordCount = words.length;

    // Count filler words
    const matches = text.match(regex);
    const totalFillerCount = matches?.length || 0;

    // Calculate density percentage
    const fillerDensityPercent = totalWordCount > 0 ? (totalFillerCount / totalWordCount) * 100 : 0;

    // Calculate fillers per minute
    const fillersPerMinute = duration > 0 ? totalFillerCount / duration : 0;

    // Count by category
    const categoryCounts: CategoryCounts = {};

    if (matches) {
      matches.forEach((match) => {
        const matchedTerm = match.toLowerCase();
        const lexiconEntry = lexicon.find((entry) => entry.term.toLowerCase() === matchedTerm);
        if (lexiconEntry) {
          const category = lexiconEntry.category as string;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });
    }

    return {
      totalWordCount,
      totalFillerCount,
      fillerDensityPercent: Math.round(fillerDensityPercent * 10) / 10, // Round to 1 decimal
      fillersPerMinute: Math.round(fillersPerMinute * 10) / 10, // Round to 1 decimal
      categoryCounts,
    };
  } catch (error) {
    logger.error('Error in getSessionAnalysis:', error);
    // Return safe fallback
    return {
      totalWordCount: 0,
      totalFillerCount: 0,
      fillerDensityPercent: 0,
      fillersPerMinute: 0,
      categoryCounts: {
        FILLED_PAUSE: 0,
        DISCOURSE_MARKER: 0,
        PLACATING_TAG: 0,
      },
    };
  }
}
