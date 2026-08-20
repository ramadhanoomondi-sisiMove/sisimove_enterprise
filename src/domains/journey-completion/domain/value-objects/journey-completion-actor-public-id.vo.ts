// -----------------------------------------------------------------------------
// Journey Completion Actor Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the member who performed a Journey Completion action.
 *
 * Represents the externally exposed identity of the actor responsible for
 * requesting completion, confirming completion, opening a dispute,
 * resolving a dispute, or performing another completion-related action.
 *
 * This is distinct from:
 * - the Journey Completion provider identity;
 * - the completion confirmation member identity;
 * - the dispute raiser identity;
 * - the Journey Booking identity.
 *
 * The actor may represent a member or an application-level actor depending
 * on the operation that produced the domain event.
 *
 * This is a cross-domain reference to Identity.publicId.
 *
 * It is intentionally NOT a Prisma relation.
 */
export class JourneyCompletionActorPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MEM');
  }
}
