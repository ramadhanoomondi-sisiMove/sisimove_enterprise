// src/domains/financial/domain/value-objects/financial-transaction-entry-public-id.vo.ts

// -----------------------------------------------------------------------------
// Financial Transaction Entry Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Transaction Entry.
 *
 * Represents the externally exposed identifier of an individual debit or
 * credit entry belonging to a Financial Transaction.
 *
 * The identifier is independent from the persistence-layer primary key and
 * may be safely used when exposing transaction-entry information outside
 * the Financial domain.
 */
export class FinancialTransactionEntryPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FTE');
  }
}
