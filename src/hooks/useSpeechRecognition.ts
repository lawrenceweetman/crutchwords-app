import { useEffect, useRef, useCallback, useState } from 'react';

import { logger } from '@/utils/logger';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * Custom hook for speech recognition using the Web Speech API
 * Provides real-time transcription with proper error handling and browser compatibility
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { continuous = true, interimResults = true, language = 'en-US' } = options;

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if speech recognition is supported
  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  /**
   * Get the appropriate SpeechRecognition constructor for the current browser
   */
  const getSpeechRecognition = useCallback((): new () => SpeechRecognition => {
    if (typeof window === 'undefined') {
      throw new Error('Speech recognition is not available in this environment');
    }

    if ('SpeechRecognition' in window && window.SpeechRecognition) {
      return window.SpeechRecognition;
    }

    if ('webkitSpeechRecognition' in window && window.webkitSpeechRecognition) {
      return window.webkitSpeechRecognition;
    }

    throw new Error('Speech recognition is not supported in this browser');
  }, []);

  /**
   * Initialize speech recognition instance
   */
  const initializeRecognition = useCallback(() => {
    try {
      const SpeechRecognition = getSpeechRecognition();
      const recognition = new SpeechRecognition();

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;

      recognition.onstart = () => {
        logger.info('Speech recognition started');
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        logger.info('Speech recognition ended');
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscriptText = '';

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscriptText += text;
          }
        }

        // Update transcripts
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
        }

        setInterimTranscript(interimTranscriptText);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const errorMessage = `Speech recognition error: ${event.error}${event.message ? ` - ${event.message}` : ''}`;
        logger.error('Speech recognition error', { error: event.error, message: event.message });

        setError(errorMessage);
        setIsListening(false);

        // Handle specific error types
        switch (event.error) {
          case 'not-allowed':
            setError(
              'Microphone access denied. Please allow microphone permissions and try again.'
            );
            break;
          case 'no-speech':
            setError('No speech detected. Please speak clearly and try again.');
            break;
          case 'audio-capture':
            setError('No microphone found. Please check your audio setup.');
            break;
          case 'network':
            setError('Network error occurred. Please check your connection and try again.');
            break;
          default:
            setError(errorMessage);
        }
      };

      recognition.onnomatch = () => {
        logger.warn('No speech was detected');
        // Don't treat this as an error, just log it
      };

      return recognition;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize speech recognition';
      logger.error('Failed to initialize speech recognition', err);
      setError(errorMessage);
      return null;
    }
  }, [continuous, interimResults, language, getSpeechRecognition]);

  /**
   * Start speech recognition
   */
  const startListening = useCallback(async () => {
    try {
      setError(null);

      // Request microphone permission if needed
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          logger.error('Microphone permission denied', err);
          setError(
            'Microphone access is required for speech recognition. Please allow microphone permissions.'
          );
          return;
        }
      }

      // Initialize recognition if not already done
      if (!recognitionRef.current) {
        recognitionRef.current = initializeRecognition();
      }

      if (recognitionRef.current && !isListening) {
        recognitionRef.current.start();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start speech recognition';
      logger.error('Failed to start speech recognition', err);
      setError(errorMessage);
    }
  }, [isListening, initializeRecognition]);

  /**
   * Stop speech recognition
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  /**
   * Reset transcript
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
