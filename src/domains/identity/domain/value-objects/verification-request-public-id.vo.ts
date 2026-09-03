// -----------------------------------------------------------------------------
// Verification Request Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity of a Verification Request.
 *
 * Represents the externally exposed identifier of a Verification Request
 * within the Identity domain.
 *
 * The identifier is generated within the Identity domain and is safe to use
 * when referencing a verification request across application, presentation,
 * integration, and other bounded contexts.
 */
export class VerificationRequestPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'VRQ');
  }
}
