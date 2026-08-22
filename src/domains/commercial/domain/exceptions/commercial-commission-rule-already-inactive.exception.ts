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
 * Thrown when an already-inactive Commercial Commission Rule is deactivated.
 */
export class CommercialCommissionRuleAlreadyInactiveException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial commission rule "${publicId}" is already inactive.`
        : 'Commercial commission rule is already inactive.',
    );
  }
}
