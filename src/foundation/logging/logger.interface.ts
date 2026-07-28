// src/foundation/logging/logger.interface.ts

import type { LogContext } from './log-context';

export interface Logger {
  trace(message: string, context?: LogContext): void;

  debug(message: string, context?: LogContext): void;

  info(message: string, context?: LogContext): void;

  warn(message: string, context?: LogContext): void;

  error(message: string, error?: Error, context?: LogContext): void;

  fatal(message: string, error?: Error, context?: LogContext): void;
}
