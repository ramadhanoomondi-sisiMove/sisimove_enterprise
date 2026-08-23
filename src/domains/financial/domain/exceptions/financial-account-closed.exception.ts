// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import { FinancialAccountException } from './financial-account.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation is attempted against a closed
 * Financial Account.
 *
 * A closed account cannot participate in new financial operations.
 */
export class FinancialAccountClosedException extends FinancialAccountException {
  public constructor(message: string = 'The financial account is closed.') {
    super(message);
  }
}
