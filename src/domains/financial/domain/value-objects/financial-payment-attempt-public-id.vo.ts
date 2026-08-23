// src/domains/financial/domain/value-objects/financial-payment-attempt-public-id.vo.ts

// -----------------------------------------------------------------------------
// Financial Payment Attempt Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Payment Attempt.
 *
 * Represents the externally exposed identifier of an individual attempt to
 * process a Financial Payment through an external payment provider.
 *
 * A Financial Payment may have multiple attempts, for example when an
 * initial provider attempt fails and the payment is retried.
 *
 * The identifier is independent from the persistence-layer primary key and
 * may safely be used across application and integration boundaries.
 */
export class FinancialPaymentAttemptPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FPA');
  }
}
