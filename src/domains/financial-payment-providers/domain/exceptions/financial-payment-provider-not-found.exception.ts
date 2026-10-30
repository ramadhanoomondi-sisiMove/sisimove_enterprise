// -----------------------------------------------------------------------------
// Financial Payment Provider Not Found
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialPaymentProviderException } from './financial-payment-provider.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Payment Provider cannot be found.
 */
export class FinancialPaymentProviderNotFoundException extends FinancialPaymentProviderException {
  public constructor(identifier: string) {
    super(`Financial Payment Provider not found: ${identifier}`);
  }
}
