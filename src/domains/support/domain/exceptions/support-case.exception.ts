// -----------------------------------------------------------------------------
// Support Case
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for the Support Case domain model.
 *
 * All Support Case-specific domain exceptions should ultimately extend
 * this exception.
 */
export class SupportCaseException extends DomainException {
  public constructor(
    message: string = 'A support case domain error occurred.',
  ) {
    super('SUPPORT.CASE.DOMAIN.ERROR', message);
  }
}
