// -----------------------------------------------------------------------------
// Support Case Message — Invalid Type Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an invalid Support Case Message type is supplied.
 */
export class SupportCaseMessageInvalidTypeException extends SupportCaseException {
  public constructor(message: string = 'Invalid support case message type.') {
    super(message);
  }
}
