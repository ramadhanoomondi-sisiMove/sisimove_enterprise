// -----------------------------------------------------------------------------
// Journey Demand Capacity Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Demand Capacity.
 */
export class JourneyDemandCapacityPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JDCAP');
  }
}
