// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a required Financial domain entity or resource cannot
 * be found.
 *
 * This exception is intended for domain-level absence of a required
 * Financial resource.
 */
export class FinancialNotFoundException extends FinancialException {
  public constructor(
    message: string = 'The requested financial resource was not found.',
  ) {
    super(message);
  }
}
