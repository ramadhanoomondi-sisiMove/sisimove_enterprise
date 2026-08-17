// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandNoCapacityException extends JourneyDemandException {
  constructor(message: string = 'Journey demand has no remaining capacity.') {
    super(message);
  }
}
