// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Boarding participant has already withdrawn.
 */
export class JourneyBoardingParticipantAlreadyWithdrawnException extends JourneyBoardingException {
  constructor(participantPublicId?: string) {
    super(
      participantPublicId
        ? `Journey boarding participant "${participantPublicId}" has already withdrawn.`
        : 'Journey boarding participant has already withdrawn.',
    );
  }
}
