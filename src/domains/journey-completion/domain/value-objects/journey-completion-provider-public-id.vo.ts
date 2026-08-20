// -----------------------------------------------------------------------------
// Journey Completion Provider Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the provider responsible for the Journey.
 *
 * Represents the externally exposed identity of the provider associated
 * with a Journey Completion.
 *
 * This is a cross-domain reference to Identity.publicId.
 *
 * It is intentionally NOT a Prisma relation.
 */
export class JourneyCompletionProviderPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'MEM');
  }
}
