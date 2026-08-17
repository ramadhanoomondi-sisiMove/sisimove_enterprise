// -----------------------------------------------------------------------------
// Journey Demand Participant Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Demand Participant.
 */
export class JourneyDemandParticipantPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JDP');
  }
}
