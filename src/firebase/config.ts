import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { logger } from '@/utils/logger';

/**
 * Firebase configuration and service initialization
 *
 * This module centralizes all Firebase services and configuration.
 * Environment variables are used to configure Firebase for different environments.
 */

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase configuration from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Validate configuration
const isValidConfig = (config: FirebaseConfig): boolean => {
  return !!(config.apiKey && config.authDomain && config.projectId);
};

let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let firestore: ReturnType<typeof getFirestore> | null = null;

/**
 * Initialize Firebase services
 * This should be called once when the app starts
 */
export const initializeFirebase = (): void => {
  if (!isValidConfig(firebaseConfig)) {
    logger.warn('Firebase configuration is incomplete. Some features may not work.', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
    });
    return;
  }

  try {
    logger.info('Initializing Firebase services');
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);

    logger.info('Firebase services initialized successfully', {
      projectId: firebaseConfig.projectId,
    });
  } catch (error) {
    logger.error('Failed to initialize Firebase services', error);
  }
};

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = (): ReturnType<typeof getAuth> => {
  if (!auth) {
    logger.warn('Firebase Auth not initialized. Call initializeFirebase() first.');
  }
  return auth!;
};

/**
 * Get Firestore instance
 */
export const getFirestoreDB = (): ReturnType<typeof getFirestore> => {
  if (!firestore) {
    logger.warn('Firestore not initialized. Call initializeFirebase() first.');
  }
  return firestore!;
};

/**
 * Get Firebase app instance
 */
export const getFirebaseApp = (): ReturnType<typeof initializeApp> => {
  if (!firebaseApp) {
    logger.warn('Firebase app not initialized. Call initializeFirebase() first.');
  }
  return firebaseApp!;
};

// Export configuration for debugging (development only)
export const getFirebaseConfig = (): FirebaseConfig => {
  return { ...firebaseConfig };
};

// Initialize Firebase when this module is imported
initializeFirebase();
