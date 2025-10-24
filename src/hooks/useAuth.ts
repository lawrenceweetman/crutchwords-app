import { useEffect, useCallback } from 'react';

import {
  signInAnonymouslyUser,
  getCurrentUser,
  onAuthStateChange,
  isAuthenticated,
  type AuthUser,
} from '@/services/authService';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';

/**
 * Custom hook for managing Firebase authentication state
 * Automatically signs in users anonymously and manages auth state in the app store
 */
export function useAuth() {
  const { user, isAuthenticated: storeAuthState, setUser, setAuthenticated } = useAppStore();

  /**
   * Initialize authentication
   * This should be called once when the app starts
   */
  const initializeAuth = useCallback(async (): Promise<void> => {
    try {
      logger.info('Initializing authentication');

      // Check if already authenticated
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setAuthenticated(true);
          logger.info('User already authenticated', { userId: currentUser.id });
          return;
        }
      }

      // Sign in anonymously
      logger.info('Signing in anonymously');
      const authUser = await signInAnonymouslyUser();
      setUser(authUser);
      setAuthenticated(true);
    } catch (error) {
      logger.error('Authentication initialization failed', error);
      setUser(null);
      setAuthenticated(false);
    }
  }, [setUser, setAuthenticated]);

  /**
   * Sign out current user
   */
  const signOut = async (): Promise<void> => {
    try {
      logger.info('Signing out user');
      await signInAnonymouslyUser(); // This will create a new anonymous user
      const newUser = getCurrentUser();
      if (newUser) {
        setUser(newUser);
        setAuthenticated(true);
      }
    } catch (error) {
      logger.error('Sign out failed', error);
      setUser(null);
      setAuthenticated(false);
    }
  };

  /**
   * Set up auth state listener
   */
  useEffect(() => {
    logger.info('Setting up auth state listener');

    const unsubscribe = onAuthStateChange((authUser: AuthUser | null) => {
      if (authUser) {
        setUser(authUser);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    });

    // Initialize auth if not already done
    if (!storeAuthState || !user) {
      initializeAuth();
    }

    // Cleanup listener on unmount
    return () => {
      logger.info('Cleaning up auth state listener');
      unsubscribe();
    };
  }, [storeAuthState, user, setUser, setAuthenticated, initializeAuth]);

  return {
    user,
    isAuthenticated: storeAuthState,
    initializeAuth,
    signOut,
  };
}
