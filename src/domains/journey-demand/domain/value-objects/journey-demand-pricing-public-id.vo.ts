// -----------------------------------------------------------------------------
// Journey Demand Pricing Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Demand Pricing configuration.
 */
export class JourneyDemandPricingPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JDPR');
  }
}
