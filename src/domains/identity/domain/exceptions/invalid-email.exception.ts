// src/domains/identity/domain/exceptions/invalid-email.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`The email '${email}' is invalid.`, 'IDENTITY_INVALID_EMAIL');
  }
}
