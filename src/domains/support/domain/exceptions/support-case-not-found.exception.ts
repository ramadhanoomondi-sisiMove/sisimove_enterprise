// -----------------------------------------------------------------------------
// Support Case — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case cannot be found.
 */
export class SupportCaseNotFoundException extends SupportCaseException {
  public constructor(message: string = 'Support case was not found.') {
    super(message);
  }
}
