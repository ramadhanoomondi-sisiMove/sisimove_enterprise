// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

import { FinancialAccountException } from './financial-account.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an attempt is made to create a Financial Account for
 * an owner that already has a Financial Account.
 *
 * The Financial Account creation policy allows one Financial Account
 * for the relevant owner/account context.
 */
export class FinancialAccountAlreadyExistsException extends FinancialAccountException {
  public constructor(
    message: string = 'A financial account already exists for this owner.',
  ) {
    super(message);
  }
}
