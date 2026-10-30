// -----------------------------------------------------------------------------
// Financial Payment Provider Invalid Status
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialPaymentProviderException } from './financial-payment-provider.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a requested Financial Payment Provider status
 * transition is invalid.
 */
export class FinancialPaymentProviderInvalidStatusException extends FinancialPaymentProviderException {
  public constructor(currentStatus: string, requestedStatus: string) {
    super(
      `Invalid Financial Payment Provider status transition: ${currentStatus} -> ${requestedStatus}`,
    );
  }
}
