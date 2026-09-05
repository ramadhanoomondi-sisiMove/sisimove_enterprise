// -----------------------------------------------------------------------------
// Accounting — Account Invalid Status Exception
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
 * Account is in an invalid lifecycle state for that operation.
 */
export class AccountingAccountInvalidStatusException extends AccountingException {
  public constructor(
    message: string = 'Accounting account has an invalid status for this operation.',
  ) {
    super(message);
  }
}
