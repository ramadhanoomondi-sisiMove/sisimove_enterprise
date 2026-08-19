// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Boarding aggregate cannot be found.
 */
export class JourneyBoardingNotFoundException extends JourneyBoardingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey boarding "${publicId}" was not found.`
        : 'Journey boarding was not found.',
    );
  }
}
