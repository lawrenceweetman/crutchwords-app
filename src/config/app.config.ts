/**
 * Application Configuration
 *
 * This file contains all app-level configuration that may need to change
 * across different deployments or rebrandings. Update values here rather
 * than searching through the codebase.
 */

export const APP_CONFIG = {
  // App Identity
  name: 'Fluent',
  tagline: 'Speak with Confidence',
  description: 'An app to help you identify and reduce filler words in your speech',

  // Technical Names (used in URLs, Firebase, etc.)
  technicalName: 'crutchwords-app',
  packageName: '@crutchwords/fluent-app',

  // Metadata
  version: '0.1.0',
  repository: 'https://github.com/lawrenceweetman/crutchwords-app',

  // Feature Flags (for future use)
  features: {
    enableAnalytics: false,
    enableOfflineMode: false,
    enableExportData: false,
  },
} as const;

export default APP_CONFIG;
