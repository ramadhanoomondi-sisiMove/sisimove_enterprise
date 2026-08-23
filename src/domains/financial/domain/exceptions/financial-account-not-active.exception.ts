// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import { FinancialAccountException } from './financial-account.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires an active Financial Account,
 * but the account is not currently active.
 */
export class FinancialAccountNotActiveException extends FinancialAccountException {
  public constructor(message: string = 'The financial account is not active.') {
    super(message);
  }
}
