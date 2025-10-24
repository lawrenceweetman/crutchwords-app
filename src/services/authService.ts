import { signInAnonymously, onAuthStateChanged, User, Unsubscribe } from 'firebase/auth';

import { getFirebaseAuth } from '@/firebase/config';
import { logger } from '@/utils/logger';

/**
 * Authentication service for Firebase
 * Handles anonymous authentication for P1 and provides auth state management
 */

export interface AuthUser {
  id: string;
  isAnonymous: boolean;
  createdAt?: string;
}

/**
 * Convert Firebase User to AuthUser
 */
function firebaseUserToAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;

  return {
    id: user.uid,
    isAnonymous: user.isAnonymous,
    createdAt: user.metadata.creationTime || undefined,
  };
}

/**
 * Sign in anonymously with Firebase Auth
 * This provides a stable userId for P2 features
 */
export async function signInAnonymouslyUser(): Promise<AuthUser> {
  try {
    logger.info('Attempting anonymous sign in');

    const auth = getFirebaseAuth();
    if (!auth) {
      logger.warn('Firebase Auth not initialized - using mock user');
      // Return a mock user for development when Firebase is not configured
      return {
        id: 'demo-user-dev',
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      };
    }

    // Check if signInAnonymously is available (it might not be in test environments)
    if (typeof signInAnonymously === 'undefined') {
      logger.warn('signInAnonymously not available in this environment');
      throw new Error('Authentication not available in this environment');
    }

    const userCredential = await signInAnonymously(auth);
    const authUser = firebaseUserToAuthUser(userCredential.user);

    if (!authUser) {
      throw new Error('Failed to create anonymous user');
    }

    logger.info('Anonymous sign in successful', {
      userId: authUser.id,
      isAnonymous: authUser.isAnonymous,
    });

    return authUser;
  } catch (error) {
    logger.error('Anonymous sign in failed', error);

    // For development, return a mock user if Firebase fails
    if (import.meta.env.DEV) {
      logger.warn('Using mock user for development');
      return {
        id: 'demo-user-dev',
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      };
    }

    if (error instanceof Error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }

    throw new Error('Authentication failed: Unknown error');
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): AuthUser | null {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      logger.warn('Firebase Auth not initialized');
      return null;
    }

    const currentUser = auth.currentUser;
    return firebaseUserToAuthUser(currentUser);
  } catch (error) {
    logger.error('Failed to get current user', error);
    return null;
  }
}

/**
 * Listen to authentication state changes
 * Returns an unsubscribe function
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void): Unsubscribe {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      logger.warn('Firebase Auth not initialized - using mock auth state');
      // For development, simulate auth state change with mock user (one time only)
      if (import.meta.env.DEV) {
        // Use a static ID for development to avoid infinite loops
        callback({
          id: 'demo-user-dev',
          isAnonymous: true,
          createdAt: new Date().toISOString(),
        });
      } else {
        callback(null);
      }
      return () => {};
    }

    logger.info('Setting up auth state listener');

    // Check if onAuthStateChanged is available (it might not be in test environments)
    if (typeof onAuthStateChanged === 'undefined') {
      logger.warn('onAuthStateChanged not available in this environment');
      callback(null);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const authUser = firebaseUserToAuthUser(user);
      logger.debug('Auth state changed', {
        userId: authUser?.id,
        isAnonymous: authUser?.isAnonymous,
      });
      callback(authUser);
    });

    return unsubscribe;
  } catch (error) {
    logger.error('Failed to set up auth state listener', error);
    // Don't call callback in error state to avoid infinite loops
    return () => {};
  }
}

/**
 * Check if current user is authenticated
 */
export function isAuthenticated(): boolean {
  const currentUser = getCurrentUser();
  return currentUser !== null;
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    logger.info('Signing out user');

    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    await auth.signOut();
    logger.info('User signed out successfully');
  } catch (error) {
    logger.error('Sign out failed', error);
    throw new Error('Failed to sign out');
  }
}
