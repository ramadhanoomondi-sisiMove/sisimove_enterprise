// -----------------------------------------------------------------------------
// Accounting — Period Already Closed Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation attempts to close an Accounting Period that
 * has already been closed.
 */
export class AccountingPeriodAlreadyClosedException extends AccountingException {
  public constructor(message: string = 'Accounting period is already closed.') {
    super(message);
  }
}
