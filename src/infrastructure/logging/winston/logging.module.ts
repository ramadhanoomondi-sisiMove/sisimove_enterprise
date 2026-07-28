// src/infrastructure/logging/winston/logging.module.ts

import { Global, Module } from '@nestjs/common';

import { LOGGER } from '../../../foundation/logging/logger.token';

import { WinstonLoggerService } from './winston-logger.service';

@Global()
@Module({
  providers: [
    WinstonLoggerService,
    {
      provide: LOGGER,
      useExisting: WinstonLoggerService,
    },
  ],
  exports: [LOGGER, WinstonLoggerService],
})
export class LoggingModule {}
