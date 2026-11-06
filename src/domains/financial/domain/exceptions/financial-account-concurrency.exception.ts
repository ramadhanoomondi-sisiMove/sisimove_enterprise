// -----------------------------------------------------------------------------
// Financial Account Concurrency
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialAccountException } from './financial-account.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Account balance is modified using
 * a stale persistence version.
 *
 * This protects aggregate-owned balance state against concurrent writes.
 */
export class FinancialAccountConcurrencyException extends FinancialAccountException {
  public constructor(
    message: string = 'The financial account balance was modified by another operation. Please retry.',
  ) {
    super(message);
  }
}
