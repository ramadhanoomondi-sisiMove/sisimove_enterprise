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
 * Thrown when an active Commercial Commission Rule is modified in a way
 * that violates the rule lifecycle invariant.
 *
 * Active rules are immutable assessment policies. A new version should be
 * created instead of modifying an active rule.
 */
export class CommercialCommissionRuleCannotModifyActiveException extends CommercialException {
  public constructor(publicId?: string) {
    super(
      publicId
        ? `Active commercial commission rule "${publicId}" cannot be modified. Create a new version instead.`
        : 'Active commercial commission rule cannot be modified. Create a new version instead.',
    );
  }
}
