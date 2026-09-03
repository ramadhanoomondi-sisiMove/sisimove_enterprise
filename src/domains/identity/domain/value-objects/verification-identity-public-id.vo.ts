// -----------------------------------------------------------------------------
// Verification Identity Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Identity associated with a Verification.
 *
 * Represents the externally exposed identifier of the Identity that owns
 * the Verification.
 *
 * This value object intentionally uses the Identity public identifier rather
 * than the internal database identifier, preserving the bounded-context
 * boundary and preventing persistence identifiers from leaking into the
 * domain model.
 */
export class VerificationIdentityPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'ID');
  }
}
