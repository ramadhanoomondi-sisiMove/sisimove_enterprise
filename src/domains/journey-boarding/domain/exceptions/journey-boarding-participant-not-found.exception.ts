// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a requested Journey Boarding participant cannot be found.
 */
export class JourneyBoardingParticipantNotFoundException extends JourneyBoardingException {
  constructor(participantPublicId?: string, boardingPublicId?: string) {
    if (participantPublicId && boardingPublicId) {
      super(
        `Journey boarding participant "${participantPublicId}" was not found in journey boarding "${boardingPublicId}".`,
      );

      return;
    }

    if (participantPublicId) {
      super(
        `Journey boarding participant "${participantPublicId}" was not found.`,
      );

      return;
    }

    if (boardingPublicId) {
      super(
        `Journey boarding participant was not found in journey boarding "${boardingPublicId}".`,
      );

      return;
    }

    super('Journey boarding participant was not found.');
  }
}
