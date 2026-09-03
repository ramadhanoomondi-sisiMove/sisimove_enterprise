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
 * Thrown when a requested OTP Challenge cannot be found.
 */
export class OtpChallengeNotFoundException extends OtpChallengeException {
  public constructor(message: string = 'OTP challenge was not found.') {
    super(message);
  }
}
