// src/domains/identity/domain/exceptions/password-must-be-changed.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PasswordMustBeChangedException extends DomainException {
  constructor() {
    super(
      'IDENTITY.PASSWORD_MUST_BE_CHANGED',
      'The password must be changed before authentication can continue.',
    );
  }
}
