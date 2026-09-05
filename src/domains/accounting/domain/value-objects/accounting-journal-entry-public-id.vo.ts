// -----------------------------------------------------------------------------
// Accounting Journal Entry Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Accounting Journal Entry.
 *
 * Represents the externally exposed identifier used to reference an
 * Accounting Journal Entry without exposing its internal database identifier.
 *
 * An Accounting Journal Entry is owned by the Accounting Journal aggregate.
 * This identifier therefore provides an opaque public reference to the entry
 * while preserving the aggregate's internal identity boundary.
 */
export class AccountingJournalEntryPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'ACJE');
  }
}
