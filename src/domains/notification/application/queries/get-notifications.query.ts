// -----------------------------------------------------------------------------
// Notification — Get Notifications Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Notification aggregates.
//
// The query handler is responsible for loading Notification aggregates through
// NotificationRepository.findAll().
//
// Each returned aggregate contains:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// This query does NOT:
//
// - modify Notification aggregates;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - publish domain events;
// - apply notification policy;
// - validate recipient Identity existence.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetNotificationsQuery implements Query {
  public constructor() {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsQuery;
