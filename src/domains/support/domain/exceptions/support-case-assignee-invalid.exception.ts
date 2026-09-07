// -----------------------------------------------------------------------------
// Support Case — Invalid Assignee Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an invalid Support Case assignee is supplied.
 */
export class SupportCaseAssigneeInvalidException extends SupportCaseException {
  public constructor(message: string = 'Support case assignee is invalid.') {
    super(message);
  }
}
