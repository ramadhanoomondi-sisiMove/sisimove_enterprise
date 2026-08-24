// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

import { FinancialPaymentException } from './financial-payment.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a requested Financial Payment cannot be found.
 */
export class FinancialPaymentNotFoundException extends FinancialPaymentException {
  public constructor(message: string = 'Financial Payment was not found.') {
    super(message);
  }
}
