// -----------------------------------------------------------------------------
// Financial Settlement
// -----------------------------------------------------------------------------

import { FinancialSettlementException } from './financial-settlement.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Settlement attempts an invalid status transition
 * or an operation that is not permitted in its current status.
 */
export class FinancialSettlementInvalidStatusException extends FinancialSettlementException {
  public constructor(
    message: string = 'The financial settlement status is invalid for this operation.',
  ) {
    super(message);
  }
}
