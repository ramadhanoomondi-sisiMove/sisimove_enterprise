// -----------------------------------------------------------------------------
// Application — Root NestJS Module
// -----------------------------------------------------------------------------
//
// Central composition root for the application.
//
// The AppModule is responsible for composing:
//
// - infrastructure;
// - bounded contexts / domains.
//
// Domain modules own their application workflows, domain behavior,
// persistence contracts, and presentation adapters.
//
// Infrastructure modules provide cross-cutting technical capabilities such as:
//
// - database access;
// - domain event infrastructure;
// - logging;
// - security;
// - HTTP exception handling and transport infrastructure.
//
// -----------------------------------------------------------------------------
//
// Infrastructure:
//
// PrismaModule
// └── Database / Prisma infrastructure
//
// EventsModule
// ├── EventBus
// ├── EventStore
// └── EventPublisher
//
// LoggingModule
// └── Winston logging infrastructure
//
// SecurityModule
// └── Authentication/security infrastructure
//
// HttpModule
// ├── GlobalExceptionFilter
// └── DomainExceptionHttpStatusMapper
//
// -----------------------------------------------------------------------------
//
// Bounded contexts:
//
// IdentityModule
// └── Identity, Verification, Role, Permission, RolePermission
//
// AuthModule
// ├── Authentication
// ├── Session
// ├── Device
// ├── Recovery
// └── OTP Challenge
//
// AssetsModule
// └── Asset management
//
// SocialModule
// └── Social/community capabilities
//
// TrustModule
// └── Trust and reputation capabilities
//
// JourneyModule
// └── Journey capabilities
//
// JourneyDemandModule
// └── Journey demand capabilities
//
// JourneyBookingModule
// └── Journey booking capabilities
//
// JourneyBoardingModule
// └── Journey boarding capabilities
//
// JourneyCompletionModule
// └── Journey completion capabilities
//
// CommercialModule
// └── Commercial rules and platform monetization
//
// FinancialModule
// └── Financial capabilities
//
// -----------------------------------------------------------------------------
//
// Composition:
//
//                              AppModule
//                                  │
//                   ┌──────────────┴──────────────┐
//                   │                             │
//             Infrastructure                  Domains
//                   │                             │
//        ┌──────────┼──────────┐          ┌───────┼────────┐
//        │          │          │          │       │        │
//     Prisma     Events     Logging     Identity  Auth    Assets
//        │          │          │
//     Security      │       HttpModule
//                             │
//                  GlobalExceptionFilter
//                             │
//             DomainExceptionHttpStatusMapper
//                                  │
//                                  ├── Social
//                                  ├── Trust
//                                  ├── Journey
//                                  ├── JourneyDemand
//                                  ├── JourneyBooking
//                                  ├── JourneyBoarding
//                                  ├── JourneyCompletion
//                                  ├── Commercial
//                                  └── Financial
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// AppModule contains composition only.
//
// It does not contain:
//
// - domain business rules;
// - application use-case logic;
// - repository implementations;
// - controller logic;
// - HTTP exception mapping logic.
//
// Those responsibilities remain inside their respective modules.
//
// HTTP exception translation belongs to infrastructure because it translates
// domain/application failures into transport-specific HTTP responses.
//
// -----------------------------------------------------------------------------
//
// Exception flow:
//
// DomainException
//       │
//       ▼
// GlobalExceptionFilter
//       │
//       ▼
// DomainExceptionHttpStatusMapper
//       │
//       ▼
// HTTP response
//
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Domains
// -----------------------------------------------------------------------------

import { IdentityModule } from './domains/identity/identity.module';

import { AuthModule } from './domains/auth/auth.module';

import { AssetsModule } from './domains/assets/assets.module';

import { SocialModule } from './domains/social/social.module';

import { TrustModule } from './domains/trust/trust.module';

import { JourneyModule } from './domains/journey/journey.module';

import { JourneyDemandModule } from './domains/journey-demand/journey-demand.module';

import { JourneyBookingModule } from './domains/journey-booking/journey-booking.module';

import { JourneyBoardingModule } from './domains/journey-boarding/journey-boarding.module';

import { JourneyCompletionModule } from './domains/journey-completion/journey-completion.module';

import { CommercialModule } from './domains/commercial/commercial.module';

import { FinancialModule } from './domains/financial/financial.module';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaModule } from './infrastructure/database/prisma/prisma.module';

import { EventsModule } from './infrastructure/events/events.module';

import { LoggingModule } from './infrastructure/logging/winston/logging.module';

import { SecurityModule } from './infrastructure/security/security.module';

import { HttpModule } from './infrastructure/http/http.module';

// =============================================================================
// Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================

  imports: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    // -------------------------------------------------------------------------
    // Database
    // -------------------------------------------------------------------------

    PrismaModule,

    // -------------------------------------------------------------------------
    // Domain events
    // -------------------------------------------------------------------------

    EventsModule,

    // -------------------------------------------------------------------------
    // Logging
    // -------------------------------------------------------------------------

    LoggingModule,

    // -------------------------------------------------------------------------
    // Security
    // -------------------------------------------------------------------------

    SecurityModule,

    // -------------------------------------------------------------------------
    // HTTP
    // -------------------------------------------------------------------------
    //
    // Provides cross-cutting HTTP infrastructure:
    //
    // - global exception handling;
    // - domain exception → HTTP status translation.
    //
    // -------------------------------------------------------------------------

    HttpModule,

    // =========================================================================
    // Domains
    // =========================================================================

    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    IdentityModule,

    // -------------------------------------------------------------------------
    // Authentication
    // -------------------------------------------------------------------------

    AuthModule,

    // -------------------------------------------------------------------------
    // Assets
    // -------------------------------------------------------------------------

    AssetsModule,

    // -------------------------------------------------------------------------
    // Social
    // -------------------------------------------------------------------------

    SocialModule,

    // -------------------------------------------------------------------------
    // Trust
    // -------------------------------------------------------------------------

    TrustModule,

    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    JourneyModule,

    // -------------------------------------------------------------------------
    // Journey Demand
    // -------------------------------------------------------------------------

    JourneyDemandModule,

    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    JourneyBookingModule,

    // -------------------------------------------------------------------------
    // Journey Boarding
    // -------------------------------------------------------------------------

    JourneyBoardingModule,

    // -------------------------------------------------------------------------
    // Journey Completion
    // -------------------------------------------------------------------------

    JourneyCompletionModule,

    // -------------------------------------------------------------------------
    // Commercial
    // -------------------------------------------------------------------------

    CommercialModule,

    // -------------------------------------------------------------------------
    // Financial
    // -------------------------------------------------------------------------

    FinancialModule,
  ],
})
export class AppModule {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AppModule;
