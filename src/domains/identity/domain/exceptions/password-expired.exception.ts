// src/domains/identity/domain/exceptions/password-expired.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PasswordExpiredException extends DomainException {
  constructor() {
    super('IDENTITY.PASSWORD_EXPIRED', 'The password has expired.');
  }
}
