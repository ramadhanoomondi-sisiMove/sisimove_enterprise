// -----------------------------------------------------------------------------
// Commercial
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Commercial domain.
 *
 * All Commercial-specific domain exceptions should ultimately extend
 * this exception.
 */
export class CommercialException extends DomainException {
  public constructor(message: string = 'A commercial domain error occurred.') {
    super('COMMERCIAL.DOMAIN.ERROR', message);
  }
}
