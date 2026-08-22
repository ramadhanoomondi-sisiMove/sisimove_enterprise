// -----------------------------------------------------------------------------
// Commercial Earning Commission Settlement Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Journey Settlement associated with a Commercial
 * Earning Commission.
 *
 * Represents the externally exposed identifier of the settlement from the
 * Journey/Settlement domain.
 *
 * This value object intentionally does not establish a persistence relation
 * to the Settlement domain because the settlement is owned by another
 * bounded context.
 */
export class CommercialEarningCommissionSettlementPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'JST');
  }
}
