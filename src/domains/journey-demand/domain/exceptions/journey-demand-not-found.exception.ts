// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandNotFoundException extends JourneyDemandException {
  constructor(public readonly journeyDemandPublicId?: string) {
    super(
      journeyDemandPublicId
        ? `Journey demand "${journeyDemandPublicId}" was not found.`
        : 'Journey demand was not found.',
    );
  }
}
