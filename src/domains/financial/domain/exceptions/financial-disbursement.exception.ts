// -----------------------------------------------------------------------------
// Financial Disbursement
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Disbursement-specific domain errors.
 *
 * All Financial Disbursement-specific exceptions should ultimately extend
 * this exception.
 */
export class FinancialDisbursementException extends FinancialException {
  public constructor(
    message: string = 'A financial disbursement domain error occurred.',
  ) {
    super(message);
  }
}
