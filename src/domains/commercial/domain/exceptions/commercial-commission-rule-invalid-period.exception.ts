// -----------------------------------------------------------------------------
// Commercial Commission Rule
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { CommercialException } from './commercial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Commercial Commission Rule has an invalid effective period.
 *
 * The effective period must represent a valid chronological interval.
 */
export class CommercialCommissionRuleInvalidPeriodException extends CommercialException {
  public constructor(effectiveFrom?: Date, effectiveTo?: Date) {
    super(
      effectiveFrom && effectiveTo
        ? `Commercial commission rule has an invalid effective period: "${effectiveFrom.toISOString()}" to "${effectiveTo.toISOString()}".`
        : 'Commercial commission rule has an invalid effective period.',
    );
  }
}
