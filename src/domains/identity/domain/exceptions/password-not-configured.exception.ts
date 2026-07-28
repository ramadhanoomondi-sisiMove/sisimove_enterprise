// src/domains/identity/domain/exceptions/password-not-configured.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PasswordNotConfiguredException extends DomainException {
  constructor() {
    super('PASSWORD_NOT_CONFIGURED', 'Password has not been configured.');
  }
}
