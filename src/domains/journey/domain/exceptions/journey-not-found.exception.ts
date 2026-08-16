// src/domains/journey/domain/exceptions/journey-not-found.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Not Found
// -----------------------------------------------------------------------------

export class JourneyNotFoundException extends JourneyException {
  constructor(message: string = 'Journey was not found.') {
    super(message);
  }
}
