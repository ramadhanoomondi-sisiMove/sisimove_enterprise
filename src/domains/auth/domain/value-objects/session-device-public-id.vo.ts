// -----------------------------------------------------------------------------
// Session Device Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identity reference of the Device associated with a Session.
 *
 * Represents the externally exposed identifier of the Device associated with
 * the Session.
 *
 * This is an opaque reference to a Device aggregate and does not expose the
 * internal database identifier.
 *
 * The value is optional at the Session aggregate level because a Session may
 * exist without being associated with a registered Device.
 */
export class SessionDevicePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value: string) {
    super(value, 'DEV');
  }
}
