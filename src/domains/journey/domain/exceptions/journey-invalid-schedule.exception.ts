// src/domains/journey/domain/exceptions/journey-invalid-schedule.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Schedule
// -----------------------------------------------------------------------------

export class JourneyInvalidScheduleException extends JourneyException {
  constructor(message: string = 'Journey schedule is invalid.') {
    super(message);
  }
}
