// -----------------------------------------------------------------------------
// Accounting — Journal Already Reversed Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation attempts to reverse an Accounting Journal that
 * has already been reversed.
 */
export class AccountingJournalAlreadyReversedException extends AccountingException {
  public constructor(
    message: string = 'Accounting journal is already reversed.',
  ) {
    super(message);
  }
}
