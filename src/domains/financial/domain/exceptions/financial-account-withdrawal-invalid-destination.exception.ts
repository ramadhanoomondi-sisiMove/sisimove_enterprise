// -----------------------------------------------------------------------------
// Financial Account Withdrawal
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalException } from './financial-account-withdrawal.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Account Withdrawal does not have a valid
 * disbursement destination.
 *
 * A withdrawal must reference a valid destination associated with the
 * Financial Account before the withdrawal can be processed.
 */
export class FinancialAccountWithdrawalInvalidDestinationException extends FinancialAccountWithdrawalException {
  public constructor(
    message: string = 'The financial account withdrawal destination is invalid.',
  ) {
    super(message);
  }
}
