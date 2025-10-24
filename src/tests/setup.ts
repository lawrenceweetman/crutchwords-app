import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase for testing
vi.mock('@/firebase/config', () => ({
  getFirebaseAuth: vi.fn(() => ({})),
  getFirestoreDB: vi.fn(() => ({})),
  getFirebaseApp: vi.fn(() => ({})),
}));

// Mock i18n for testing
vi.mock('@/utils/i18n', () => ({
  default: {
    t: (key: string) => key,
    language: 'en',
  },
}));
