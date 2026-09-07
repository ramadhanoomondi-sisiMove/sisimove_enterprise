// -----------------------------------------------------------------------------
// Notification — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Notification bounded
// context.
//
// The Notification application layer depends on repository abstractions:
//
// - NotificationRepository;
// - NotificationPreferenceRepository.
//
// This provider file binds those abstractions to their concrete Prisma
// persistence implementations.
//
// -----------------------------------------------------------------------------
//
// Dependency direction:
//
//     Notification Application
//              │
//              ▼
//     NOTIFICATION_TOKENS
//              │
//              └── REPOSITORIES
//                       │
//                       ├── NOTIFICATION
//                       │       │
//                       │       ▼
//                       │   PrismaNotificationRepository
//                       │
//                       └── NOTIFICATION_PREFERENCE
//                               │
//                               ▼
//                       PrismaNotificationPreferenceRepository
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// The application layer resolves repository abstractions through:
//
//     NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION
//
//     NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION_PREFERENCE
//
// It does NOT import or depend on Prisma repository implementations.
//
// -----------------------------------------------------------------------------
//
// Concrete infrastructure implementations are provided here at the
// composition root.
//
// Domain behavior remains inside:
//
// - NotificationAggregate;
// - NotificationEntity;
// - NotificationDeliveryEntity;
// - NotificationPreferenceAggregate;
// - NotificationPreferenceEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains inside infrastructure.
//
// -----------------------------------------------------------------------------
//
// Notification aggregate boundary:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is persisted as part of the Notification
// aggregate boundary and is NOT registered as an independent aggregate
// repository here.
//
// -----------------------------------------------------------------------------
//
// Notification Preference aggregate boundary:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationPreferenceEntity is the aggregate root.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../../application/notification.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Persistence
// -----------------------------------------------------------------------------

import { PrismaNotificationRepository } from '../persistence/prisma/repositories/prisma-notification.repository';

import { PrismaNotificationPreferenceRepository } from '../persistence/prisma/repositories/prisma-notification-preference.repository';

// =============================================================================
// Providers
// =============================================================================

export const NOTIFICATION_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Notification Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION
  //
  // Infrastructure implementation:
  //
  //     PrismaNotificationRepository
  //
  // ---------------------------------------------------------------------------

  {
    provide: NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION,
    useClass: PrismaNotificationRepository,
  },

  // ===========================================================================
  // Notification Preference Repository
  // ===========================================================================
  //
  // Application abstraction:
  //
  //     NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION_PREFERENCE
  //
  // Infrastructure implementation:
  //
  //     PrismaNotificationPreferenceRepository
  //
  // ---------------------------------------------------------------------------

  {
    provide: NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION_PREFERENCE,
    useClass: PrismaNotificationPreferenceRepository,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default NOTIFICATION_PROVIDERS;
