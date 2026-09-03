// -----------------------------------------------------------------------------
// Verification Request Asset Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Asset submitted for a Verification
 * Request.
 *
 * Represents the externally exposed identifier of the Asset associated with
 * a Verification Request.
 *
 * The Asset belongs to the Asset boundary. This value object therefore
 * represents an opaque public reference and does not model or expose the
 * Asset's internal database identifier.
 */
export class VerificationRequestAssetPublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'AST');
  }
}
