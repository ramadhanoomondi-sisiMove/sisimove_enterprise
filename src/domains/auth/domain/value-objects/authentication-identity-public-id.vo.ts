// -----------------------------------------------------------------------------
// Authentication Identity Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Identity associated with an Authentication.
 *
 * Represents the externally exposed identifier of the Identity to which the
 * Authentication belongs.
 *
 * This is an opaque cross-domain reference to the Identity aggregate and does
 * not expose the internal database identifier.
 *
 * Authentication owns its authentication state and credentials, while the
 * referenced Identity remains owned by the Identity domain.
 */
export class AuthenticationIdentityPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'ID');
  }
}
