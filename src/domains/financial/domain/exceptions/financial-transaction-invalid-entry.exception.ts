// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

import { FinancialTransactionException } from './financial-transaction.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Transaction contains an invalid or inconsistent
 * transaction entry.
 *
 * This may include invalid entry types, invalid balance types, or entries
 * that violate the transaction's accounting invariants.
 */
export class FinancialTransactionInvalidEntryException extends FinancialTransactionException {
  public constructor(
    message: string = 'The financial transaction contains an invalid entry.',
  ) {
    super(message);
  }
}
