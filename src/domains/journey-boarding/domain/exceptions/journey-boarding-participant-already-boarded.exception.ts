// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Boarding participant has already boarded.
 */
export class JourneyBoardingParticipantAlreadyBoardedException extends JourneyBoardingException {
  constructor(participantPublicId?: string) {
    super(
      participantPublicId
        ? `Journey boarding participant "${participantPublicId}" has already boarded.`
        : 'Journey boarding participant has already boarded.',
    );
  }
}
