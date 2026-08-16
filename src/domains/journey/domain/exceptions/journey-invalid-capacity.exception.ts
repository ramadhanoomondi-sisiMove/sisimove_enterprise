// src/domains/journey/domain/exceptions/journey-invalid-capacity.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Capacity
// -----------------------------------------------------------------------------

export class JourneyInvalidCapacityException extends JourneyException {
  constructor(message: string = 'Journey capacity is invalid.') {
    super(message);
  }
}
