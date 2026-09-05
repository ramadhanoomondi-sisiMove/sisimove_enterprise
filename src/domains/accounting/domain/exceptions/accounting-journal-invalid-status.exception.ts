// -----------------------------------------------------------------------------
// Accounting — Journal Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation cannot be performed because the Accounting
 * Journal is in an invalid lifecycle state for that operation.
 */
export class AccountingJournalInvalidStatusException extends AccountingException {
  public constructor(
    message: string = 'Accounting journal has an invalid status for this operation.',
  ) {
    super(message);
  }
}
