// src/domains/journey/domain/exceptions/journey-invalid-corridor.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Corridor
// -----------------------------------------------------------------------------

export class JourneyInvalidCorridorException extends JourneyException {
  constructor(message: string = 'Journey corridor is invalid.') {
    super(message);
  }
}
