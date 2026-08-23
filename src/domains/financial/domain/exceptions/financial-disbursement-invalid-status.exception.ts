// -----------------------------------------------------------------------------
// Financial Disbursement
// -----------------------------------------------------------------------------

import { FinancialDisbursementException } from './financial-disbursement.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Disbursement attempts an invalid status
 * transition or an operation that is not permitted in its current status.
 */
export class FinancialDisbursementInvalidStatusException extends FinancialDisbursementException {
  public constructor(
    message: string = 'The financial disbursement status is invalid for this operation.',
  ) {
    super(message);
  }
}
