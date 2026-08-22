// -----------------------------------------------------------------------------
// Commercial Earning Commission
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

import { CommercialException } from './commercial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Commercial Earning Commission cannot be found.
 */
export class CommercialEarningCommissionNotFoundException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial earning commission "${publicId}" was not found.`
        : 'Commercial earning commission was not found.',
    );
  }
}
