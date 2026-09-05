// -----------------------------------------------------------------------------
// Accounting — Journal Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Journal cannot be found.
 */
export class AccountingJournalNotFoundException extends AccountingException {
  public constructor(message: string = 'Accounting journal was not found.') {
    super(message);
  }
}
