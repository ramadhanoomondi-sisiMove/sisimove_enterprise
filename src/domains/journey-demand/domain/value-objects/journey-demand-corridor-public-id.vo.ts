// -----------------------------------------------------------------------------
// Journey Demand Corridor Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Journey Demand Corridor.
 *
 * This represents the externally exposed `publicId`, not the internal
 * persistence identity (`id`).
 */
export class JourneyDemandCorridorPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JDC');
  }
}
