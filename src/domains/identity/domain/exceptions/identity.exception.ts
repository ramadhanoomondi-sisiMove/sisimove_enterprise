// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Identity domain.
 *
 * All Identity-specific domain exceptions should ultimately extend
 * this exception.
 */
export class IdentityException extends DomainException {
  public constructor(message: string = 'An identity domain error occurred.') {
    super('IDENTITY.DOMAIN.ERROR', message);
  }
}
