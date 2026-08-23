// src/domains/financial/domain/value-objects/financial-transaction-public-id.vo.ts

// -----------------------------------------------------------------------------
// Financial Transaction Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Transaction.
 *
 * Represents the externally exposed identifier of a financial transaction
 * within the Financial domain.
 *
 * The identifier is intentionally independent from the persistence-layer
 * primary key and is safe to use across bounded-context boundaries.
 */
export class FinancialTransactionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FTX');
  }
}
