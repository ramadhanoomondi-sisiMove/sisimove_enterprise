// -----------------------------------------------------------------------------
// Asset
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Asset domain.
 *
 * All Asset-specific domain exceptions should ultimately extend
 * this exception.
 */
export class AssetException extends DomainException {
  public constructor(message: string = 'An asset domain error occurred.') {
    super('ASSET.DOMAIN.ERROR', message);
  }
}
