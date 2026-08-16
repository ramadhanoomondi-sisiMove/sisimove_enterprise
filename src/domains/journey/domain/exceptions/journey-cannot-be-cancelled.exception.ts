// src/domains/journey/domain/exceptions/journey-cannot-be-cancelled.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Cannot Be Cancelled
// -----------------------------------------------------------------------------

export class JourneyCannotBeCancelledException extends JourneyException {
  constructor(message: string = 'Journey cannot be cancelled.') {
    super(message);
  }
}
