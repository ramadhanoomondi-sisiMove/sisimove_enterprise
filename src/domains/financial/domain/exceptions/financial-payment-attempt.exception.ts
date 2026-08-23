// -----------------------------------------------------------------------------
// Financial Payment Attempt
// -----------------------------------------------------------------------------

import { FinancialPaymentException } from './financial-payment.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Payment Attempt-specific domain errors.
 *
 * Payment attempts represent individual attempts to process a Financial
 * Payment through an external payment provider.
 */
export class FinancialPaymentAttemptException extends FinancialPaymentException {
  public constructor(
    message: string = 'A financial payment attempt domain error occurred.',
  ) {
    super(message);
  }
}
