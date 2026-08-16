// src/domains/journey/domain/exceptions/journey-domain.exception.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Journey Domain Exception
// -----------------------------------------------------------------------------

export abstract class JourneyDomainException extends DomainException {
  protected constructor(code: string, message: string) {
    super(code, message);
  }
}
