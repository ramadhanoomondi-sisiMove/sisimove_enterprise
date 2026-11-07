// -----------------------------------------------------------------------------
// Accounting Calendar Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Accounting Calendar.
 *
 * Represents the externally exposed identifier used to reference an
 * Accounting Calendar without exposing its internal database identifier.
 *
 * The Accounting Calendar remains owned by the Accounting domain.
 */
export class AccountingCalendarPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'ACC');
  }
}
