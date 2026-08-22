// -----------------------------------------------------------------------------
// Commercial Commission Rule — Already Exists Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Commercial Exception
// -----------------------------------------------------------------------------

import { CommercialException } from './commercial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Commercial Commission Rule already exists for the supplied
 * commission type and version.
 *
 * The combination of commission type and version uniquely identifies a
 * commercial commission policy version.
 */
export class CommercialCommissionRuleAlreadyExistsException extends CommercialException {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  constructor(
    public readonly type: string,
    public readonly version: number,
  ) {
    super(
      `Commercial commission rule already exists for type '${type}' and version '${version}'.`,
    );

    this.name = 'CommercialCommissionRuleAlreadyExistsException';
  }
}
