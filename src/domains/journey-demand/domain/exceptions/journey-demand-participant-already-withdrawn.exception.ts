// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandParticipantAlreadyWithdrawnException extends JourneyDemandException {
  constructor(memberPublicId?: string) {
    super(
      memberPublicId
        ? `Journey demand participant "${memberPublicId}" has already been withdrawn.`
        : 'Journey demand participant has already been withdrawn.',
    );
  }
}
