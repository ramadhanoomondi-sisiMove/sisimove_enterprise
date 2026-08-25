// -----------------------------------------------------------------------------
// Financial Settlement
// -----------------------------------------------------------------------------

import { FinancialSettlementException } from './financial-settlement.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Settlement cannot be found.
 *
 * This exception is raised when an application operation attempts to resolve
 * a Financial Settlement aggregate that does not exist for the supplied
 * identity.
 */
export class FinancialSettlementNotFoundException extends FinancialSettlementException {
  public constructor(
    message: string = 'The financial settlement was not found.',
  ) {
    super(message);
  }
}
