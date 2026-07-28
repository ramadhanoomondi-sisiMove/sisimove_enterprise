// src/infrastructure/logging/winston/winston-logger.service.ts

import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { Logger } from '../../../foundation/logging/logger.interface';
import { LogContext } from '../../../foundation/logging/log-context';

@Injectable()
export class WinstonLoggerService implements Logger {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  trace(message: string, context?: LogContext): void {
    this.logger.silly(message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(message, {
      ...context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(message, {
      ...context,
      level: 'FATAL',
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }
}
