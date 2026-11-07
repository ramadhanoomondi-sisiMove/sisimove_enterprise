// -----------------------------------------------------------------------------
// Accounting Calendar Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Calendar with the same unique business code
 * already exists.
 *
 * Prevents duplicate Accounting Calendar registration.
 */
export class AccountingCalendarAlreadyExistsException extends AccountingException {
  public constructor(message = 'Accounting calendar already exists.') {
    super(message);
  }
}
