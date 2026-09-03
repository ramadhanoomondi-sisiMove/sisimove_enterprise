// -----------------------------------------------------------------------------
// OTP Challenge Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of an OTP Challenge.
 *
 * Represents the externally exposed identifier of an OTP Challenge within the
 * Authentication domain.
 *
 * The identifier is safe to use across application, presentation,
 * integration, and other bounded contexts without exposing the internal
 * database identifier.
 *
 * This is an opaque identifier and does not contain the OTP value, OTP hash,
 * destination, or other authentication secrets.
 */
export class OtpChallengePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'OTP');
  }
}
