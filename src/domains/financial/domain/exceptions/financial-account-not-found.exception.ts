// -----------------------------------------------------------------------------
// Financial Account — Not Found Exception
// -----------------------------------------------------------------------------
//
// Thrown when a requested Financial Account cannot be found.
//
// This exception is intentionally specific to the Financial Account
// aggregate and extends the Financial Account exception hierarchy.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Account Exception
// -----------------------------------------------------------------------------

import { FinancialAccountException } from './financial-account.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial Account cannot be found.
 *
 * The exception may be raised when looking up an account by:
 *
 * - internal account identity;
// - public account identity;
// - owner public identity;
// - another Financial Account aggregate lookup criterion.
 *
 * The exception does not expose persistence-specific details.
 */
export class FinancialAccountNotFoundException extends FinancialAccountException {
  public constructor(identifier?: string) {
    super(
      identifier
        ? `Financial account '${identifier}' was not found.`
        : 'Financial account was not found.',
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountNotFoundException;
