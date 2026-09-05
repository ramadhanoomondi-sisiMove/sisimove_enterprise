// -----------------------------------------------------------------------------
// Accounting Account Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Accounting Account.
 *
 * Represents the externally exposed identifier used to reference an
 * Accounting Account without exposing its internal database identifier.
 *
 * The Accounting Account remains owned by the Accounting domain.
 */
export class AccountingAccountPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'ACC');
  }
}
