// -----------------------------------------------------------------------------
// Accounting — Journal Empty Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Journal is submitted for posting without
 * any journal entries or lines.
 */
export class AccountingJournalEmptyException extends AccountingException {
  public constructor(message: string = 'Accounting journal cannot be empty.') {
    super(message);
  }
}
