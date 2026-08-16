// src/domains/trust/domain/exceptions/trust-review.exception.ts

import { TrustDomainException } from './trust-domain.exception';

export class TrustReviewException extends TrustDomainException {
  constructor(message: string = 'A trust review domain error occurred.') {
    super(message);
  }
}
