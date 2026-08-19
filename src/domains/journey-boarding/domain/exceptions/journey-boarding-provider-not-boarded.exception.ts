// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when the journey is requested to start before the provider
 * has physically boarded.
 */
export class JourneyBoardingProviderNotBoardedException extends JourneyBoardingException {
  constructor(publicId?: string) {
    super(
      publicId
        ? `Journey boarding "${publicId}" cannot start because the provider has not boarded.`
        : 'Journey boarding cannot start because the provider has not boarded.',
    );
  }
}
