// -----------------------------------------------------------------------------
// Device — Not Found Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { DeviceException } from './device.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when a requested Device cannot be found.
 */
export class DeviceNotFoundException extends DeviceException {
  public constructor(message: string = 'Device was not found.') {
    super(message);
  }
}
