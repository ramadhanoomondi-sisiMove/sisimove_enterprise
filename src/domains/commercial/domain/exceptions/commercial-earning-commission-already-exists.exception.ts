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
 * Thrown when a Commercial Earning Commission already exists for a settlement.
 */
export class CommercialEarningCommissionAlreadyExistsException extends CommercialException {
  public constructor(settlementPublicId?: string) {
    super(
      settlementPublicId
        ? `A commercial earning commission already exists for settlement "${settlementPublicId}".`
        : 'A commercial earning commission already exists.',
    );
  }
}
