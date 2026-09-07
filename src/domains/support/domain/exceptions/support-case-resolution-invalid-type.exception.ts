// -----------------------------------------------------------------------------
// Support Case Resolution — Invalid Type Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an invalid Support Case Resolution type is supplied.
 */
export class SupportCaseResolutionInvalidTypeException extends SupportCaseException {
  public constructor(
    message: string = 'Invalid support case resolution type.',
  ) {
    super(message);
  }
}
