// -----------------------------------------------------------------------------
// Financial Payment Provider
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { FinancialPaymentException } from '../../../financial/domain/exceptions';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Financial Payment Provider-specific domain errors.
 *
 * All Financial Payment Provider-specific exceptions should ultimately
 * extend this exception.
 */
export class FinancialPaymentProviderException extends FinancialPaymentException {
  public constructor(
    message: string = 'A financial payment provider domain error occurred.',
  ) {
    super(message);
  }
}
