// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import { FinancialAccountException } from './financial-account.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation is attempted against a suspended
 * Financial Account.
 *
 * Suspended accounts are prevented from performing operations
 * that require an active account.
 */
export class FinancialAccountSuspendedException extends FinancialAccountException {
  public constructor(message: string = 'The financial account is suspended.') {
    super(message);
  }
}
