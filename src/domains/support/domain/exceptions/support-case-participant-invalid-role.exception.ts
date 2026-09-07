// -----------------------------------------------------------------------------
// Support Case Participant — Invalid Role Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an invalid Support Case Participant role is supplied.
 */
export class SupportCaseParticipantInvalidRoleException extends SupportCaseException {
  public constructor(
    message: string = 'Invalid support case participant role.',
  ) {
    super(message);
  }
}
