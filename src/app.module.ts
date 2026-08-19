// src/app.module.ts

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domains
// -----------------------------------------------------------------------------

import { IdentityModule } from './domains/identity/identity.module';
import { AssetsModule } from './domains/assets/assets.module';
import { SocialModule } from './domains/social/social.module';
import { TrustModule } from './domains/trust/trust.module';
import { JourneyModule } from './domains/journey/journey.module';
import { JourneyDemandModule } from './domains/journey-demand/journey-demand.module';
import { JourneyBookingModule } from './domains/journey-booking/journey-booking.module';
import { JourneyBoardingModule } from './domains/journey-boarding/journey-boarding.module';

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
    TrustModule,
    JourneyModule,
    JourneyDemandModule,
    JourneyBookingModule,
    JourneyBoardingModule,
  ],
})
export class AppModule {}
