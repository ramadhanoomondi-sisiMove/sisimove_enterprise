// src/domains/journey/domain/exceptions/journey.exception.ts

import { JourneyDomainException } from './journey-domain.exception';

// -----------------------------------------------------------------------------
// Base Exception
// -----------------------------------------------------------------------------

export class JourneyException extends JourneyDomainException {
  constructor(message: string = 'A journey domain error occurred.') {
    super('JOURNEY_DOMAIN_ERROR', message);
  }
}
