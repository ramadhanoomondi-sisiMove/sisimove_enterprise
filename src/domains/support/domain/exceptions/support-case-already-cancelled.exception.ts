// -----------------------------------------------------------------------------
// Support Case — Already Cancelled Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation requiring an active Support Case
 * is attempted on an already cancelled case.
 */
export class SupportCaseAlreadyCancelledException extends SupportCaseException {
  public constructor(message: string = 'Support case is already cancelled.') {
    super(message);
  }
}
