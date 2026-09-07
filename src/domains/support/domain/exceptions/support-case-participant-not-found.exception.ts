// -----------------------------------------------------------------------------
// Support Case Participant — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case Participant cannot be found.
 */
export class SupportCaseParticipantNotFoundException extends SupportCaseException {
  public constructor(
    message: string = 'Support case participant was not found.',
  ) {
    super(message);
  }
}
