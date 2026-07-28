// src/domains/identity/domain/exceptions/password-not-set.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PasswordNotSetException extends DomainException {
  constructor() {
    super(
      'IDENTITY.PASSWORD_NOT_SET',
      'A password has not been configured for this authentication.',
    );
  }
}
