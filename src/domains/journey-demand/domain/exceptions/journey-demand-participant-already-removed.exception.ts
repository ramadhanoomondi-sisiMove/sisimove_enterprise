// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandParticipantAlreadyRemovedException extends JourneyDemandException {
  constructor(memberPublicId?: string) {
    super(
      memberPublicId
        ? `Journey demand participant "${memberPublicId}" has already been removed.`
        : 'Journey demand participant has already been removed.',
    );
  }
}
