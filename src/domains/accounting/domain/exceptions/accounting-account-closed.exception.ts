// -----------------------------------------------------------------------------
// Accounting — Account Closed Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation attempts to modify or use an Accounting Account
 * that has already been permanently closed.
 */
export class AccountingAccountClosedException extends AccountingException {
  public constructor(message: string = 'Accounting account is closed.') {
    super(message);
  }
}
