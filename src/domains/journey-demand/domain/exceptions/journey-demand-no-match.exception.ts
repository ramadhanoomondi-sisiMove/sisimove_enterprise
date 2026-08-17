// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandNoMatchException extends JourneyDemandException {
  constructor(
    message: string = 'No matching journey was found for the journey demand.',
  ) {
    super(message);
  }
}
