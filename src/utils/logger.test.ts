import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { logger } from './logger';

describe('Logger', () => {
  let consoleSpy: {
    debug: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}) as ReturnType<typeof vi.fn>,
      info: vi.spyOn(console, 'info').mockImplementation(() => {}) as ReturnType<typeof vi.fn>,
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}) as ReturnType<typeof vi.fn>,
      error: vi.spyOn(console, 'error').mockImplementation(() => {}) as ReturnType<typeof vi.fn>,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('debug', () => {
    it('logs debug messages in development', () => {
      logger.debug('Debug message');
      expect(consoleSpy.debug).toHaveBeenCalled();
    });

    it('includes timestamp in debug messages', () => {
      logger.debug('Debug message');
      const call = consoleSpy.debug.mock.calls[0][0] as string;
      expect(call).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('includes additional data when provided', () => {
      const data = { userId: '123', action: 'test' };
      logger.debug('Debug message', data);
      expect(consoleSpy.debug).toHaveBeenCalledWith(expect.any(String), data);
    });
  });

  describe('info', () => {
    it('logs info messages', () => {
      logger.info('Info message');
      expect(consoleSpy.info).toHaveBeenCalled();
    });

    it('formats info messages correctly', () => {
      logger.info('Info message');
      const call = consoleSpy.info.mock.calls[0][0] as string;
      expect(call).toContain('INFO:');
      expect(call).toContain('Info message');
    });
  });

  describe('warn', () => {
    it('logs warning messages', () => {
      logger.warn('Warning message');
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('formats warning messages correctly', () => {
      logger.warn('Warning message');
      const call = consoleSpy.warn.mock.calls[0][0] as string;
      expect(call).toContain('WARN:');
      expect(call).toContain('Warning message');
    });
  });

  describe('error', () => {
    it('logs error messages', () => {
      logger.error('Error message');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('always logs errors regardless of environment', () => {
      logger.error('Error message');
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('formats error messages correctly', () => {
      logger.error('Error message');
      const call = consoleSpy.error.mock.calls[0][0] as string;
      expect(call).toContain('ERROR');
      expect(call).toContain('Error message');
    });

    it('handles error objects', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', { error: error.message });
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('Error occurred'),
        expect.objectContaining({ error: 'Test error' })
      );
    });
  });

  describe('message formatting', () => {
    it('includes ISO timestamp in all messages', () => {
      logger.info('Test message');
      const call = consoleSpy.info.mock.calls[0][0] as string;
      // Check for ISO 8601 format
      expect(call).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });

    it('handles empty data object', () => {
      logger.info('Test message', {});
      expect(consoleSpy.info).toHaveBeenCalledWith(expect.any(String), {});
    });

    it('handles complex data structures', () => {
      const complexData = {
        nested: {
          value: 'test',
          array: [1, 2, 3],
        },
      };
      logger.info('Test message', complexData);
      expect(consoleSpy.info).toHaveBeenCalledWith(expect.any(String), complexData);
    });
  });
});
