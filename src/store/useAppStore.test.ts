import { describe, it, expect, beforeEach } from 'vitest';

import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const store = useAppStore.getState();
    store.setUser(null);
    store.setRecording(false);
    store.setTranscript('');
    store.setAnalysis(null);
    store.setError(null);
    store.setLoading(false);
    store.resetSettings();

    // Clear all sessions
    const sessions = [...store.sessions];
    sessions.forEach((session) => store.deleteSession(session.id));
  });

  describe('initial state', () => {
    it('has correct initial user state', () => {
      const state = useAppStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('has correct initial recording state', () => {
      const state = useAppStore.getState();
      expect(state.isRecording).toBe(false);
      expect(state.currentTranscript).toBe('');
      expect(state.currentAnalysis).toBeNull();
    });

    it('has correct initial UI state', () => {
      const state = useAppStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('has correct initial settings', () => {
      const state = useAppStore.getState();
      expect(state.settings).toEqual({
        highlightFillers: true,
        showCategories: true,
        goalFillersPerMinute: 3,
      });
    });

    it('has empty sessions array', () => {
      const state = useAppStore.getState();
      expect(state.sessions).toEqual([]);
    });
  });

  describe('user actions', () => {
    it('sets user correctly', () => {
      const user = { id: 'user-123', isAnonymous: true };
      useAppStore.getState().setUser(user);

      const state = useAppStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('clears user when set to null', () => {
      const user = { id: 'user-123', isAnonymous: true };
      useAppStore.getState().setUser(user);
      useAppStore.getState().setUser(null);

      const state = useAppStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('sets authentication state independently', () => {
      useAppStore.getState().setAuthenticated(true);
      expect(useAppStore.getState().isAuthenticated).toBe(true);

      useAppStore.getState().setAuthenticated(false);
      expect(useAppStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('recording actions', () => {
    it('toggles recording state', () => {
      useAppStore.getState().setRecording(true);
      expect(useAppStore.getState().isRecording).toBe(true);

      useAppStore.getState().setRecording(false);
      expect(useAppStore.getState().isRecording).toBe(false);
    });

    it('updates transcript', () => {
      const transcript = 'Hello world, um, this is a test';
      useAppStore.getState().setTranscript(transcript);
      expect(useAppStore.getState().currentTranscript).toBe(transcript);
    });

    it('updates analysis', () => {
      const analysis = {
        totalWordCount: 100,
        totalFillerCount: 5,
        fillerDensityPercent: 5.0,
        fillersPerMinute: 3.0,
        categoryCounts: { FILLED_PAUSE: 3, DISCOURSE_MARKER: 2, PLACATING_TAG: 0 },
      };

      useAppStore.getState().setAnalysis(analysis);
      expect(useAppStore.getState().currentAnalysis).toEqual(analysis);
    });

    it('clears analysis when set to null', () => {
      const analysis = {
        totalWordCount: 100,
        totalFillerCount: 5,
        fillerDensityPercent: 5.0,
        fillersPerMinute: 3.0,
        categoryCounts: {},
      };

      useAppStore.getState().setAnalysis(analysis);
      useAppStore.getState().setAnalysis(null);
      expect(useAppStore.getState().currentAnalysis).toBeNull();
    });
  });

  describe('session actions', () => {
    const mockSession = {
      id: 'session-1',
      transcript: 'Test transcript',
      analysis: {
        totalWordCount: 50,
        totalFillerCount: 3,
        fillerDensityPercent: 6.0,
        fillersPerMinute: 2.0,
        categoryCounts: { FILLED_PAUSE: 2, DISCOURSE_MARKER: 1, PLACATING_TAG: 0 },
      },
      createdAt: '2025-10-24T12:00:00Z',
      duration: 90,
    };

    it('adds a new session', () => {
      useAppStore.getState().addSession(mockSession);
      const state = useAppStore.getState();
      expect(state.sessions).toHaveLength(1);
      expect(state.sessions[0]).toEqual(mockSession);
    });

    it('adds sessions at the beginning of the array', () => {
      const session1 = { ...mockSession, id: 'session-1' };
      const session2 = { ...mockSession, id: 'session-2' };

      useAppStore.getState().addSession(session1);
      useAppStore.getState().addSession(session2);

      const state = useAppStore.getState();
      expect(state.sessions[0].id).toBe('session-2');
      expect(state.sessions[1].id).toBe('session-1');
    });

    it('updates an existing session', () => {
      useAppStore.getState().addSession(mockSession);
      useAppStore.getState().updateSession('session-1', {
        transcript: 'Updated transcript',
      });

      const state = useAppStore.getState();
      expect(state.sessions[0].transcript).toBe('Updated transcript');
    });

    it('deletes a session', () => {
      useAppStore.getState().addSession(mockSession);
      useAppStore.getState().deleteSession('session-1');

      const state = useAppStore.getState();
      expect(state.sessions).toHaveLength(0);
    });

    it('does not delete non-existent session', () => {
      useAppStore.getState().addSession(mockSession);
      useAppStore.getState().deleteSession('non-existent-id');

      const state = useAppStore.getState();
      expect(state.sessions).toHaveLength(1);
    });
  });

  describe('UI actions', () => {
    it('sets loading state', () => {
      useAppStore.getState().setLoading(true);
      expect(useAppStore.getState().isLoading).toBe(true);

      useAppStore.getState().setLoading(false);
      expect(useAppStore.getState().isLoading).toBe(false);
    });

    it('sets error message', () => {
      const errorMessage = 'Something went wrong';
      useAppStore.getState().setError(errorMessage);
      expect(useAppStore.getState().error).toBe(errorMessage);
    });

    it('clears error when set to null', () => {
      useAppStore.getState().setError('Error');
      useAppStore.getState().setError(null);
      expect(useAppStore.getState().error).toBeNull();
    });
  });

  describe('settings actions', () => {
    it('updates individual settings', () => {
      useAppStore.getState().updateSettings({ highlightFillers: false });
      expect(useAppStore.getState().settings.highlightFillers).toBe(false);
    });

    it('updates multiple settings at once', () => {
      useAppStore.getState().updateSettings({
        highlightFillers: false,
        goalFillersPerMinute: 5,
      });

      const state = useAppStore.getState();
      expect(state.settings.highlightFillers).toBe(false);
      expect(state.settings.goalFillersPerMinute).toBe(5);
    });

    it('resets settings to defaults', () => {
      useAppStore.getState().updateSettings({
        highlightFillers: false,
        showCategories: false,
        goalFillersPerMinute: 10,
      });

      useAppStore.getState().resetSettings();

      const state = useAppStore.getState();
      expect(state.settings).toEqual({
        highlightFillers: true,
        showCategories: true,
        goalFillersPerMinute: 3,
      });
    });
  });
});
