// -----------------------------------------------------------------------------
// Journey Boarding
// -----------------------------------------------------------------------------

import { JourneyBoardingException } from './journey-boarding.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Journey Boarding invariant is violated.
 */
export class JourneyBoardingInvariantException extends JourneyBoardingException {
  constructor(reason: string = 'A Journey Boarding invariant was violated.') {
    super(reason);
  }
}
