// -----------------------------------------------------------------------------
// Device Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Device aggregate.
 *
 * Represents the externally exposed identifier of a Device within the
 * Authentication domain.
 *
 * The identifier is safe to expose across application, presentation,
 * integration, and other bounded contexts without exposing the internal
 * database identifier.
 *
 * This is an opaque identifier and does not contain device fingerprints,
 * authentication credentials, or other security-sensitive information.
 */
export class DevicePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'DEV');
  }
}
