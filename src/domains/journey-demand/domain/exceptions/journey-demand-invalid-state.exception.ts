// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandInvalidStateException extends JourneyDemandException {
  constructor(
    message: string = 'Journey demand is in an invalid state for this operation.',
  ) {
    super(message);
  }
}
