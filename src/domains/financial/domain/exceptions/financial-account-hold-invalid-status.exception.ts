// -----------------------------------------------------------------------------
// Financial Account Hold
// -----------------------------------------------------------------------------

import { FinancialAccountHoldException } from './financial-account-hold.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Account Hold attempts an invalid status
 * transition or an operation that is not permitted in its current status.
 */
export class FinancialAccountHoldInvalidStatusException extends FinancialAccountHoldException {
  public constructor(
    message: string = 'The financial account hold status is invalid for this operation.',
  ) {
    super(message);
  }
}
