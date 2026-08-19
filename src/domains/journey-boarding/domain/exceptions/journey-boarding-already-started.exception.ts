// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation requires a Journey Boarding that has not started
 * yet.
 */
export class JourneyBoardingAlreadyStartedException extends JourneyBoardingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey boarding "${publicId}" has already started.`
        : 'Journey boarding has already started.',
    );
  }
}
