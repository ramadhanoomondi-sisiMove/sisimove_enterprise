// -----------------------------------------------------------------------------
// Accounting — Period Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Period cannot be found.
 */
export class AccountingPeriodNotFoundException extends AccountingException {
  public constructor(message: string = 'Accounting period was not found.') {
    super(message);
  }
}
