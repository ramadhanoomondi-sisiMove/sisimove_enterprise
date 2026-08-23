// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import { FinancialAccountException } from './financial-account.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Account does not have sufficient
 * available funds to perform an operation.
 *
 * Pending and held amounts are not considered available funds.
 */
export class FinancialAccountInsufficientFundsException extends FinancialAccountException {
  public constructor(
    message: string = 'The financial account has insufficient available funds.',
  ) {
    super(message);
  }
}
