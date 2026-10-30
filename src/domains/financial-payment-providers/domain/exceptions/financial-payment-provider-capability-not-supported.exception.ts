// -----------------------------------------------------------------------------
// Financial Payment Provider Capability Not Supported
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialPaymentProviderException } from './financial-payment-provider.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a provider does not support a requested capability.
 */
export class FinancialPaymentProviderCapabilityNotSupportedException extends FinancialPaymentProviderException {
  public constructor(providerCode: string, capability: string) {
    super(
      `Financial Payment Provider "${providerCode}" does not support capability: ${capability}`,
    );
  }
}
