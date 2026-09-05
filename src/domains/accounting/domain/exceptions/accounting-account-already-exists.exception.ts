// -----------------------------------------------------------------------------
// Accounting — Account Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Account cannot be created because an account
 * with the same unique identity already exists.
 */
export class AccountingAccountAlreadyExistsException extends AccountingException {
  public constructor(message: string = 'Accounting account already exists.') {
    super(message);
  }
}
