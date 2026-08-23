// -----------------------------------------------------------------------------
// Financial Settlement Allocation Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Settlement Allocation.
 *
 * Represents the externally exposed identifier of an allocation made
 * against a Financial Settlement Item.
 *
 * The identifier is intentionally independent from the internal persistence
 * identifier and is safe to expose across application, presentation,
 * integration, and cross-domain boundaries.
 */
export class FinancialSettlementAllocationPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FSA');
  }
}
