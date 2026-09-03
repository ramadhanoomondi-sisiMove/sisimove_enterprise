// -----------------------------------------------------------------------------
// Identity Invariant
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { IdentityException } from './identity.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Identity aggregate invariant violations.
 *
 * This exception represents a business rule violation that prevents an
 * Identity aggregate from entering or remaining in an invalid state.
 *
 * Examples include:
 *
 * - attempting an invalid Identity lifecycle transition;
 * - modifying a closed Identity;
 * - violating Identity-specific state invariants.
 */
export class IdentityInvariantException extends IdentityException {
  public constructor(message: string = 'An identity invariant was violated.') {
    super(message);
  }
}
