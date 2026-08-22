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
 * Thrown when an already-active Commercial Commission Rule is activated.
 */
export class CommercialCommissionRuleAlreadyActiveException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial commission rule "${publicId}" is already active.`
        : 'Commercial commission rule is already active.',
    );
  }
}
