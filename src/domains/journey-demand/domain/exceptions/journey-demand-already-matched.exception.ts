// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandAlreadyMatchedException extends JourneyDemandException {
  constructor(message: string = 'Journey demand has already been matched.') {
    super(message);
  }
}
