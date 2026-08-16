// src/domains/journey/domain/exceptions/journey-invalid-vehicle.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Vehicle
// -----------------------------------------------------------------------------

export class JourneyInvalidVehicleException extends JourneyException {
  constructor(message: string = 'Journey vehicle is invalid.') {
    super(message);
  }
}
