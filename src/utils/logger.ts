/**
 * Centralized logging utility for the Fluent application
 *
 * Provides consistent logging across the application with different levels
 * and automatic stripping of debug/info logs in production builds.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const entry = this.formatMessage(level, message, data);

    // Always log errors, regardless of environment
    if (level === 'error') {
      console.error(`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
      return;
    }

    // Only log debug and info in development
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return;
    }

    switch (level) {
      case 'debug':
        console.debug(`[${entry.timestamp}] DEBUG: ${message}`, data || '');
        break;
      case 'info':
        console.info(`[${entry.timestamp}] INFO: ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`[${entry.timestamp}] WARN: ${message}`, data || '');
        break;
    }
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Log general information
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Log errors (always logged, even in production)
   */
  error(message: string, data?: any): void {
    this.log('error', message, data);
  }
}

// Export a singleton instance
export const logger = new Logger();
export default logger;
