// src/app.module.ts

import { Module } from '@nestjs/common';

import { IdentityModule } from './domains/identity/identity.module';

import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { EventsModule } from './infrastructure/events/events.module';
import { LoggingModule } from './infrastructure/logging/winston/logging.module';
import { SecurityModule } from './infrastructure/security/security.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    LoggingModule,
    SecurityModule,

    IdentityModule,
  ],
})
export class AppModule {}
