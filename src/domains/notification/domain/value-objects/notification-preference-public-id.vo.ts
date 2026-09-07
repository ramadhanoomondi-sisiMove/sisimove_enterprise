// -----------------------------------------------------------------------------
// Notification Preference Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of a Notification Preference.
 *
 * Represents the externally exposed identifier used to reference a
 * Notification Preference without exposing its internal database identifier.
 *
 * The Notification Preference remains owned by the Notification domain.
 */
export class NotificationPreferencePublicId extends PublicEntityId {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(value?: string) {
    super(value, 'NTP');
  }
}
