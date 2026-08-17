// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandConversionInvalidException extends JourneyDemandException {
  constructor(message: string = 'The journey demand conversion is invalid.') {
    super(message);
  }
}
