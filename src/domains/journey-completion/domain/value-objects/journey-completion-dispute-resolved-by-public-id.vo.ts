// -----------------------------------------------------------------------------
// Journey Completion Dispute Resolved By Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the member who resolved a Journey Completion dispute.
 *
 * Represents the externally exposed identity of the actor responsible for
 * resolving or rejecting a dispute.
 *
 * This is a cross-domain reference to Identity.publicId.
 *
 * It is intentionally NOT a Prisma relation.
 */
export class JourneyCompletionDisputeResolvedByPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MEM');
  }
}
