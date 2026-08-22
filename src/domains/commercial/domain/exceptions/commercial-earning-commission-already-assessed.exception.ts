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
 * Thrown when a Commercial Earning Commission has already been assessed.
 */
export class CommercialEarningCommissionAlreadyAssessedException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial earning commission "${publicId}" has already been assessed.`
        : 'Commercial earning commission has already been assessed.',
    );
  }
}
