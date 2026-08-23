// -----------------------------------------------------------------------------
// Financial Account Withdrawal
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalException } from './financial-account-withdrawal.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Account Withdrawal attempts an invalid status
 * transition or an operation that is not permitted in its current status.
 */
export class FinancialAccountWithdrawalInvalidStatusException extends FinancialAccountWithdrawalException {
  public constructor(
    message: string = 'The financial account withdrawal status is invalid for this operation.',
  ) {
    super(message);
  }
}
