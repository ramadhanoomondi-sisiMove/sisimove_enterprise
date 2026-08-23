// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

import { FinancialPaymentException } from './financial-payment.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Payment attempts an invalid status transition
 * or an operation that is not permitted in its current status.
 */
export class FinancialPaymentInvalidStatusException extends FinancialPaymentException {
  public constructor(
    message: string = 'The financial payment status is invalid for this operation.',
  ) {
    super(message);
  }
}
