// -----------------------------------------------------------------------------
// Authentication Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of an Authentication aggregate.
 *
 * Represents the externally exposed identifier of an Authentication within
 * the Authentication domain.
 *
 * The identifier is safe to expose across application, presentation,
 * integration, and other bounded contexts without exposing the internal
 * database identifier.
 *
 * This is an opaque identifier and carries no authentication credentials
 * or security-sensitive information.
 */
export class AuthenticationPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'AUTH');
  }
}
