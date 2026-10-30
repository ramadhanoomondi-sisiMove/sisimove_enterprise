// -----------------------------------------------------------------------------
// Financial Payment Provider Capability Disabled
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialPaymentProviderException } from './financial-payment-provider.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a provider supports a capability but that capability
 * is disabled for application use.
 */
export class FinancialPaymentProviderCapabilityDisabledException extends FinancialPaymentProviderException {
  public constructor(providerCode: string, capability: string) {
    super(
      `Capability "${capability}" is disabled for Financial Payment Provider "${providerCode}".`,
    );
  }
}
