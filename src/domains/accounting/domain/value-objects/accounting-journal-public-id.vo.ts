// -----------------------------------------------------------------------------
// Accounting Journal Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Accounting Journal.
 *
 * Represents the externally exposed identifier used to reference an
 * Accounting Journal without exposing its internal database identifier.
 *
 * The Accounting Journal remains owned by the Accounting domain.
 */
export class AccountingJournalPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'ACJ');
  }
}
