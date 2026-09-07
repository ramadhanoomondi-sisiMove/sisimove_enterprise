// -----------------------------------------------------------------------------
// Notification — Get Notification Deliveries By Notification Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Notification Delivery child entities
// belonging to a specific Notification aggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity remains owned by NotificationAggregate.
//
// The notification public identity is therefore the aggregate-root identity
// used to scope the delivery query.
//
// IMPORTANT:
//
// The current NotificationRepository contract supplied for this domain does
// not expose a delivery-specific query method.
//
// The preferred implementation is to retrieve the complete Notification
// aggregate and read its deliveries.
//
// If a dedicated persistence query is later introduced, it must remain a
// Notification-domain infrastructure optimization and must not turn
// NotificationDeliveryEntity into an independent aggregate.
//
// This query does NOT:
//
// - load NotificationDeliveryEntity as an independent aggregate;
// - modify deliveries;
// - modify the Notification aggregate;
// - access Prisma;
// - perform authorization;
// - communicate with providers;
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

export class GetNotificationDeliveriesByNotificationQuery implements Query {
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

export default GetNotificationDeliveriesByNotificationQuery;
