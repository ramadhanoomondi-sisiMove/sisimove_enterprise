// src/domains/journey/domain/exceptions/journey-invalid-pricing.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Invalid Journey Pricing
// -----------------------------------------------------------------------------

export class JourneyInvalidPricingException extends JourneyException {
  constructor(message: string = 'Journey pricing is invalid.') {
    super(message);
  }
}
