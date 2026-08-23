// -----------------------------------------------------------------------------
// Financial Disbursement Attempt Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Financial Disbursement Attempt.
 *
 * Represents the externally exposed identifier of an individual attempt
 * made to execute a Financial Disbursement through an external provider.
 *
 * A disbursement may have multiple attempts when provider execution fails
 * and the operation is retried.
 *
 * The identifier is intentionally independent from the internal persistence
 * identifier and is safe to expose across application, presentation,
 * integration, and cross-domain boundaries.
 */
export class FinancialDisbursementAttemptPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'FDA');
  }
}
