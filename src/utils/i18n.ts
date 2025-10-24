import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation data directly for now
import enTranslations from '../../public/locales/en/translation.json';

/**
 * i18next configuration for the Fluent application
 *
 * This sets up internationalization with English as the default language.
 * All user-facing strings should use the translation keys for easy localization.
 */

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  debug: import.meta.env.DEV,

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // Disable suspense for easier testing
  react: {
    useSuspense: false,
  },
});

export default i18n;
