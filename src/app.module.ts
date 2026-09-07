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
// Each bounded-context module owns its own:
//
// - domain model;
// - aggregates and entities;
// - value objects;
// - application commands and queries;
// - handlers;
// - repository abstractions;
// - infrastructure adapters;
// - presentation adapters;
//
// Cross-cutting infrastructure modules provide technical capabilities shared
// across the application.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Infrastructure
// =============================================================================
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
// =============================================================================
//
// Bounded Contexts
// =============================================================================
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
// NotificationModule
// └── Notification capabilities
//     ├── Notification
//     ├── Notification Delivery
//     └── Notification Preference
//
// SupportModule
// └── Support capabilities
//     ├── Support Case
//     ├── Support Case Participant
//     ├── Support Case Message
//     ├── Support Case Note
//     ├── Support Case Evidence
//     └── Support Case Resolution
//
// -----------------------------------------------------------------------------
//
// Support aggregate boundary:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// Child entities remain owned by SupportCaseAggregate and are not independently
// composed by AppModule.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Composition
// =============================================================================
//
//                              AppModule
//                                  │
//              ┌───────────────────┴───────────────────┐
//              │                                       │
//        Infrastructure                            Domains
//              │                                       │
//      ┌───────┼───────────────┐             ┌─────────┼───────────────┐
//      │       │       │       │             │         │               │
//   Prisma  Events  Logging  Security     Identity   Auth           Assets
//                              │
//                         HttpModule
//                              │
//                   GlobalExceptionFilter
//                              │
//                 DomainExceptionHttpStatusMapper
//                              │
//                              ├── Social
//                              ├── Trust
//                              ├── Journey
//                              ├── JourneyDemand
//                              ├── JourneyBooking
//                              ├── JourneyBoarding
//                              ├── JourneyCompletion
//                              ├── Commercial
//                              ├── Financial
//                              ├── Accounting
//                              ├── Messaging
//                              ├── Notification
//                              └── Support
//
// -----------------------------------------------------------------------------

// =============================================================================
// Dependency Composition
// =============================================================================
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
//     └── Bounded-context modules
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
//            ├── MessagingModule
//            ├── NotificationModule
//            └── SupportModule
//
// -----------------------------------------------------------------------------

// =============================================================================
// Dependency Direction
// =============================================================================
//
// AppModule
//     │
//     ├── Infrastructure modules
//     │
//     └── Bounded-context modules
//             │
//             ├── Domain
//             ├── Application
//             ├── Infrastructure
//             └── Presentation
//
// AppModule performs composition only.
//
// Individual bounded contexts own their internal dependency-injection
// composition.
//
// -----------------------------------------------------------------------------

// =============================================================================
// IMPORTANT
// =============================================================================
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

// =============================================================================
// Exception Flow
// =============================================================================
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

// =============================================================================
// Infrastructure Dependency Direction
// =============================================================================
//
// Domain/Application
//       │
//       ▼
// Repository / infrastructure abstractions
//       │
//       ▼
// Infrastructure implementations
//
// AppModule does not manually wire individual repositories or services.
//
// Each bounded context owns its internal dependency-injection composition.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Module Boundary
// =============================================================================
//
// AppModule should remain intentionally thin.
//
// It should contain:
//
// - imports;
//
// and normally contain no:
//
// - controllers;
// - providers;
// - exports.
//
// Individual modules are responsible for exposing only the capabilities that
// other modules legitimately need.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
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
// Bounded Contexts / Domains
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

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

import { NotificationModule } from './domains/notification/notification.module';

// -----------------------------------------------------------------------------
// Support
// -----------------------------------------------------------------------------

import { SupportModule } from './domains/support/support.module';

// =============================================================================
// App Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================
  //
  // AppModule composes infrastructure and bounded-context modules.
  //
  // No individual handlers, repositories, controllers, or services are wired
  // here. Each bounded context owns its internal composition.
  //
  // ---------------------------------------------------------------------------

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
    // Individual bounded contexts publish their own domain events through the
    // shared event infrastructure.
    //
    // -------------------------------------------------------------------------

    EventsModule,

    // -------------------------------------------------------------------------
    // Logging
    // -------------------------------------------------------------------------
    //
    // Provides shared application logging infrastructure.
    //
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
    //
    // Provides commercial rules and platform monetization capabilities.
    //
    // -------------------------------------------------------------------------

    CommercialModule,

    // -------------------------------------------------------------------------
    // Financial
    // -------------------------------------------------------------------------
    //
    // Provides financial capabilities and wallet-related financial operations.
    //
    // Financial owns its own:
    //
    // - aggregates;
    // - application handlers;
    // - repository abstractions;
    // - persistence adapters;
    // - REST controllers.
    //
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
    // Accounting owns its own:
    //
    // - aggregates;
    // - application handlers;
    // - repository abstractions;
    // - persistence adapters;
    // - REST controllers.
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
    // Messaging owns its own:
    //
    // - aggregates;
    // - application handlers;
    // - repository abstractions;
    // - persistence adapters;
    // - REST controllers.
    //
    // -------------------------------------------------------------------------

    MessagingModule,

    // -------------------------------------------------------------------------
    // Notification
    // -------------------------------------------------------------------------
    //
    // Provides the Notification bounded context:
    //
    // - Notification;
    // - Notification Delivery;
    // - Notification Preference.
    //
    // Notification owns its own:
    //
    // - aggregates;
    // - entities;
    // - value objects;
    // - commands;
    // - queries;
    // - command handlers;
    // - query handlers;
    // - repository abstractions;
    // - Prisma repositories;
    // - REST controllers.
    //
    // NotificationDeliveryEntity remains a child entity of
    // NotificationAggregate and is not registered independently here.
    //
    // -------------------------------------------------------------------------

    NotificationModule,

    // -------------------------------------------------------------------------
    // Support
    // -------------------------------------------------------------------------
    //
    // Provides the Support bounded context:
    //
    // - Support Case;
    // - Support Case Participant;
    // - Support Case Message;
    // - Support Case Note;
    // - Support Case Evidence;
    // - Support Case Resolution.
    //
    // Support owns its own:
    //
    // - aggregate;
    // - entities;
    // - value objects;
    // - commands;
    // - queries;
    // - command handlers;
    // - query handlers;
    // - repository abstractions;
    // - Prisma repositories;
    // - REST controllers.
    //
    // SupportCaseEntity is the aggregate root.
    //
    // Child entities remain owned by SupportCaseAggregate and are therefore
    // not registered independently here.
    //
    // The Support module owns its internal dependency-injection composition.
    //
    // -------------------------------------------------------------------------

    SupportModule,
  ],
})
export class AppModule {}

// =============================================================================
// Default Export
// =============================================================================

export default AppModule;
