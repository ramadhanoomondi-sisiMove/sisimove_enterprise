// -----------------------------------------------------------------------------
// Accounting Journal Line Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Accounting Journal Line.
 *
 * Represents the externally exposed identifier used to reference an
 * Accounting Journal Line without exposing its internal database identifier.
 *
 * The Accounting Journal Line is owned by the Accounting Journal aggregate.
 */
export class AccountingJournalLinePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'ACJL');
  }
}
