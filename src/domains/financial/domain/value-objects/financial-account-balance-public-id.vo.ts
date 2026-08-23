// -----------------------------------------------------------------------------
// Financial Account Balance Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Account Balance.
 *
 * Represents the externally exposed identifier of the balance associated
 * with a Financial Account.
 *
 * The persistence identifier of the balance remains internal to the
 * infrastructure layer. This value object represents only the public
 * domain identity.
 */
export class FinancialAccountBalancePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Account Balance public identifier.
   *
   * When no value is supplied, a new public identifier is generated
   * using the Financial Account Balance-specific `FAB` prefix.
   */
  public constructor(value?: string) {
    super(value, 'FAB');
  }
}
