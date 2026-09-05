// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Accounting domain.
 *
 * All Accounting-specific domain exceptions should ultimately extend
 * this exception.
 */
export class AccountingException extends DomainException {
  public constructor(message: string = 'An accounting domain error occurred.') {
    super('ACCOUNTING.DOMAIN.ERROR', message);
  }
}
