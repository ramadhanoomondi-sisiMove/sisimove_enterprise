// -----------------------------------------------------------------------------
// Identity Already Exists
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityException } from './identity.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that an Identity already exists for a unique identity
 * attribute or business constraint.
 *
 * This exception is typically used when attempting to create an Identity
 * with an email address or phone number that is already associated with
 * another Identity.
 */
export class IdentityAlreadyExistsException extends IdentityException {
  public constructor(
    message: string = 'An Identity with the specified attributes already exists.',
  ) {
    super(message);
  }
}
