// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Boarding participant has already been marked
 * as a no-show.
 */
export class JourneyBoardingParticipantAlreadyNoShowException extends JourneyBoardingException {
  constructor(participantPublicId?: string) {
    super(
      participantPublicId
        ? `Journey boarding participant "${participantPublicId}" has already been marked as a no-show.`
        : 'Journey boarding participant has already been marked as a no-show.',
    );
  }
}
