// src/domains/financial/domain/value-objects/financial-disbursement-destination-public-id.vo.ts

// -----------------------------------------------------------------------------
// Financial Disbursement Destination Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Disbursement Destination.
 *
 * Represents the externally exposed identifier of a destination configured
 * for receiving funds from a Financial Account.
 *
 * The destination may represent a mobile-money account, bank account,
 * or another supported external payout destination.
 *
 * The identifier is owned by the Financial domain and is safe to expose
 * across application and presentation boundaries.
 */
export class FinancialDisbursementDestinationPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FDD');
  }
}
