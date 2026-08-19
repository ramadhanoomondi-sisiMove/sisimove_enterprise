// -----------------------------------------------------------------------------
// Journey Boarding Participant Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Boarding participant.
 *
 * Represents the externally exposed `publicId` of a participant
 * within a Journey Boarding aggregate.
 *
 * This is distinct from the internal persistence identity (`id`)
 * and from the participant's member identity.
 */
export class JourneyBoardingParticipantPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JBP');
  }
}
