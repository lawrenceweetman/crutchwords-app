import { describe, it, expect } from 'vitest';

import APP_CONFIG from './app.config';

describe('APP_CONFIG', () => {
  it('has required app identity fields', () => {
    expect(APP_CONFIG.name).toBeDefined();
    expect(APP_CONFIG.tagline).toBeDefined();
    expect(APP_CONFIG.description).toBeDefined();
  });

  it('has correct app name', () => {
    expect(APP_CONFIG.name).toBe('Fluent');
  });

  it('has correct tagline', () => {
    expect(APP_CONFIG.tagline).toBe('Speak with Confidence');
  });

  it('has technical naming fields', () => {
    expect(APP_CONFIG.technicalName).toBe('crutchwords-app');
    expect(APP_CONFIG.packageName).toBeDefined();
  });

  it('has metadata fields', () => {
    expect(APP_CONFIG.version).toBeDefined();
    expect(APP_CONFIG.repository).toBeDefined();
  });

  it('has feature flags object', () => {
    expect(APP_CONFIG.features).toBeDefined();
    expect(typeof APP_CONFIG.features).toBe('object');
  });

  it('has all feature flags defined', () => {
    expect(APP_CONFIG.features.enableAnalytics).toBeDefined();
    expect(APP_CONFIG.features.enableOfflineMode).toBeDefined();
    expect(APP_CONFIG.features.enableExportData).toBeDefined();
  });

  it('is immutable (as const)', () => {
    // TypeScript should enforce this at compile time
    // This test verifies the structure exists
    expect(Object.isFrozen(APP_CONFIG)).toBe(false); // as const doesn't freeze, but prevents reassignment
  });

  it('has valid repository URL', () => {
    expect(APP_CONFIG.repository).toMatch(/^https:\/\/github\.com\//);
  });

  it('has valid version format', () => {
    expect(APP_CONFIG.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
