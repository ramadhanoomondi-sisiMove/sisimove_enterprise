// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Financial domain.
 *
 * All Financial-specific domain exceptions should ultimately extend
 * this exception.
 */
export class FinancialException extends DomainException {
  public constructor(message: string = 'A financial domain error occurred.') {
    super('FINANCIAL.DOMAIN.ERROR', message);
  }
}
