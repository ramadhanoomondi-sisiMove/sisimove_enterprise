// -----------------------------------------------------------------------------
// Financial Account Withdrawal Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Account Withdrawal.
 *
 * Represents the externally exposed identifier of a withdrawal request
 * initiated against a Financial Account.
 *
 * The identifier is intentionally independent from the internal persistence
 * identifier and is safe to expose across application, presentation,
 * integration, and cross-domain boundaries.
 */
export class FinancialAccountWithdrawalPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FAW');
  }
}
