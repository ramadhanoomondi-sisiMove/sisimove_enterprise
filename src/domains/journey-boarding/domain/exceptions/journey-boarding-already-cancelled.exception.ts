// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation is attempted on a cancelled Journey Boarding.
 */
export class JourneyBoardingAlreadyCancelledException extends JourneyBoardingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey boarding "${publicId}" has already been cancelled.`
        : 'Journey boarding has already been cancelled.',
    );
  }
}
