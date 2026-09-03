// -----------------------------------------------------------------------------
// Identity Invalid Status Transition
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from './identity-invariant.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Indicates that an Identity attempted an invalid lifecycle status
 * transition.
 *
 * This exception is raised when the requested transition is not permitted
 * by the Identity aggregate's lifecycle rules.
 *
 * Examples:
 *
 * - CLOSED -> ACTIVE
 * - CLOSED -> SUSPENDED
 * - ACTIVE -> ACTIVE
 * - PENDING -> SUSPENDED
 */
export class IdentityInvalidStatusTransitionException extends IdentityInvariantException {
  public constructor(
    message: string = 'The requested Identity status transition is invalid.',
  ) {
    super(message);
  }
}
