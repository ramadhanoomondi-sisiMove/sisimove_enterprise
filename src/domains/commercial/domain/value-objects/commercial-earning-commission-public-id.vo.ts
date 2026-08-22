// -----------------------------------------------------------------------------
// Commercial Earning Commission Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Commercial Earning Commission.
 *
 * Represents the externally exposed identifier of a commission assessed
 * against a provider earning.
 *
 * The public identifier is intentionally distinct from the internal
 * persistence identifier represented by UniqueEntityId.
 */
export class CommercialEarningCommissionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'CEC');
  }
}
