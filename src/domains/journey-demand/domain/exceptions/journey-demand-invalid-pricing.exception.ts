// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandInvalidPricingException extends JourneyDemandException {
  constructor(message: string = 'Journey demand pricing is invalid.') {
    super(message);
  }
}
