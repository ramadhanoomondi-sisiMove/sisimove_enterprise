// -----------------------------------------------------------------------------
// Financial Payment Provider Not Ready
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialPaymentProviderException } from './financial-payment-provider.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires a provider whose integration
 * is not ready.
 */
export class FinancialPaymentProviderNotReadyException extends FinancialPaymentProviderException {
  public constructor(providerCode: string, status: string) {
    super(
      `Financial Payment Provider "${providerCode}" is not ready. Current integration status: ${status}`,
    );
  }
}
