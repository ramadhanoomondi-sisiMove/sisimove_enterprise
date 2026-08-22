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
 * Thrown when a Commercial Commission Rule cannot be found.
 */
export class CommercialCommissionRuleNotFoundException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Commercial commission rule "${publicId}" was not found.`
        : 'Commercial commission rule was not found.',
    );
  }
}
