// -----------------------------------------------------------------------------
// Session Identity Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Identity associated with a Session.
 *
 * Represents the externally exposed identifier of the Identity to which the
 * Session belongs.
 *
 * This is an opaque cross-domain reference to the Identity aggregate and does
 * not expose the internal database identifier.
 *
 * The Session uses this reference to associate authentication state with its
 * owning Identity without creating a direct domain dependency on the Identity
 * aggregate.
 */
export class SessionIdentityPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'ID');
  }
}
