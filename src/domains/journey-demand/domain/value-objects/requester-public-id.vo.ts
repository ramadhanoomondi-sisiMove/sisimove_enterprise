// -----------------------------------------------------------------------------
// Requester Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the member who created the Journey Demand.
 *
 * This references Identity.publicId across the Identity bounded context.
 * It is intentionally not a Prisma relation.
 */
export class RequesterPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'IDN');
  }
}
