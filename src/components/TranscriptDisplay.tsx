import { useMemo } from 'react';

import { getHighlightedTranscript } from '@/services/analysisService';
import { logger } from '@/utils/logger';

/**
 * Props for the TranscriptDisplay component
 */
interface TranscriptDisplayProps {
  /** The current transcript text */
  transcript: string;
  /** The interim transcript text (words being processed) */
  interimTranscript: string;
  /** Language code for analysis (defaults to 'en') */
  language?: string;
  /** Whether to highlight filler words */
  highlightFillers?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * TranscriptDisplay component that shows real-time speech transcription
 * with filler words highlighted safely without using dangerouslySetInnerHTML
 *
 * Features:
 * - Real-time transcript display
 * - Filler word highlighting with visual indicators
 * - Safe content rendering following security guidelines
 * - Responsive design with proper text sizing
 */
export function TranscriptDisplay({
  transcript,
  interimTranscript,
  language = 'en',
  highlightFillers = true,
  className = '',
}: TranscriptDisplayProps): JSX.Element {
  /**
   * Process transcript and highlight filler words
   */
  const transcriptSegments = useMemo(() => {
    try {
      const fullText = transcript + (interimTranscript ? ' ' + interimTranscript : '');

      if (!highlightFillers || !fullText.trim()) {
        return fullText ? [{ text: fullText, isFiller: false, category: null }] : [];
      }

      return getHighlightedTranscript(fullText, language);
    } catch (error) {
      logger.error('Error processing transcript for highlighting', error);
      // Fallback to plain text display
      const fullText = transcript + (interimTranscript ? ' ' + interimTranscript : '');
      return fullText ? [{ text: fullText, isFiller: false, category: null }] : [];
    }
  }, [transcript, interimTranscript, language, highlightFillers]);

  /**
   * Get CSS classes for a segment based on whether it's a filler word
   */
  const getSegmentClasses = (isFiller: boolean, isInterim: boolean): string => {
    const baseClasses = 'transition-colors duration-200';

    if (isInterim) {
      return `${baseClasses} opacity-70 italic`;
    }

    if (isFiller) {
      return `${baseClasses} bg-yellow-200 text-yellow-900 px-1 rounded font-medium`;
    }

    return `${baseClasses} text-gray-900`;
  };

  /**
   * Check if this segment is part of the interim transcript
   */
  const isInterimSegment = (segmentIndex: number): boolean => {
    return Boolean(interimTranscript) && segmentIndex >= transcriptSegments.length - 1;
  };

  if (transcriptSegments.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        Start speaking to see your words transcribed here...
      </div>
    );
  }

  return (
    <div className={`transcript-display ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[120px] text-lg leading-relaxed">
        {transcriptSegments.map((segment, index) => (
          <span
            key={`${segment.text}-${index}`}
            className={getSegmentClasses(segment.isFiller, isInterimSegment(index))}
            title={segment.isFiller ? `Filler word: ${segment.category}` : undefined}
          >
            {segment.text}
          </span>
        ))}
      </div>

      {/* Legend for filler words */}
      {highlightFillers && transcriptSegments.some((segment) => segment.isFiller) && (
        <div className="mt-2 text-xs text-gray-600 flex items-center gap-2 flex-wrap">
          <span>Highlighted:</span>
          <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded font-medium">
            Filler words
          </span>
          <span className="opacity-70 italic">Italics = processing</span>
        </div>
      )}
    </div>
  );
}
