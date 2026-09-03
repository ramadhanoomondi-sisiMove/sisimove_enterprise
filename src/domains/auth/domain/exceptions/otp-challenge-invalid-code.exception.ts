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
 * Thrown when the supplied OTP code is invalid.
 */
export class OtpChallengeInvalidCodeException extends OtpChallengeException {
  public constructor(message: string = 'OTP challenge code is invalid.') {
    super(message);
  }
}
