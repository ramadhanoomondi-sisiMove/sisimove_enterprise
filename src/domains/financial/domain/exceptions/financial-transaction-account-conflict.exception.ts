// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

import { FinancialTransactionException } from './financial-transaction.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when the accounts associated with a Financial Transaction
 * violate transaction account rules.
 *
 * Examples include an invalid source/destination account combination,
 * incompatible account currencies, or an operation that would result
 * in an invalid account relationship.
 */
export class FinancialTransactionAccountConflictException extends FinancialTransactionException {
  public constructor(
    message: string = 'The financial transaction contains an invalid account combination.',
  ) {
    super(message);
  }
}
