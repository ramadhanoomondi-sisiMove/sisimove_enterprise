// -----------------------------------------------------------------------------
// Asset — Archived Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AssetException } from './asset.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when an operation is attempted on an archived Asset that does not
 * permit the requested operation.
 */
export class AssetArchivedException extends AssetException {
  public constructor(message: string = 'Asset is archived.') {
    super(message);
  }
}
