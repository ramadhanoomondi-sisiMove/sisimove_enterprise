// -----------------------------------------------------------------------------
// Financial Settlement Allocation
// -----------------------------------------------------------------------------

import { FinancialSettlementException } from './financial-settlement.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Settlement Allocation-specific domain errors.
 *
 * Settlement Allocations represent the distribution of a Settlement Item
 * across Financial Accounts.
 */
export class FinancialSettlementAllocationException extends FinancialSettlementException {
  public constructor(
    message: string = 'A financial settlement allocation domain error occurred.',
  ) {
    super(message);
  }
}
