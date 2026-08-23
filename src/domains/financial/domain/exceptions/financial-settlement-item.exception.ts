// -----------------------------------------------------------------------------
// Financial Settlement Item
// -----------------------------------------------------------------------------

import { FinancialSettlementException } from './financial-settlement.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Settlement Item-specific domain errors.
 *
 * Settlement Items represent individual financial obligations or
 * settlement components within a Financial Settlement.
 */
export class FinancialSettlementItemException extends FinancialSettlementException {
  public constructor(
    message: string = 'A financial settlement item domain error occurred.',
  ) {
    super(message);
  }
}
