// src/app.module.ts

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domains
// -----------------------------------------------------------------------------

import { IdentityModule } from './domains/identity/identity.module';
import { AssetsModule } from './domains/assets/assets.module';
import { SocialModule } from './domains/social/social.module';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { EventsModule } from './infrastructure/events/events.module';
import { LoggingModule } from './infrastructure/logging/winston/logging.module';
import { SecurityModule } from './infrastructure/security/security.module';

// -----------------------------------------------------------------------------
// Application Module
// -----------------------------------------------------------------------------

@Module({
  imports: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    PrismaModule,
    EventsModule,
    LoggingModule,
    SecurityModule,

    // =========================================================================
    // Domains
    // =========================================================================

    IdentityModule,
    AssetsModule,
    SocialModule,
  ],
})
export class AppModule {}
