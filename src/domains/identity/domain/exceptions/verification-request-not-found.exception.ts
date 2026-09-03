// -----------------------------------------------------------------------------
// Verification Request Not Found
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationRequestException } from './verification-request.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that the requested Verification Request could not be found
 * within the Identity domain.
 *
 * This exception is used when a Verification Request is required but no
 * corresponding request exists for the supplied public identity reference.
 */
export class VerificationRequestNotFoundException extends VerificationRequestException {
  public constructor(message: string = 'Verification Request was not found.') {
    super(message);
  }
}
