// -----------------------------------------------------------------------------
// Accounting Calendar Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Calendar cannot be found.
 *
 * The exception belongs to the Accounting domain and is used when an
 * application operation requires a calendar that does not exist.
 */
export class AccountingCalendarNotFoundException extends AccountingException {
  public constructor(message = 'Accounting calendar was not found.') {
    super(message);
  }
}
