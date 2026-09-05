// -----------------------------------------------------------------------------
// Asset — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetException } from './asset.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when the requested Asset cannot be found.
 */
export class AssetNotFoundException extends AssetException {
  public constructor(message: string = 'Asset not found.') {
    super(message);
  }
}
