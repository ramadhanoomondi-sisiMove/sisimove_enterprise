// -----------------------------------------------------------------------------
// Asset — Deleted Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetException } from './asset.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation is attempted on an Asset that has already been
 * deleted.
 */
export class AssetDeletedException extends AssetException {
  public constructor(message: string = 'Asset is deleted.') {
    super(message);
  }
}
