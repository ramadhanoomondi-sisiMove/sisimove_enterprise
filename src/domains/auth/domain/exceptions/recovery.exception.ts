// -----------------------------------------------------------------------------
// Recovery
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Recovery domain.
 *
 * All Recovery-specific domain exceptions should ultimately extend
 * this exception.
 */
export class RecoveryException extends DomainException {
  public constructor(message: string = 'A recovery domain error occurred.') {
    super('RECOVERY.DOMAIN.ERROR', message);
  }
}
