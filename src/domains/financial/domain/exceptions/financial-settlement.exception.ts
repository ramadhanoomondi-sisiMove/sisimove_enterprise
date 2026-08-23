// -----------------------------------------------------------------------------
// Financial Settlement
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Settlement-specific domain errors.
 *
 * All Financial Settlement-specific exceptions should ultimately extend
 * this exception.
 */
export class FinancialSettlementException extends FinancialException {
  public constructor(
    message: string = 'A financial settlement domain error occurred.',
  ) {
    super(message);
  }
}
