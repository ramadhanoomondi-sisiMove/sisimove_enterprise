// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Authentication domain.
 *
 * All Authentication-specific domain exceptions should ultimately extend
 * this exception.
 */
export class AuthenticationException extends DomainException {
  public constructor(
    message: string = 'An authentication domain error occurred.',
  ) {
    super('AUTHENTICATION.DOMAIN.ERROR', message);
  }
}
