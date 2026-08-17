// -----------------------------------------------------------------------------
// Journey Demand Schedule Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Demand Schedule.
 */
export class JourneyDemandSchedulePublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JDS');
  }
}
