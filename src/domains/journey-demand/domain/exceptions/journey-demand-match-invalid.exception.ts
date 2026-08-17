// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandMatchInvalidException extends JourneyDemandException {
  constructor(message: string = 'The journey demand match is invalid.') {
    super(message);
  }
}
