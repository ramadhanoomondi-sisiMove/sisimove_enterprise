// -----------------------------------------------------------------------------
// Financial Account Withdrawal
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Account Withdrawal-specific domain errors.
 *
 * All Financial Account Withdrawal-specific exceptions should ultimately
 * extend this exception.
 */
export class FinancialAccountWithdrawalException extends FinancialException {
  public constructor(
    message: string = 'A financial account withdrawal domain error occurred.',
  ) {
    super(message);
  }
}
