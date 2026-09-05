// -----------------------------------------------------------------------------
// Accounting — Account Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Account cannot be found.
 */
export class AccountingAccountNotFoundException extends AccountingException {
  public constructor(message: string = 'Accounting account was not found.') {
    super(message);
  }
}
