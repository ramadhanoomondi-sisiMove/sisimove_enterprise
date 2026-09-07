// -----------------------------------------------------------------------------
// Support Case Participant — Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case Participant already exists
 * with the same member and role.
 */
export class SupportCaseParticipantAlreadyExistsException extends SupportCaseException {
  public constructor(
    message: string = 'Support case participant already exists.',
  ) {
    super(message);
  }
}
