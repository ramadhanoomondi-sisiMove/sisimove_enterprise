// src/domains/journey/domain/exceptions/journey-asset-not-found.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Asset Not Found
// -----------------------------------------------------------------------------

export class JourneyAssetNotFoundException extends JourneyException {
  constructor(message: string = 'Journey asset was not found.') {
    super(message);
  }
}
