// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

import { FinancialTransactionException } from './financial-transaction.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Transaction contains an invalid monetary amount.
 *
 * Transaction amounts must satisfy the monetary invariants defined by
 * the Financial domain.
 */
export class FinancialTransactionInvalidAmountException extends FinancialTransactionException {
  public constructor(
    message: string = 'The financial transaction amount is invalid.',
  ) {
    super(message);
  }
}
