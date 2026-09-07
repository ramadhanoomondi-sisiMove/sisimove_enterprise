// -----------------------------------------------------------------------------
// Support Case — Empty Description Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case description is empty.
 */
export class SupportCaseDescriptionEmptyException extends SupportCaseException {
  public constructor(
    message: string = 'Support case description cannot be empty.',
  ) {
    super(message);
  }
}
