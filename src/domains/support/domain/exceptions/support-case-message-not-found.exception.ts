// -----------------------------------------------------------------------------
// Support Case Message — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case Message cannot be found.
 */
export class SupportCaseMessageNotFoundException extends SupportCaseException {
  public constructor(message: string = 'Support case message was not found.') {
    super(message);
  }
}
