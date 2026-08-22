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
 * Thrown when a Commercial Earning Commission cannot be cancelled
 * because its current lifecycle state does not permit cancellation.
 */
export class CommercialEarningCommissionCannotCancelException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial earning commission "${publicId}" cannot be cancelled in its current state.`
        : 'Commercial earning commission cannot be cancelled in its current state.',
    );
  }
}
