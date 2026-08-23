// -----------------------------------------------------------------------------
// Financial Account Hold Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Account Hold.
 *
 * Represents the externally exposed identifier of a hold placed against
 * a Financial Account.
 *
 * The identifier is generated within the Financial domain and is safe
 * to use when referencing the hold across application, presentation,
 * integration, and other bounded contexts.
 */
export class FinancialAccountHoldPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FAH');
  }
}
