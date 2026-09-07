// -----------------------------------------------------------------------------
// Notification — Get Notifications By Recipient Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving Notification aggregates belonging to a
// specific recipient.
//
// The recipient public identity is an opaque reference to Identity.publicId.
//
// The query handler delegates persistence filtering to:
//
// NotificationRepository.findByRecipientPublicId()
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// This query does NOT:
//
// - load the Identity aggregate;
// - validate that the recipient exists;
// - validate recipient state;
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

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { NotificationMemberPublicId } from '../../domain/value-objects/notification-member-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetNotificationsByRecipientQuery implements Query {
  public constructor(
    /**
     * Public identity of the Notification recipient.
     *
     * This is an opaque reference to Identity.publicId.
     */
    public readonly recipientPublicId: NotificationMemberPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsByRecipientQuery;
