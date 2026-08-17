// -----------------------------------------------------------------------------
// Journey Demand Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey Demand aggregate.
 *
 * This represents the externally exposed `publicId`, not the internal
 * persistence identity (`id`).
 */
export class JourneyDemandPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JDM');
  }
}
