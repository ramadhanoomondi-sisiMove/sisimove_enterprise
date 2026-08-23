// -----------------------------------------------------------------------------
// Financial Account Hold
// -----------------------------------------------------------------------------

import { FinancialAccountHoldException } from './financial-account-hold.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Account does not have sufficient available
 * funds to create or capture a Financial Account Hold.
 */
export class FinancialAccountHoldInsufficientFundsException extends FinancialAccountHoldException {
  public constructor(
    message: string = 'The financial account has insufficient available funds for the hold.',
  ) {
    super(message);
  }
}
