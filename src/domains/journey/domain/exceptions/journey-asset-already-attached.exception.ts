// src/domains/journey/domain/exceptions/journey-asset-already-attached.exception.ts

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Asset Already Attached
// -----------------------------------------------------------------------------

export class JourneyAssetAlreadyAttachedException extends JourneyException {
  constructor(message: string = 'Journey asset is already attached.') {
    super(message);
  }
}
