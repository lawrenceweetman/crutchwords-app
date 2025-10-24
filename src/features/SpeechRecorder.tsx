import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { getSessionAnalysis } from '@/services/analysisService';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';

/**
 * Props for the SpeechRecorder component
 */
interface SpeechRecorderProps {
  /** Callback when recording session ends */
  onSessionComplete?: (
    transcript: string,
    analysis: { totalWordCount: number; totalFillerCount: number }
  ) => void;
  /** Language for speech recognition */
  language?: string;
  /** Custom CSS classes */
  className?: string;
}

/**
 * SpeechRecorder component - Main interface for speech recording and analysis
 *
 * Features:
 * - Start/stop recording functionality
 * - Real-time transcript display with filler highlighting
 * - Session analysis and summary
 * - Proper error handling and user feedback
 * - Responsive design
 */
export function SpeechRecorder({
  onSessionComplete,
  language = 'en-US',
  className = '',
}: SpeechRecorderProps): JSX.Element {
  const { t } = useTranslation();
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({ language });

  const {
    isRecording,
    setRecording,
    setTranscript: setStoreTranscript,
    setAnalysis,
    setError,
  } = useAppStore();

  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  /**
   * Handle start recording
   */
  const handleStartRecording = useCallback(async () => {
    try {
      logger.info('Starting recording session');
      setError(null);
      setShowSummary(false);

      // Reset any previous transcript
      resetTranscript();

      // Start speech recognition
      await startListening();

      // Update app state
      setRecording(true);
      setSessionStartTime(Date.now());
    } catch (error) {
      logger.error('Failed to start recording', error);
      setError(error instanceof Error ? error.message : 'Failed to start recording');
    }
  }, [startListening, resetTranscript, setRecording, setError]);

  /**
   * Handle stop recording
   */
  const handleStopRecording = useCallback(() => {
    try {
      logger.info('Stopping recording session');
      stopListening();
      setRecording(false);

      // Generate analysis if we have transcript
      if (transcript.trim()) {
        const duration = sessionStartTime ? (Date.now() - sessionStartTime) / 1000 / 60 : 0; // in minutes
        const analysis = getSessionAnalysis(transcript, duration, language);

        setAnalysis(analysis);
        setShowSummary(true);

        // Update store with final transcript
        setStoreTranscript(transcript);

        // Call completion callback
        if (onSessionComplete) {
          onSessionComplete(transcript, analysis);
        }

        logger.info('Recording session completed', {
          transcriptLength: transcript.length,
          wordCount: analysis.totalWordCount,
          fillerCount: analysis.totalFillerCount,
          duration,
        });
      }
    } catch (error) {
      logger.error('Failed to stop recording', error);
      setError(error instanceof Error ? error.message : 'Failed to stop recording');
    }
  }, [
    stopListening,
    setRecording,
    transcript,
    sessionStartTime,
    language,
    setAnalysis,
    setStoreTranscript,
    setError,
    onSessionComplete,
  ]);

  /**
   * Handle discard session
   */
  const handleDiscardSession = useCallback(() => {
    logger.info('Discarding recording session');
    resetTranscript();
    setStoreTranscript('');
    setAnalysis(null);
    setShowSummary(false);
    setSessionStartTime(null);
    setError(null);
  }, [resetTranscript, setStoreTranscript, setAnalysis, setError]);

  /**
   * Handle retry/recording again
   */
  const handleRetryRecording = useCallback(() => {
    logger.info('Retrying recording');
    setShowSummary(false);
    setError(null);
    resetTranscript();
    setStoreTranscript('');
    setAnalysis(null);
  }, [resetTranscript, setStoreTranscript, setAnalysis, setError]);

  /**
   * Sync speech recognition state with app store
   */
  useEffect(() => {
    setRecording(isListening);
  }, [isListening, setRecording]);

  /**
   * Handle speech recognition errors
   */
  useEffect(() => {
    if (speechError) {
      setError(speechError);
    }
  }, [speechError, setError]);

  if (!isSupported) {
    return (
      <div className={`text-center py-8 text-red-600 ${className}`}>
        <p className="mb-4">
          {t(
            'recorder.microphonePermission',
            'Speech recognition is not supported in this browser.'
          )}
        </p>
        <p className="text-sm text-gray-600">
          {t(
            'recorder.microphonePermission',
            'Please use Chrome, Firefox, or Safari for the best experience.'
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={`speech-recorder ${className}`}>
      {/* Recording Controls */}
      <div className="text-center mb-6">
        {!isRecording && !showSummary && (
          <button
            onClick={handleStartRecording}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isListening}
          >
            {t('recorder.start', 'Start Recording')}
          </button>
        )}

        {isRecording && (
          <button
            onClick={handleStopRecording}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {t('recorder.stop', 'Stop Recording')}
          </button>
        )}

        {showSummary && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetryRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t('recorder.resume', 'Record Again')}
            </button>
            <button
              onClick={handleDiscardSession}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t('common.cancel', 'Discard')}
            </button>
          </div>
        )}
      </div>

      {/* Status Messages */}
      <div className="text-center mb-4">
        {isListening && (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">
              {t('recorder.recording', 'Recording... Speak clearly!')}
            </span>
          </div>
        )}

        {!isRecording && !showSummary && (
          <p className="text-gray-600">
            {t('recorder.ready', 'Click "Start Recording" and begin speaking')}
          </p>
        )}
      </div>

      {/* Transcript Display */}
      <TranscriptDisplay
        transcript={transcript}
        interimTranscript={interimTranscript}
        language={language}
        highlightFillers={true}
        className="mb-6"
      />

      {/* Session Summary */}
      {showSummary && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            {t('analysis.title', 'Session Complete!')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-700">
                {transcript.split(/\s+/).filter((word) => word.length > 0).length}
              </div>
              <div className="text-green-600">{t('analysis.totalWords', 'Total Words')}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-700">
                {transcript.split(/\s+/).filter((word) => word.length > 0).length > 0
                  ? Math.round(
                      ((transcript.match(/\b(um|uh|like|you know|so|well|actually|basically)\b/gi)
                        ?.length || 0) /
                        transcript.split(/\s+/).filter((word) => word.length > 0).length) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-green-600">{t('analysis.fillerDensity', 'Filler Density')}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-700">
                {sessionStartTime ? Math.round((Date.now() - sessionStartTime) / 1000) : 0}s
              </div>
              <div className="text-green-600">Duration</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
