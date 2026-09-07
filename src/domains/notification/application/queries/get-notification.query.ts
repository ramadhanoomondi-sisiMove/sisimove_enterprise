// -----------------------------------------------------------------------------
// Notification — Get Notification Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single Notification aggregate by its
// public identifier.
//
// The query handler is responsible for loading the complete Notification
// aggregate through NotificationRepository.findByPublicId().
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// This query does NOT:
//
// - modify the Notification aggregate;
// - modify NotificationEntity;
// - modify NotificationDeliveryEntity;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - validate recipient Identity existence;
// - publish domain events;
// - perform application orchestration.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { NotificationPublicId } from '../../domain/value-objects/notification-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetNotificationQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Notification aggregate.
     */
    public readonly publicId: NotificationPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationQuery;
