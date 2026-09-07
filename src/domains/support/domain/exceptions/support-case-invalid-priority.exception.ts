// -----------------------------------------------------------------------------
// Support Case — Invalid Priority Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an invalid Support Case priority is supplied.
 */
export class SupportCaseInvalidPriorityException extends SupportCaseException {
  public constructor(message: string = 'Invalid support case priority.') {
    super(message);
  }
}
