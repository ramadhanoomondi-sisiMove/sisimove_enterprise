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
 * Thrown when an OTP Challenge has exceeded its permitted verification
 * attempt limit.
 */
export class OtpChallengeMaxAttemptsExceededException extends OtpChallengeException {
  public constructor(
    message: string = 'OTP challenge maximum attempts have been exceeded.',
  ) {
    super(message);
  }
}
