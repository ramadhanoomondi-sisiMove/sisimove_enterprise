// -----------------------------------------------------------------------------
// Financial Settlement Item Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Settlement Item.
 *
 * Represents the externally exposed identifier of an individual settlement
 * item belonging to a Financial Settlement.
 *
 * The identifier is intentionally independent from the internal persistence
 * identifier and is safe to expose across application, presentation,
 * integration, and cross-domain boundaries.
 */
export class FinancialSettlementItemPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FSI');
  }
}
