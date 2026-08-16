// src/domains/journey/domain/exceptions/journey-invalid-status.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Status
// -----------------------------------------------------------------------------

export class JourneyInvalidStatusException extends JourneyException {
  constructor(message: string = 'Journey has an invalid status.') {
    super(message);
  }
}
