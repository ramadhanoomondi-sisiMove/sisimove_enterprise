// -----------------------------------------------------------------------------
// Financial Settlement Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Settlement.
 *
 * Represents the externally exposed identifier of a settlement within
 * the Financial domain.
 *
 * The identifier is intentionally independent from the internal database
 * identifier and is safe to use across application, presentation,
 * integration, and cross-domain boundaries.
 */
export class FinancialSettlementPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FST');
  }
}
