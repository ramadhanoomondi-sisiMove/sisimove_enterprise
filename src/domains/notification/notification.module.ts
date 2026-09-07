// -----------------------------------------------------------------------------
// Notification — NestJS Module
// -----------------------------------------------------------------------------
//
// Central NestJS module for the Notification bounded context.
//
// Registered capabilities:
//
// - Notification aggregate;
// - Notification Delivery child entities;
// - Notification Preference aggregate;
// - notification lifecycle;
// - notification delivery lifecycle;
// - notification preference lifecycle;
// - notification queries;
// - notification delivery queries;
// - notification preference queries.
//
// The module wires:
//
// - REST controllers;
// - infrastructure repository providers;
// - application command handlers;
// - application query handlers.
//
// Domain behavior remains inside:
//
// - NotificationAggregate;
// - NotificationEntity;
// - NotificationDeliveryEntity;
// - NotificationPreferenceAggregate;
// - NotificationPreferenceEntity.
//
// Application handlers coordinate use cases and depend only on:
//
// - NotificationRepository;
// - NotificationPreferenceRepository.
//
// Infrastructure implements those abstractions through:
//
// - PrismaNotificationRepository;
// - PrismaNotificationPreferenceRepository.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundaries:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationDeliveryEntity is a child entity of NotificationAggregate and
// is NOT registered as an independent aggregate repository.
//
// -----------------------------------------------------------------------------
//
// Infrastructure boundary:
//
// Notification Application
//          │
//          ▼
//   NOTIFICATION_TOKENS
//          │
//          └── REPOSITORIES
//                  │
//                  ├── NOTIFICATION
//                  │       │
//                  │       ▼
//                  │   PrismaNotificationRepository
//                  │
//                  └── NOTIFICATION_PREFERENCE
//                          │
//                          ▼
//                  PrismaNotificationPreferenceRepository
//
// -----------------------------------------------------------------------------
//
// Prisma:
//
// PrismaModule provides PrismaService to the concrete Notification Prisma
// repositories.
//
// The repositories remain hidden behind:
//
//     NOTIFICATION_TOKENS.REPOSITORIES.*
//
// -----------------------------------------------------------------------------
//
// Application command handlers:
//
// Notification:
//
// - CreateNotificationHandler
// - SendNotificationHandler
// - ReadNotificationHandler
// - FailNotificationHandler
// - CancelNotificationHandler
//
// Notification Delivery:
//
// - CreateNotificationDeliveryHandler
// - SendNotificationDeliveryHandler
// - DeliverNotificationDeliveryHandler
// - FailNotificationDeliveryHandler
// - CancelNotificationDeliveryHandler
//
// Notification Preference:
//
// - CreateNotificationPreferenceHandler
// - UpdateNotificationPreferenceHandler
//
// -----------------------------------------------------------------------------
//
// Application query handlers:
//
// Notification:
//
// - GetNotificationHandler
// - GetNotificationsHandler
// - GetNotificationsByRecipientHandler
// - GetNotificationsByReferenceHandler
// - GetNotificationsByEventHandler
//
// Notification Delivery:
//
// - GetNotificationDeliveriesHandler
// - GetNotificationDeliveriesByNotificationHandler
//
// Notification Preference:
//
// - GetNotificationPreferenceHandler
// - GetNotificationPreferenceByMemberHandler
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
// Presentation
//      │
//      ▼
// Application
//      │
//      ├── Notification repository abstractions
//      │
//      ▼
// Infrastructure DI
//      │
//      ├── PrismaNotificationRepository
//      └── PrismaNotificationPreferenceRepository
//
// The application layer does not import concrete infrastructure
// implementations.
//
// -----------------------------------------------------------------------------
//
// Module boundary:
//
// NotificationModule owns:
//
// - controller registration;
// - repository registration;
// - command-handler registration;
// - query-handler registration.
//
// Concrete Prisma repositories remain private to NotificationModule.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Handler registrations MUST use the exact tokens defined in:
//
//     application/notification.tokens.ts
//
// No additional or inferred tokens are introduced here.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Module } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure — Database
// -----------------------------------------------------------------------------

import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';

// -----------------------------------------------------------------------------
// Presentation — Controllers
// -----------------------------------------------------------------------------

import {
  NotificationsController,
  NotificationPreferencesController,
} from './presentation/rest/controllers';

// -----------------------------------------------------------------------------
// Infrastructure — Dependency Injection
// -----------------------------------------------------------------------------

import { NOTIFICATION_PROVIDERS } from './infrastructure/dependency-injection/notification.providers';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from './application/notification.tokens';

// -----------------------------------------------------------------------------
// Application — Command Handlers
// -----------------------------------------------------------------------------

import {
  CancelNotificationDeliveryHandler,
  CancelNotificationHandler,
  CreateNotificationDeliveryHandler,
  CreateNotificationHandler,
  CreateNotificationPreferenceHandler,
  DeliverNotificationDeliveryHandler,
  FailNotificationDeliveryHandler,
  FailNotificationHandler,
  ReadNotificationHandler,
  SendNotificationDeliveryHandler,
  SendNotificationHandler,
  UpdateNotificationPreferenceHandler,
} from './application/command-handlers';

// -----------------------------------------------------------------------------
// Application — Query Handlers
// -----------------------------------------------------------------------------

import {
  GetNotificationDeliveriesByNotificationHandler,
  GetNotificationDeliveriesHandler,
  GetNotificationHandler,
  GetNotificationsByEventHandler,
  GetNotificationsByRecipientHandler,
  GetNotificationsByReferenceHandler,
  GetNotificationsHandler,
  GetNotificationPreferenceByMemberHandler,
  GetNotificationPreferenceHandler,
} from './application/query-handlers';

// =============================================================================
// Notification Module
// =============================================================================

@Module({
  // ===========================================================================
  // Imports
  // ===========================================================================
  //
  // PrismaModule provides PrismaService to the concrete Notification Prisma
  // repositories registered through NOTIFICATION_PROVIDERS.
  //
  // ---------------------------------------------------------------------------

  imports: [PrismaModule],

  // ===========================================================================
  // Controllers
  // ===========================================================================
  //
  // Notification REST transport boundary.
  //
  // Controllers contain no domain business rules.
  //
  // ---------------------------------------------------------------------------

  controllers: [NotificationsController, NotificationPreferencesController],

  // ===========================================================================
  // Providers
  // ===========================================================================
  //
  // Infrastructure repository bindings are supplied by
  // NOTIFICATION_PROVIDERS.
  //
  // Application handlers are bound to their exact Notification DI tokens.
  //
  // ---------------------------------------------------------------------------

  providers: [
    // =========================================================================
    // Infrastructure
    // =========================================================================

    ...NOTIFICATION_PROVIDERS,

    // =========================================================================
    // Notification — Command Handlers
    // =========================================================================

    {
      provide: NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION,
      useClass: CreateNotificationHandler,
    },

    {
      provide: NOTIFICATION_TOKENS.COMMAND_HANDLERS.SEND_NOTIFICATION,
      useClass: SendNotificationHandler,
    },

    {
      provide: NOTIFICATION_TOKENS.COMMAND_HANDLERS.READ_NOTIFICATION,
      useClass: ReadNotificationHandler,
    },

    {
      provide: NOTIFICATION_TOKENS.COMMAND_HANDLERS.FAIL_NOTIFICATION,
      useClass: FailNotificationHandler,
    },

    {
      provide: NOTIFICATION_TOKENS.COMMAND_HANDLERS.CANCEL_NOTIFICATION,
      useClass: CancelNotificationHandler,
    },

    // =========================================================================
    // Notification Delivery — Command Handlers
    // =========================================================================

    {
      provide:
        NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION_DELIVERY,
      useClass: CreateNotificationDeliveryHandler,
    },

    {
      provide: NOTIFICATION_TOKENS.COMMAND_HANDLERS.SEND_NOTIFICATION_DELIVERY,
      useClass: SendNotificationDeliveryHandler,
    },

    {
      provide:
        NOTIFICATION_TOKENS.COMMAND_HANDLERS.DELIVER_NOTIFICATION_DELIVERY,
      useClass: DeliverNotificationDeliveryHandler,
    },

    {
      provide: NOTIFICATION_TOKENS.COMMAND_HANDLERS.FAIL_NOTIFICATION_DELIVERY,
      useClass: FailNotificationDeliveryHandler,
    },

    {
      provide:
        NOTIFICATION_TOKENS.COMMAND_HANDLERS.CANCEL_NOTIFICATION_DELIVERY,
      useClass: CancelNotificationDeliveryHandler,
    },

    // =========================================================================
    // Notification Preference — Command Handlers
    // =========================================================================

    {
      provide:
        NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION_PREFERENCE,
      useClass: CreateNotificationPreferenceHandler,
    },

    {
      provide:
        NOTIFICATION_TOKENS.COMMAND_HANDLERS.UPDATE_NOTIFICATION_PREFERENCE,
      useClass: UpdateNotificationPreferenceHandler,
    },

    // =========================================================================
    // Notification — Query Handlers
    // =========================================================================

    {
      provide: NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION,
      useClass: GetNotificationHandler,
    },

    {
      provide: NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS,
      useClass: GetNotificationsHandler,
    },

    {
      provide:
        NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_RECIPIENT,
      useClass: GetNotificationsByRecipientHandler,
    },

    {
      provide:
        NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_REFERENCE,
      useClass: GetNotificationsByReferenceHandler,
    },

    {
      provide: NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_EVENT,
      useClass: GetNotificationsByEventHandler,
    },

    // =========================================================================
    // Notification Delivery — Query Handlers
    // =========================================================================

    {
      provide: NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION_DELIVERIES,
      useClass: GetNotificationDeliveriesHandler,
    },

    {
      provide:
        NOTIFICATION_TOKENS.QUERY_HANDLERS
          .GET_NOTIFICATION_DELIVERIES_BY_NOTIFICATION,
      useClass: GetNotificationDeliveriesByNotificationHandler,
    },

    // =========================================================================
    // Notification Preference — Query Handlers
    // =========================================================================

    {
      provide: NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION_PREFERENCE,
      useClass: GetNotificationPreferenceHandler,
    },

    {
      provide:
        NOTIFICATION_TOKENS.QUERY_HANDLERS
          .GET_NOTIFICATION_PREFERENCE_BY_MEMBER,
      useClass: GetNotificationPreferenceByMemberHandler,
    },
  ],

  // ===========================================================================
  // Exports
  // ===========================================================================
  //
  // Expose application-facing tokens only.
  //
  // Concrete Prisma repositories remain private to NotificationModule.
  //
  // ---------------------------------------------------------------------------

  exports: [
    // =========================================================================
    // Repositories
    // =========================================================================

    NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION,

    NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION_PREFERENCE,

    // =========================================================================
    // Notification — Command Handlers
    // =========================================================================

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.SEND_NOTIFICATION,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.READ_NOTIFICATION,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.FAIL_NOTIFICATION,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.CANCEL_NOTIFICATION,

    // =========================================================================
    // Notification Delivery — Command Handlers
    // =========================================================================

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION_DELIVERY,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.SEND_NOTIFICATION_DELIVERY,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.DELIVER_NOTIFICATION_DELIVERY,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.FAIL_NOTIFICATION_DELIVERY,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.CANCEL_NOTIFICATION_DELIVERY,

    // =========================================================================
    // Notification Preference — Command Handlers
    // =========================================================================

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.CREATE_NOTIFICATION_PREFERENCE,

    NOTIFICATION_TOKENS.COMMAND_HANDLERS.UPDATE_NOTIFICATION_PREFERENCE,

    // =========================================================================
    // Notification — Query Handlers
    // =========================================================================

    NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION,

    NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS,

    NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_RECIPIENT,

    NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_REFERENCE,

    NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATIONS_BY_EVENT,

    // =========================================================================
    // Notification Delivery — Query Handlers
    // =========================================================================

    NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION_DELIVERIES,

    NOTIFICATION_TOKENS.QUERY_HANDLERS
      .GET_NOTIFICATION_DELIVERIES_BY_NOTIFICATION,

    // =========================================================================
    // Notification Preference — Query Handlers
    // =========================================================================

    NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION_PREFERENCE,

    NOTIFICATION_TOKENS.QUERY_HANDLERS.GET_NOTIFICATION_PREFERENCE_BY_MEMBER,
  ],
})
export class NotificationModule {}

// =============================================================================
// Default Export
// =============================================================================

export default NotificationModule;
