// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandInvalidCorridorException extends JourneyDemandException {
  constructor(message: string = 'Journey demand corridor is invalid.') {
    super(message);
  }
}
