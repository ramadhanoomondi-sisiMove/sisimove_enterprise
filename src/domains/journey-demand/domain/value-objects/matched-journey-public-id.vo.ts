// -----------------------------------------------------------------------------
// Matched Journey Public ID
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Journey aggregate matched to this demand.
 *
 * This references Journey.publicId across the Journey bounded context.
 * It is intentionally not a Prisma relation.
 */
export class MatchedJourneyPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JNY');
  }
}
