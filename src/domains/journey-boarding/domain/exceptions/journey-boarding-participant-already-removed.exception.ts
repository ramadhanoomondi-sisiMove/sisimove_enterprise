// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Boarding participant has already been removed.
 */
export class JourneyBoardingParticipantAlreadyRemovedException extends JourneyBoardingException {
  constructor(participantPublicId?: string) {
    super(
      participantPublicId
        ? `Journey boarding participant "${participantPublicId}" has already been removed.`
        : 'Journey boarding participant has already been removed.',
    );
  }
}
