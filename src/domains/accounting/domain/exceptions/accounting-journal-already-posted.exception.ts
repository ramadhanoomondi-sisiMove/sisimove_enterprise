// -----------------------------------------------------------------------------
// Accounting — Journal Already Posted Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation attempts to post an Accounting Journal that
 * has already been posted.
 */
export class AccountingJournalAlreadyPostedException extends AccountingException {
  public constructor(
    message: string = 'Accounting journal is already posted.',
  ) {
    super(message);
  }
}
