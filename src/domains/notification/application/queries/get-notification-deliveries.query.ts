// -----------------------------------------------------------------------------
// Notification — Get Notification Deliveries Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the deliveries belonging to a Notification
// aggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is a child entity and is NOT an independent
// aggregate.
//
// The query handler should therefore retrieve the Notification aggregate and
// expose its delivery collection.
//
// This query does NOT:
//
// - treat NotificationDeliveryEntity as an independent aggregate;
// - modify the Notification aggregate;
// - modify NotificationDeliveryEntity;
// - access Prisma;
// - perform authorization;
// - communicate with delivery providers;
// - send notifications;
// - publish domain events.
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

export class GetNotificationDeliveriesQuery implements Query {
  public constructor(
    /**
     * Public identifier of the Notification aggregate whose deliveries
     * should be retrieved.
     */
    public readonly notificationPublicId: NotificationPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationDeliveriesQuery;
