// -----------------------------------------------------------------------------
// Financial Payment Method
// -----------------------------------------------------------------------------

import { FinancialPaymentException } from './financial-payment.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Payment Method-specific domain errors.
 *
 * Payment methods represent external funding instruments associated with
 * a Financial Account.
 */
export class FinancialPaymentMethodException extends FinancialPaymentException {
  public constructor(
    message: string = 'A financial payment method domain error occurred.',
  ) {
    super(message);
  }
}
