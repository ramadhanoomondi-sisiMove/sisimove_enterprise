// -----------------------------------------------------------------------------
// Verification Request Already Submitted
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationRequestException } from './verification-request.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that a Verification Request has already been submitted and
 * cannot be submitted again in its current lifecycle state.
 *
 * This prevents duplicate submission of the same Verification Request
 * and preserves the request's lifecycle integrity.
 */
export class VerificationRequestAlreadySubmittedException extends VerificationRequestException {
  public constructor(
    message: string = 'Verification Request has already been submitted.',
  ) {
    super(message);
  }
}
