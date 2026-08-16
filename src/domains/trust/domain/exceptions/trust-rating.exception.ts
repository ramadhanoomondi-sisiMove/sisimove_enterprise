// src/domains/trust/domain/exceptions/trust-rating.exception.ts

import { TrustDomainException } from './trust-domain.exception';

export class TrustRatingException extends TrustDomainException {
  constructor(message: string = 'A trust rating domain error occurred.') {
    super(message);
  }
}
