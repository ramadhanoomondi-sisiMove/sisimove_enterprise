// -----------------------------------------------------------------------------
// Device — Revoked Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { DeviceException } from './device.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an operation cannot be performed because the Device has
 * already been revoked.
 *
 * A revoked Device represents a terminal security state and must not be
 * treated as an active or trusted Device without an explicit domain
 * lifecycle transition.
 */
export class DeviceRevokedException extends DeviceException {
  public constructor(message: string = 'Device has been revoked.') {
    super(message);
  }
}
