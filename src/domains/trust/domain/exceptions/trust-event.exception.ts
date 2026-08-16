// src/domains/trust/domain/exceptions/trust-event.exception.ts

import { TrustDomainException } from './trust-domain.exception';

export class TrustEventException extends TrustDomainException {
  constructor(message: string = 'A trust event domain error occurred.') {
    super(message);
  }
}
