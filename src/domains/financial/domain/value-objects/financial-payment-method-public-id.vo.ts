// src/domains/financial/domain/value-objects/financial-payment-method-public-id.vo.ts

// -----------------------------------------------------------------------------
// Financial Payment Method Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Payment Method.
 *
 * Represents the externally exposed identifier of a payment method registered
 * against a Financial Account.
 *
 * The identifier is independent from the persistence-layer primary key and
 * may safely be used across application, presentation, and integration
 * boundaries.
 */
export class FinancialPaymentMethodPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FPM');
  }
}
