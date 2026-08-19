// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation attempts to modify participants after the
 * journey has physically started.
 */
export class JourneyBoardingCannotModifyStartedException extends JourneyBoardingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey boarding "${publicId}" cannot be modified because the journey has already started.`
        : 'Journey boarding cannot be modified because the journey has already started.',
    );
  }
}
