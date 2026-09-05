// -----------------------------------------------------------------------------
// Accounting — Journal Not Balanced Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Journal does not satisfy the fundamental
 * double-entry accounting invariant that total debits equal total credits.
 */
export class AccountingJournalNotBalancedException extends AccountingException {
  public constructor(message: string = 'Accounting journal is not balanced.') {
    super(message);
  }
}
