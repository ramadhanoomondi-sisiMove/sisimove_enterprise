// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandAlreadyConvertedException extends JourneyDemandException {
  constructor(message: string = 'Journey demand has already been converted.') {
    super(message);
  }
}
