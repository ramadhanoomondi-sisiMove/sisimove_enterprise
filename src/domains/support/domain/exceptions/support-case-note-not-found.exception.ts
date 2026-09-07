// -----------------------------------------------------------------------------
// Support Case Note — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case Note cannot be found.
 */
export class SupportCaseNoteNotFoundException extends SupportCaseException {
  public constructor(message: string = 'Support case note was not found.') {
    super(message);
  }
}
