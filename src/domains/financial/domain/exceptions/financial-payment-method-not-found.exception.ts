// -----------------------------------------------------------------------------
// Financial Payment Method
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodException } from './financial-payment-method.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a requested Financial Payment Method cannot be found.
 *
 * The exception extends the Financial Payment Method boundary exception so
 * application handlers can distinguish payment-method retrieval failures
 * from generic Financial domain failures.
 */
export class FinancialPaymentMethodNotFoundException extends FinancialPaymentMethodException {
  public constructor(
    message: string = 'Financial Payment Method was not found.',
  ) {
    super(message);
  }
}
