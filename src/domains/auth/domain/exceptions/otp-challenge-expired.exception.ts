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
 * Thrown when an OTP Challenge has expired.
 *
 * An expired OTP Challenge can no longer participate in OTP verification
 * or other lifecycle operations that require an active challenge.
 */
export class OtpChallengeExpiredException extends OtpChallengeException {
  public constructor(message: string = 'OTP challenge has expired.') {
    super(message);
  }
}
