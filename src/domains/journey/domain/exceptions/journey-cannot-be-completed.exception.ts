// src/domains/journey/domain/exceptions/journey-cannot-be-completed.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Cannot Be Completed
// -----------------------------------------------------------------------------

export class JourneyCannotBeCompletedException extends JourneyException {
  constructor(message: string = 'Journey cannot be completed.') {
    super(message);
  }
}
