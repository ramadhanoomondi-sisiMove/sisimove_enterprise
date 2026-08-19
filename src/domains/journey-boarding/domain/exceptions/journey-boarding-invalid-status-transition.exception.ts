// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an invalid Journey Boarding status transition is requested.
 */
export class JourneyBoardingInvalidStatusTransitionException extends JourneyBoardingException {
  constructor(fromStatus?: string, toStatus?: string, publicId?: string) {
    if (publicId && fromStatus && toStatus) {
      super(
        `Journey boarding "${publicId}" cannot transition from status "${fromStatus}" to "${toStatus}".`,
      );

      return;
    }

    if (fromStatus && toStatus) {
      super(
        `Journey boarding cannot transition from status "${fromStatus}" to "${toStatus}".`,
      );

      return;
    }

    if (publicId) {
      super(`Journey boarding "${publicId}" has an invalid status transition.`);

      return;
    }

    super('Journey boarding has an invalid status transition.');
  }
}
