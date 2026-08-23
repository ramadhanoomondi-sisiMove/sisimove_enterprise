// -----------------------------------------------------------------------------
// Financial Account Hold
// -----------------------------------------------------------------------------

import { FinancialAccountHoldException } from './financial-account-hold.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation is attempted against a Financial Account Hold
 * whose expiration time has passed.
 */
export class FinancialAccountHoldExpiredException extends FinancialAccountHoldException {
  public constructor(
    message: string = 'The financial account hold has expired.',
  ) {
    super(message);
  }
}
