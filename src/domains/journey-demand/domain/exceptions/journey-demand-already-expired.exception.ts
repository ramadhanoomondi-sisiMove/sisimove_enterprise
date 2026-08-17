// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandAlreadyExpiredException extends JourneyDemandException {
  constructor(message: string = 'Journey demand has already expired.') {
    super(message);
  }
}
