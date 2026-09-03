// -----------------------------------------------------------------------------
// Session Replaced By Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Session that replaced another Session.
 *
 * Represents the opaque public identifier of the successor Session created
 * during refresh-token rotation.
 *
 * This reference allows the Authentication domain to maintain the relationship
 * between an older Session and the Session that replaced it without exposing
 * internal database identifiers.
 *
 * The value is optional at the Session aggregate level because an active or
 * terminal Session may not have been replaced by another Session.
 */
export class SessionReplacedByPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'SES');
  }
}
