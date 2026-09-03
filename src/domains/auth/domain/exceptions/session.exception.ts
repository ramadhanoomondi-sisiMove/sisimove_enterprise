// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Session domain.
 *
 * All Session-specific domain exceptions should ultimately extend
 * this exception.
 */
export class SessionException extends DomainException {
  public constructor(message: string = 'A session domain error occurred.') {
    super('SESSION.DOMAIN.ERROR', message);
  }
}
