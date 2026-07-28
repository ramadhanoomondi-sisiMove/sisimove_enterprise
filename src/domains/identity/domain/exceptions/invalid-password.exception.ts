// src/domains/identity/domain/exceptions/invalid-password.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidPasswordException extends DomainException {
  constructor(message: string) {
    super(message, 'IDENTITY_INVALID_PASSWORD');
  }
}
