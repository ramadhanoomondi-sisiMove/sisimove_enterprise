// src/domains/identity/domain/exceptions/password-reuse-not-allowed.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PasswordReuseNotAllowedException extends DomainException {
  constructor() {
    super(
      'IDENTITY.PASSWORD_REUSE_NOT_ALLOWED',
      'Password reuse is not allowed.',
    );
  }
}
