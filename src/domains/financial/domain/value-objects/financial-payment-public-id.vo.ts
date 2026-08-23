// src/domains/financial/domain/value-objects/financial-payment-public-id.vo.ts

// -----------------------------------------------------------------------------
// Financial Payment Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Payment.
 *
 * Represents the externally exposed identifier of a payment initiated against
 * a Financial Account.
 *
 * The identifier is independent from the persistence-layer primary key and
 * may safely be used across bounded-context and integration boundaries.
 */
export class FinancialPaymentPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FPY');
  }
}
