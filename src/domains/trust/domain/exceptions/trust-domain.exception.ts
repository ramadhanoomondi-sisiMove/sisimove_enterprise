// src/domains/trust/domain/exceptions/trust-domain.exception.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

export class TrustDomainException extends DomainException {
  constructor(message: string = 'A trust domain error occurred.') {
    super('TRUST.DOMAIN.ERROR', message);
  }
}
