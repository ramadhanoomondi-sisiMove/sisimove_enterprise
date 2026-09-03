// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { OtpChallengeException } from './otp-challenge.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an OTP Challenge is in a status that does not permit
 * the requested domain operation.
 */
export class OtpChallengeInvalidStatusException extends OtpChallengeException {
  public constructor(
    message: string = 'OTP challenge has an invalid status for this operation.',
  ) {
    super(message);
  }
}
