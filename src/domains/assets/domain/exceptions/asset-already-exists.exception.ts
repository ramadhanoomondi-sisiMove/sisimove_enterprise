// -----------------------------------------------------------------------------
// Asset — Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetException } from './asset.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an Asset already exists and cannot be created again.
 */
export class AssetAlreadyExistsException extends AssetException {
  public constructor(message: string = 'Asset already exists.') {
    super(message);
  }
}
