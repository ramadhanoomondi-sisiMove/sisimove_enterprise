// -----------------------------------------------------------------------------
// Application — Root NestJS Module
// -----------------------------------------------------------------------------
//
// Central composition root for the application.
//
// AppModule is responsible only for composing:
//
// - cross-cutting infrastructure modules;
// - bounded-context / domain modules.
//
// AppModule does not implement application behavior.
//
// Each domain module owns its own:
//
// - domain model;
// - aggregates and entities;
// - value objects;
// - application commands and queries;
// - handlers;
// - repository abstractions;
// - infrastructure adapters;
// - presentation adapters.
//
// Cross-cutting infrastructure modules provide technical capabilities shared
// across the application.
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
// └── Authentication / authorization security infrastructure
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
// └── Identity
//     ├── Identity
//     ├── Verification
//     ├── Role
//     ├── Permission
//     └── RolePermission
//
// AuthModule
// └── Authentication
//     ├── Authentication
//     ├── Session
//     ├── Device
//     ├── Recovery
//     └── OTP Challenge
//
// AssetsModule
// └── Asset management
//
// SocialModule
// └── Social / community capabilities
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
// AccountingModule
// └── Accounting capabilities
//     ├── Accounting Account
//     ├── Accounting Period
//     └── Accounting Journal
//
// MessagingModule
// └── Messaging capabilities
//     ├── Messaging Conversation
//     ├── Messaging Conversation Participant
//     └── Messaging Message
//
// -----------------------------------------------------------------------------
//
// Composition:
//
//                              AppModule
//                                  │
//              ┌───────────────────┴───────────────────┐
//              │                                       │
//        Infrastructure                            Domains
//              │                                       │
//      ┌───────┼────────┐                    ┌─────────┼──────────────┐
//      │       │        │                    │         │              │
//   Prisma   Events   Logging             Identity    Auth          Assets
//      │       │        │
//   Security  │      HttpModule
//                         │
//                 GlobalExceptionFilter
//                         │
//              DomainExceptionHttpStatusMapper
//                         │
//                         ├── Social
//                         ├── Trust
//                         ├── Journey
//                         ├── JourneyDemand
//                         ├── JourneyBooking
//                         ├── JourneyBoarding
//                         ├── JourneyCompletion
//                         ├── Commercial
//                         ├── Financial
//                         ├── Accounting
//                         └── Messaging
//
// -----------------------------------------------------------------------------
//
// Dependency composition:
//
// AppModule
//     │
//     ├── Infrastructure modules
//     │      │
//     │      ├── PrismaModule
//     │      ├── EventsModule
//     │      ├── LoggingModule
//     │      ├── SecurityModule
//     │      └── HttpModule
//     │
//     └── Domain modules
//            │
//            ├── IdentityModule
//            ├── AuthModule
//            ├── AssetsModule
//            ├── SocialModule
//            ├── TrustModule
//            ├── JourneyModule
//            ├── JourneyDemandModule
//            ├── JourneyBookingModule
//            ├── JourneyBoardingModule
//            ├── JourneyCompletionModule
//            ├── CommercialModule
//            ├── FinancialModule
//            ├── AccountingModule
//            └── MessagingModule
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// AppModule contains composition only.
//
// It does NOT contain:
//
// - domain business rules;
// - application use-case logic;
// - command handlers;
// - query handlers;
// - repository implementations;
// - controller logic;
// - persistence logic;
// - storage logic;
// - HTTP exception mapping logic.
//
// Those responsibilities remain inside their respective modules.
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
// The HTTP translation mechanism belongs to HttpModule, not AppModule.
//
// AppModule merely composes HttpModule into the application.
//
// -----------------------------------------------------------------------------
//
// Infrastructure dependency direction:
//
// Domain/Application
//       │
//       ▼
// Infrastructure abstractions / tokens
//       │
//       ▼
// Infrastructure implementations
//
// AppModule does not manually wire individual repositories or services.
// Each bounded context owns its internal dependency-injection composition.
//
// -----------------------------------------------------------------------------
//
// Module boundary:
//
// AppModule should remain intentionally thin.
//
// It should contain:
//
// - imports;
//
// and should normally contain no:
//
// - controllers;
// - providers;
// - exports.
//
// Individual modules are responsible for exposing only the capabilities that
// other modules legitimately need.
//
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// =============================================================================
// Infrastructure
// =============================================================================

// -----------------------------------------------------------------------------
// Database
// -----------------------------------------------------------------------------

import { PrismaModule } from './infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { EventsModule } from './infrastructure/events/events.module';

// -----------------------------------------------------------------------------
// Logging
// -----------------------------------------------------------------------------

import { LoggingModule } from './infrastructure/logging/winston/logging.module';

// -----------------------------------------------------------------------------
// Security
// -----------------------------------------------------------------------------

import { SecurityModule } from './infrastructure/security/security.module';

// -----------------------------------------------------------------------------
// HTTP
// -----------------------------------------------------------------------------

import { HttpModule } from './infrastructure/http/http.module';

// =============================================================================
// Domains
// =============================================================================

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

import { IdentityModule } from './domains/identity/identity.module';

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import { AuthModule } from './domains/auth/auth.module';

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

import { AssetsModule } from './domains/assets/assets.module';

// -----------------------------------------------------------------------------
// Social
// -----------------------------------------------------------------------------

import { SocialModule } from './domains/social/social.module';

// -----------------------------------------------------------------------------
// Trust
// -----------------------------------------------------------------------------

import { TrustModule } from './domains/trust/trust.module';

// -----------------------------------------------------------------------------
// Journey
// -----------------------------------------------------------------------------

import { JourneyModule } from './domains/journey/journey.module';

// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandModule } from './domains/journey-demand/journey-demand.module';

// -----------------------------------------------------------------------------
// Journey Booking
// -----------------------------------------------------------------------------

import { JourneyBookingModule } from './domains/journey-booking/journey-booking.module';

// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingModule } from './domains/journey-boarding/journey-boarding.module';

// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

import { JourneyCompletionModule } from './domains/journey-completion/journey-completion.module';

// -----------------------------------------------------------------------------
// Commercial
// -----------------------------------------------------------------------------

import { CommercialModule } from './domains/commercial/commercial.module';

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialModule } from './domains/financial/financial.module';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { AccountingModule } from './domains/accounting/accounting.module';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import { MessagingModule } from './domains/messaging/messaging.module';

// =============================================================================
// App Module
// =============================================================================

@Module({
  imports: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    // -------------------------------------------------------------------------
    // Database
    // -------------------------------------------------------------------------
    //
    // Provides the application's Prisma infrastructure.
    //
    // Domain modules consume Prisma through their own infrastructure adapters.
    //
    // -------------------------------------------------------------------------

    PrismaModule,

    // -------------------------------------------------------------------------
    // Domain Events
    // -------------------------------------------------------------------------
    //
    // Provides shared domain-event infrastructure:
    //
    // - EventBus;
    // - EventStore;
    // - EventPublisher.
    //
    // Individual domains publish their own domain events through the
    // infrastructure abstraction.
    //
    // -------------------------------------------------------------------------

    EventsModule,

    // -------------------------------------------------------------------------
    // Logging
    // -------------------------------------------------------------------------

    LoggingModule,

    // -------------------------------------------------------------------------
    // Security
    // -------------------------------------------------------------------------
    //
    // Provides cross-cutting authentication and authorization infrastructure.
    //
    // -------------------------------------------------------------------------

    SecurityModule,

    // -------------------------------------------------------------------------
    // HTTP
    // -------------------------------------------------------------------------
    //
    // Provides transport-level HTTP infrastructure:
    //
    // - global exception filtering;
    // - domain/application exception translation;
    // - HTTP-specific error handling.
    //
    // AppModule composes this infrastructure but does not implement it.
    //
    // -------------------------------------------------------------------------

    HttpModule,

    // =========================================================================
    // Bounded Contexts / Domains
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

    // -------------------------------------------------------------------------
    // Accounting
    // -------------------------------------------------------------------------
    //
    // Provides the Accounting bounded context:
    //
    // - Accounting Account;
    // - Accounting Period;
    // - Accounting Journal.
    //
    // Accounting owns its own application handlers, repositories,
    // persistence adapters, and REST controllers.
    //
    // -------------------------------------------------------------------------

    AccountingModule,

    // -------------------------------------------------------------------------
    // Messaging
    // -------------------------------------------------------------------------
    //
    // Provides the Messaging bounded context:
    //
    // - Messaging Conversation;
    // - Messaging Conversation Participant;
    // - Messaging Message.
    //
    // Messaging owns its own application handlers, repositories,
    // persistence adapters, and REST controllers.
    //
    // -------------------------------------------------------------------------

    MessagingModule,
  ],
})
export class AppModule {}

// =============================================================================
// Default Export
// =============================================================================

export default AppModule;
