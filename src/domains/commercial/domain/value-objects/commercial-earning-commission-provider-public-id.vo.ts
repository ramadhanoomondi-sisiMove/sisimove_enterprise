// -----------------------------------------------------------------------------
// Commercial Earning Commission Provider Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the provider associated with a Commercial Earning
 * Commission.
 *
 * Represents the externally exposed identity of the provider from the
 * Identity domain.
 *
 * This value object intentionally does not establish a persistence relation
 * to the Identity domain because the provider is owned by another bounded
 * context.
 */
export class CommercialEarningCommissionProviderPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'USR');
  }
}
