// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandInvalidParticipantException extends JourneyDemandException {
  constructor(message: string = 'Journey demand participant is invalid.') {
    super(message);
  }
}
