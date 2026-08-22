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
 * Thrown when a Commercial Commission Rule contains an invalid version.
 */
export class CommercialCommissionRuleInvalidVersionException extends CommercialException {
  public constructor(version?: number) {
    super(
      version !== undefined
        ? `Commercial commission rule version "${version}" is invalid.`
        : 'Commercial commission rule version is invalid.',
    );
  }
}
