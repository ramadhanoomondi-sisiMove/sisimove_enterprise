// -----------------------------------------------------------------------------
// Session Token Family Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Session token family.
 *
 * Represents the opaque identifier shared by Sessions that belong to the
 * same refresh-token rotation family.
 *
 * A token family allows the Authentication domain to revoke an entire chain
 * of rotated refresh-token Sessions when token reuse or another security
 * event is detected.
 *
 * The identifier contains no token material and does not expose a refresh
 * token or its hash.
 */
export class SessionTokenFamilyPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'TF');
  }
}
