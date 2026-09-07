// -----------------------------------------------------------------------------
// Support Case — Already Resolved Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation requiring an unresolved Support Case
 * is attempted on an already resolved case.
 */
export class SupportCaseAlreadyResolvedException extends SupportCaseException {
  public constructor(message: string = 'Support case is already resolved.') {
    super(message);
  }
}
