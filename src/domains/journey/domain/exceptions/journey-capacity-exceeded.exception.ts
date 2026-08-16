// src/domains/journey/domain/exceptions/journey-capacity-exceeded.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Capacity Exceeded
// -----------------------------------------------------------------------------

export class JourneyCapacityExceededException extends JourneyException {
  constructor(message: string = 'Journey capacity has been exceeded.') {
    super(message);
  }
}
