// -----------------------------------------------------------------------------
// Support Case — Already Closed Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation requiring an open Support Case
 * is attempted on an already closed case.
 */
export class SupportCaseAlreadyClosedException extends SupportCaseException {
  public constructor(message: string = 'Support case is already closed.') {
    super(message);
  }
}
