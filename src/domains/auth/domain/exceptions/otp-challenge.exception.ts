// -----------------------------------------------------------------------------
// OTP Challenge
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the OTP Challenge domain.
 *
 * All OTP Challenge-specific domain exceptions should ultimately extend
 * this exception.
 */
export class OtpChallengeException extends DomainException {
  public constructor(
    message: string = 'An OTP challenge domain error occurred.',
  ) {
    super('OTP_CHALLENGE.DOMAIN.ERROR', message);
  }
}
