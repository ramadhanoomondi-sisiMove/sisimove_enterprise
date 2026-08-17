// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandParticipantNotFoundException extends JourneyDemandException {
  constructor(memberPublicId?: string) {
    super(
      memberPublicId
        ? `Journey demand participant "${memberPublicId}" was not found.`
        : 'Journey demand participant was not found.',
    );
  }
}
