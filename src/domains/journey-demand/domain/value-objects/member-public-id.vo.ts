// -----------------------------------------------------------------------------
// Member Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of a Journey Demand participant.
 *
 * This references Identity.publicId across the Identity bounded context.
 * It is intentionally not a Prisma relation.
 */
export class MemberPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'IDN');
  }
}
