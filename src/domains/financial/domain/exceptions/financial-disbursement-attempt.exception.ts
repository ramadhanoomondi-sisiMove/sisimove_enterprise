// -----------------------------------------------------------------------------
// Financial Disbursement Attempt
// -----------------------------------------------------------------------------

import { FinancialDisbursementException } from './financial-disbursement.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Disbursement Attempt-specific domain errors.
 *
 * A Disbursement Attempt represents an individual processing attempt
 * against an external payout provider.
 */
export class FinancialDisbursementAttemptException extends FinancialDisbursementException {
  public constructor(
    message: string = 'A financial disbursement attempt domain error occurred.',
  ) {
    super(message);
  }
}
