// -----------------------------------------------------------------------------
// Financial Disbursement Destination
// -----------------------------------------------------------------------------

import { FinancialDisbursementException } from './financial-disbursement.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Disbursement Destination-specific
 * domain errors.
 *
 * A Disbursement Destination represents an external destination to which
 * funds may be disbursed, such as mobile money or a bank account.
 */
export class FinancialDisbursementDestinationException extends FinancialDisbursementException {
  public constructor(
    message: string = 'A financial disbursement destination domain error occurred.',
  ) {
    super(message);
  }
}
