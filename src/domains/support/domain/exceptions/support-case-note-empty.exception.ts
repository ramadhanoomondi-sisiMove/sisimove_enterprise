// -----------------------------------------------------------------------------
// Support Case Note — Empty Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case Note has empty content.
 */
export class SupportCaseNoteEmptyException extends SupportCaseException {
  public constructor(message: string = 'Support case note cannot be empty.') {
    super(message);
  }
}
