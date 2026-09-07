// -----------------------------------------------------------------------------
// Notification — Get Notifications By Event Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Notification aggregates generated from a
// specific source event.
//
// Source event:
//
// - eventType
// - eventPublicId
//
// The event identity remains opaque to the Notification domain.
//
// IMPORTANT:
//
// The current NotificationRepository contract supplied for this domain does
// not yet expose a findByEvent() method.
//
// This query therefore defines the application input required for the
// event-based use case, while the corresponding repository method must be
// added before its query handler can be implemented.
//
// This query does NOT:
//
// - load the source event aggregate;
// - validate the source event;
// - interpret eventType business semantics;
// - modify Notification aggregates;
// - access Prisma;
// - perform authorization;
// - publish domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetNotificationsByEventQuery implements Query {
  public constructor(
    /**
     * Type/name of the source event.
     */
    public readonly eventType: string,

    /**
     * Public identity of the source event.
     */
    public readonly eventPublicId: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsByEventQuery;
