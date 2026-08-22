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
 * Thrown when a Commercial Commission Rule contains an invalid percentage.
 */
export class CommercialCommissionRuleInvalidPercentageException extends CommercialException {
  public constructor(percentage?: string | number) {
    super(
      percentage !== undefined
        ? `Commercial commission rule percentage "${percentage}" is invalid.`
        : 'Commercial commission rule percentage is invalid.',
    );
  }
}
