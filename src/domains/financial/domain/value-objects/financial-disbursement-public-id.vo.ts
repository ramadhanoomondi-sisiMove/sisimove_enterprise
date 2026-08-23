// -----------------------------------------------------------------------------
// Financial Disbursement Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Disbursement.
 *
 * Represents the externally exposed identifier of a disbursement initiated
 * by the Financial domain to move funds from a Financial Account to an
 * external financial destination.
 *
 * The identifier is intentionally independent from the internal persistence
 * identifier and is safe to expose across application, presentation,
 * integration, and cross-domain boundaries.
 */
export class FinancialDisbursementPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FDB');
  }
}
