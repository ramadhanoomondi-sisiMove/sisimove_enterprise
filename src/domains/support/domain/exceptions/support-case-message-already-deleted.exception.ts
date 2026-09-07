// -----------------------------------------------------------------------------
// Support Case Message — Already Deleted Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation is attempted on a deleted Support Case Message.
 */
export class SupportCaseMessageAlreadyDeletedException extends SupportCaseException {
  public constructor(
    message: string = 'Support case message has already been deleted.',
  ) {
    super(message);
  }
}
