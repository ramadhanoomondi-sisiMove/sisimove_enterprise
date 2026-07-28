// src/domains/identity/domain/exceptions/password-already-expired.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PasswordAlreadyExpiredException extends DomainException {
  constructor() {
    super('PASSWORD_ALREADY_EXPIRED', 'Password is already expired.');
  }
}
