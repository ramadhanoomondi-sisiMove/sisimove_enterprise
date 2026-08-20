// -----------------------------------------------------------------------------
// Journey Settlement Financial Transaction Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of the Financial transaction associated with a
 * Journey Settlement.
 *
 * Represents the externally exposed identity of the Financial-domain
 * transaction used to process the provider settlement.
 *
 * This is a cross-domain reference to FinancialTransaction.publicId.
 *
 * It is intentionally NOT a Prisma relation.
 *
 * The value is optional at the Journey Settlement level because a financial
 * transaction may not yet have been created when the settlement is pending.
 */
export class JourneySettlementFinancialTransactionPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FTX');
  }
}
