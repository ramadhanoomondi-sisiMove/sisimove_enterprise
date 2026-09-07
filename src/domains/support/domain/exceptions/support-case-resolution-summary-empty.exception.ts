// -----------------------------------------------------------------------------
// Support Case Resolution — Empty Summary Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a Support Case Resolution summary is empty.
 */
export class SupportCaseResolutionSummaryEmptyException extends SupportCaseException {
  public constructor(
    message: string = 'Support case resolution summary cannot be empty.',
  ) {
    super(message);
  }
}
