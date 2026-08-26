// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Not Found Exception
// -----------------------------------------------------------------------------
//
// Thrown when a required Financial Account Withdrawal cannot be found.
//
// This exception represents domain-level absence of a required withdrawal
// resource.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Account Withdrawal
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalException } from './financial-account-withdrawal.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a required Financial Account Withdrawal cannot be found.
 *
 * The public withdrawal identifier is typically used to provide a precise
 * diagnostic message to the caller.
 */
export class FinancialAccountWithdrawalNotFoundException extends FinancialAccountWithdrawalException {
  public constructor(withdrawalPublicId: string) {
    super(
      `Financial Account Withdrawal "${withdrawalPublicId}" was not found.`,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountWithdrawalNotFoundException;
