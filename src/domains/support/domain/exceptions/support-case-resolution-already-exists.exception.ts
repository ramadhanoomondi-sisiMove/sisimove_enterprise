// -----------------------------------------------------------------------------
// Support Case Resolution — Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an attempt is made to create a second resolution
 * for a Support Case.
 *
 * A Support Case can have at most one resolution.
 */
export class SupportCaseResolutionAlreadyExistsException extends SupportCaseException {
  public constructor(
    message: string = 'Support case resolution already exists.',
  ) {
    super(message);
  }
}
