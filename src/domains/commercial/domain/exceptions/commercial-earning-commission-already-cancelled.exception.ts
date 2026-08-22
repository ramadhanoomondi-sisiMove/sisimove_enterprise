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
 * Thrown when a Commercial Earning Commission has already been cancelled.
 */
export class CommercialEarningCommissionAlreadyCancelledException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial earning commission "${publicId}" has already been cancelled.`
        : 'Commercial earning commission has already been cancelled.',
    );
  }
}
