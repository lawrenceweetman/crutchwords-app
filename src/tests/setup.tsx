import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import i18n from '@/utils/i18n';

// Mock Firebase for testing
vi.mock('@/firebase/config', () => ({
  getFirebaseAuth: vi.fn(() => ({})),
  getFirestoreDB: vi.fn(() => ({})),
  getFirebaseApp: vi.fn(() => ({})),
}));

// Initialize i18n for tests
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        'app.welcome': 'Hello, {{appName}}!',
        'onboarding.subtitle': 'Your journey to confident communication starts here.',
      },
    },
  },
  // Disable suspense for easier testing
  react: {
    useSuspense: false,
  },
});

// Wrapper component for tests requiring i18n
export const I18nWrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);
