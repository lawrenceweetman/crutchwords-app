import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { logger } from '@/utils/logger';

/**
 * Global application state management using Zustand
 *
 * This store manages application-wide state including user authentication,
 * session data, and UI state. All state changes are logged for debugging.
 */

interface User {
  id: string;
  isAnonymous: boolean;
  createdAt?: string;
}

interface PracticeSession {
  id: string;
  transcript: string;
  analysis: {
    totalWordCount: number;
    totalFillerCount: number;
    fillerDensityPercent: number;
    fillersPerMinute: number;
    categoryCounts: Record<string, number>;
  };
  createdAt: string;
  duration: number;
}

interface AppState {
  // User authentication state
  user: User | null;
  isAuthenticated: boolean;

  // Recording state
  isRecording: boolean;
  currentTranscript: string;
  currentAnalysis: PracticeSession['analysis'] | null;

  // Session history
  sessions: PracticeSession[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // User settings
  settings: {
    highlightFillers: boolean;
    showCategories: boolean;
    goalFillersPerMinute: number;
  };
}

interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;

  // Recording actions
  setRecording: (recording: boolean) => void;
  setTranscript: (transcript: string) => void;
  setAnalysis: (analysis: PracticeSession['analysis'] | null) => void;

  // Session actions
  addSession: (session: PracticeSession) => void;
  updateSession: (sessionId: string, updates: Partial<PracticeSession>) => void;
  deleteSession: (sessionId: string) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Settings actions
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  resetSettings: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isRecording: false,
  currentTranscript: '',
  currentAnalysis: null,
  sessions: [],
  isLoading: false,
  error: null,
  settings: {
    highlightFillers: true,
    showCategories: true,
    goalFillersPerMinute: 3,
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    set => ({
      ...initialState,

      // User actions
      setUser: user => {
        logger.info('Setting user', { userId: user?.id, isAnonymous: user?.isAnonymous });
        set({ user, isAuthenticated: !!user });
      },

      setAuthenticated: isAuthenticated => {
        logger.info('Setting authentication state', { isAuthenticated });
        set({ isAuthenticated });
      },

      // Recording actions
      setRecording: isRecording => {
        logger.info('Setting recording state', { isRecording });
        set({ isRecording });
      },

      setTranscript: currentTranscript => {
        set({ currentTranscript });
      },

      setAnalysis: currentAnalysis => {
        logger.debug('Setting current analysis', { currentAnalysis });
        set({ currentAnalysis });
      },

      // Session actions
      addSession: session => {
        logger.info('Adding new session', {
          sessionId: session.id,
          fillerCount: session.analysis.totalFillerCount,
        });
        set(state => ({
          sessions: [session, ...state.sessions],
        }));
      },

      updateSession: (sessionId, updates) => {
        logger.info('Updating session', { sessionId, updates });
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId ? { ...session, ...updates } : session
          ),
        }));
      },

      deleteSession: sessionId => {
        logger.info('Deleting session', { sessionId });
        set(state => ({
          sessions: state.sessions.filter(session => session.id !== sessionId),
        }));
      },

      // UI actions
      setLoading: isLoading => {
        logger.debug('Setting loading state', { isLoading });
        set({ isLoading });
      },

      setError: error => {
        if (error) {
          logger.error('Setting error state', { error });
        } else {
          logger.info('Clearing error state');
        }
        set({ error });
      },

      // Settings actions
      updateSettings: settings => {
        logger.info('Updating settings', { settings });
        set((state: AppState) => ({
          settings: { ...state.settings, ...settings },
        }));
      },

      resetSettings: () => {
        logger.info('Resetting settings to defaults');
        set(() => ({
          settings: initialState.settings,
        }));
      },
    }),
    {
      name: 'fluent-app-store',
      partialize: (state: AppState) => ({
        user: state.user,
        sessions: state.sessions,
        settings: state.settings,
      }),
    }
  )
);
