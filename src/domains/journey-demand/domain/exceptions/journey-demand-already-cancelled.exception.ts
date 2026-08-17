// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandAlreadyCancelledException extends JourneyDemandException {
  constructor(message: string = 'Journey demand has already been cancelled.') {
    super(message);
  }
}
