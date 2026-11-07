// -----------------------------------------------------------------------------
// Accounting Calendar Invalid Configuration Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an Accounting Calendar configuration is invalid or inconsistent.
 *
 * Examples:
 * - Invalid calendar configuration.
 * - Unsupported accounting period frequency.
 * - Inconsistent fiscal-year configuration.
 * - Conflicting calendar definitions.
 */
export class AccountingCalendarInvalidConfigurationException extends AccountingException {
  public constructor(
    message = 'Accounting calendar configuration is invalid.',
  ) {
    super(message);
  }
}
