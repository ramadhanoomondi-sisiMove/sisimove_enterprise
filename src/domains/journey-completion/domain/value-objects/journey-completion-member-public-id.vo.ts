// -----------------------------------------------------------------------------
// Journey Completion Member Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a member participating in Journey Completion.
 *
 * Represents the externally exposed identity of the member who confirms
 * or otherwise participates in the completion process.
 *
 * This is a cross-domain reference to Identity.publicId.
 *
 * It is intentionally NOT a Prisma relation.
 */
export class JourneyCompletionMemberPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MEM');
  }
}
