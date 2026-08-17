// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandAlreadyPublishedException extends JourneyDemandException {
  constructor(message: string = 'Journey demand has already been published.') {
    super(message);
  }
}
