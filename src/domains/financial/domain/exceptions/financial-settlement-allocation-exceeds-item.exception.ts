// -----------------------------------------------------------------------------
// Financial Settlement Allocation
// -----------------------------------------------------------------------------

import { FinancialSettlementAllocationException } from './financial-settlement-allocation.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Settlement Allocation would cause the total allocated
 * amount for a Settlement Item to exceed the item's available amount.
 */
export class FinancialSettlementAllocationExceedsItemException extends FinancialSettlementAllocationException {
  public constructor(
    message: string = 'The financial settlement allocation exceeds the settlement item amount.',
  ) {
    super(message);
  }
}
