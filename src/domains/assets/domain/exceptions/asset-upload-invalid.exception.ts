// -----------------------------------------------------------------------------
// Asset — Invalid Upload Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetException } from './asset.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an Asset upload is invalid according to the Asset domain rules.
 */
export class AssetUploadInvalidException extends AssetException {
  public constructor(message: string = 'Asset upload is invalid.') {
    super(message);
  }
}
