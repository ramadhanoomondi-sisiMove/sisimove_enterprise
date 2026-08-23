// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import { FinancialAccountException } from './financial-account.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Account is used in an operation
 * involving an incompatible currency.
 */
export class FinancialAccountCurrencyMismatchException extends FinancialAccountException {
  public constructor(
    message: string = 'The financial account currency does not match the operation currency.',
  ) {
    super(message);
  }
}
