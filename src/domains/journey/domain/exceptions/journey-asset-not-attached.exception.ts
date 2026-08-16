// src/domains/journey/domain/exceptions/journey-asset-not-attached.exception.ts

// -----------------------------------------------------------------------------
// Journey Exception
// -----------------------------------------------------------------------------

import { JourneyException } from './journey.exception';

// -----------------------------------------------------------------------------
// Journey Asset Not Attached Exception
// -----------------------------------------------------------------------------

export class JourneyAssetNotAttachedException extends JourneyException {
  constructor(message: string = 'Journey asset is not attached.') {
    super(message);
  }
}
