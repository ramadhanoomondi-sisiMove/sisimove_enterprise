// -----------------------------------------------------------------------------
// Asset — Invalid Status Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetException } from './asset.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an Asset operation is not permitted for its current lifecycle
 * status.
 */
export class AssetInvalidStatusException extends AssetException {
  public constructor(
    message: string = 'Asset has an invalid status for this operation.',
  ) {
    super(message);
  }
}
