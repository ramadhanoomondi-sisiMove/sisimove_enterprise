// -----------------------------------------------------------------------------
// Journey Completion Journey Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey associated with a Journey Completion.
 *
 * Represents the externally exposed identity of the Journey whose completion
 * is being requested, confirmed, disputed, or cancelled.
 *
 * This is a cross-domain reference to Journey.publicId.
 *
 * It is intentionally NOT a Prisma relation.
 */
export class JourneyCompletionJourneyPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JNY');
  }
}
