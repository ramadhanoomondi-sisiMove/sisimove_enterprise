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
 * Thrown when a Commercial Earning Commission cannot be assessed
 * because its current lifecycle state does not permit assessment.
 */
export class CommercialEarningCommissionCannotAssessException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial earning commission "${publicId}" cannot be assessed in its current state.`
        : 'Commercial earning commission cannot be assessed in its current state.',
    );
  }
}
