// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

import { FinancialTransactionException } from './financial-transaction.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Transaction attempts an invalid status
 * transition or performs an operation that is not permitted in its
 * current status.
 */
export class FinancialTransactionInvalidStatusException extends FinancialTransactionException {
  public constructor(
    message: string = 'The financial transaction status is invalid for this operation.',
  ) {
    super(message);
  }
}
