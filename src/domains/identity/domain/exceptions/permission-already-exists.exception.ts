// -----------------------------------------------------------------------------
// Permission Already Exists
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PermissionException } from './permission.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that a Permission already exists for a unique Permission
 * attribute or business constraint.
 *
 * This exception is typically used when attempting to create a Permission
 * with a code or resource/action combination that is already associated
 * with another Permission.
 */
export class PermissionAlreadyExistsException extends PermissionException {
  public constructor(
    message: string = 'A Permission with the specified attributes already exists.',
  ) {
    super(message);
  }
}
