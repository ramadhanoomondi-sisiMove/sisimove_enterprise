// -----------------------------------------------------------------------------
// Support Case Message — Empty Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case Message has no usable content.
 */
export class SupportCaseMessageEmptyException extends SupportCaseException {
  public constructor(
    message: string = 'Support case message cannot be empty.',
  ) {
    super(message);
  }
}
