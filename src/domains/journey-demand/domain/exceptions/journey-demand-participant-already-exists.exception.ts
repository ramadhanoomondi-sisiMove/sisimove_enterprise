// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

import { JourneyDemandException } from './journey-demand.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class JourneyDemandParticipantAlreadyExistsException extends JourneyDemandException {
  constructor(memberPublicId?: string) {
    super(
      memberPublicId
        ? `Journey demand participant "${memberPublicId}" already exists.`
        : 'Journey demand participant already exists.',
    );
  }
}
