/**
 * Production-safe Logger Utility
 *
 * Only outputs logs in development mode to prevent
 * sensitive information leakage in production.
 *
 * @created 2026-01-09
 */

type LogArgs = unknown[];

/**
 * Check if we're in development mode
 */
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Logger utility that only outputs in development
 */
export const logger = {
  /**
   * Log error messages (development only)
   */
  error: (...args: LogArgs): void => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (...args: LogArgs): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log info messages (development only)
   */
  log: (...args: LogArgs): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log info messages (development only)
   */
  info: (...args: LogArgs): void => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (...args: LogArgs): void => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
