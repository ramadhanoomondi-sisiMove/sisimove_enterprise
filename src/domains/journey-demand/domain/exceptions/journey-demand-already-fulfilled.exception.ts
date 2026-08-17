// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandAlreadyFulfilledException extends JourneyDemandException {
  constructor(message: string = 'Journey demand has already been fulfilled.') {
    super(message);
  }
}
