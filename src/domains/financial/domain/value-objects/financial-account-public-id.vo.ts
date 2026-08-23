// -----------------------------------------------------------------------------
// Financial Account Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Account.
 *
 * Represents the externally exposed identifier of a Financial Account
 * within the Financial domain.
 *
 * The underlying persistence identifier remains internal to the
 * infrastructure layer. This value object is used whenever a Financial
 * Account needs to be referenced outside its aggregate or persistence
 * representation.
 */
export class FinancialAccountPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Account public identifier.
   *
   * When no value is supplied, a new public identifier is generated
   * using the Financial Account-specific `FIA` prefix.
   */
  public constructor(value?: string) {
    super(value, 'FIA');
  }
}
