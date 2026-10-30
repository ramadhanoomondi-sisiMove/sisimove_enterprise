// -----------------------------------------------------------------------------
// Financial Payment Provider Already Exists
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialPaymentProviderException } from './financial-payment-provider.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Payment Provider with the same code
 * already exists.
 */
export class FinancialPaymentProviderAlreadyExistsException extends FinancialPaymentProviderException {
  public constructor(code: string) {
    super(`Financial Payment Provider already exists with code: ${code}`);
  }
}
