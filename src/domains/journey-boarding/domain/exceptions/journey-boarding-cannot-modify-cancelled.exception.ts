// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation attempts to modify a cancelled Journey Boarding.
 */
export class JourneyBoardingCannotModifyCancelledException extends JourneyBoardingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey boarding "${publicId}" cannot be modified because it has been cancelled.`
        : 'Journey boarding cannot be modified because it has been cancelled.',
    );
  }
}
