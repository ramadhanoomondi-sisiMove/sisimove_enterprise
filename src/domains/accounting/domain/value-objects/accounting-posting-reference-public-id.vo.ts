// -----------------------------------------------------------------------------
// Accounting Posting Reference Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an Accounting Posting Reference.
 *
 * Represents the externally exposed identifier used to reference an
 * Accounting Posting Reference without exposing its internal database
 * identifier.
 *
 * An Accounting Posting Reference links an Accounting Journal to the
 * originating source record from another domain or application process.
 */
export class AccountingPostingReferencePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'ACPR');
  }
}
