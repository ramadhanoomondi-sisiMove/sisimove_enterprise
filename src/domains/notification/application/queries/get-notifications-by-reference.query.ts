// -----------------------------------------------------------------------------
// Notification — Get Notifications By Reference Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Notification aggregates associated with a
// referenced domain resource.
//
// Reference:
//
// - referenceType
// - referencePublicId
//
// Examples of referenced resources may include Journey, Booking, Financial,
// Support, or other domain resources.
//
// These identifiers remain opaque to the Notification domain.
//
// IMPORTANT:
//
// The current NotificationRepository contract supplied for this domain does
// not yet expose a findByReference() method.
//
// This query therefore defines the application input required for the
// reference-based use case, while the corresponding repository method must be
// added before its query handler can be implemented.
//
// This query does NOT:
//
// - load the referenced aggregate;
// - validate referenced resource existence;
// - interpret referenceType business semantics;
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

export class GetNotificationsByReferenceQuery implements Query {
  public constructor(
    /**
     * Type of the referenced domain resource.
     *
     * This remains an opaque notification reference.
     */
    public readonly referenceType: string,

    /**
     * Public identity of the referenced domain resource.
     *
     * This remains an opaque notification reference.
     */
    public readonly referencePublicId: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsByReferenceQuery;
