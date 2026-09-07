// -----------------------------------------------------------------------------
// Support Case — Empty Subject Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case subject is empty.
 */
export class SupportCaseSubjectEmptyException extends SupportCaseException {
  public constructor(
    message: string = 'Support case subject cannot be empty.',
  ) {
    super(message);
  }
}
