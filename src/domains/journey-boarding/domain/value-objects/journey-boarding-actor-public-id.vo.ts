// -----------------------------------------------------------------------------
// Journey Boarding Actor Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the member who performed a Journey Boarding action.
 *
 * Represents the externally exposed identity of the actor responsible
 * for recording or triggering a boarding event.
 *
 * This is distinct from:
 * - the Journey Boarding participant identity;
 * - the participant's member identity;
 * - the Journey Booking identity.
 *
 * The actor is optional because a domain event may be produced by the
 * system rather than directly by a member.
 */
export class JourneyBoardingActorPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MEM');
  }
}
