// -----------------------------------------------------------------------------
// Support Case Evidence — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when Support Case Evidence cannot be found.
 */
export class SupportCaseEvidenceNotFoundException extends SupportCaseException {
  public constructor(message: string = 'Support case evidence was not found.') {
    super(message);
  }
}
