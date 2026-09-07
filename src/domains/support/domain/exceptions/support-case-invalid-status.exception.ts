// -----------------------------------------------------------------------------
// Support Case — Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an invalid Support Case status is supplied
 * or an unsupported status transition is attempted.
 */
export class SupportCaseInvalidStatusException extends SupportCaseException {
  public constructor(message: string = 'Invalid support case status.') {
    super(message);
  }
}
