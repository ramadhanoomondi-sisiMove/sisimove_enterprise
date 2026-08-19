// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a passenger cannot be boarded because they are not
 * currently expected to board.
 */
export class JourneyBoardingPassengerNotExpectedException extends JourneyBoardingException {
  constructor(participantPublicId?: string) {
    super(
      participantPublicId
        ? `Journey boarding passenger "${participantPublicId}" is not expected to board.`
        : 'Journey boarding passenger is not expected to board.',
    );
  }
}
