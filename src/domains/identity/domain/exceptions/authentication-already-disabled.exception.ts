// src/domains/identity/domain/exceptions/authentication-already-disabled.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class AuthenticationAlreadyDisabledException extends DomainException {
  public constructor() {
    super(
      'Authentication account is already disabled.',
      'AUTHENTICATION_ALREADY_DISABLED',
    );

    Object.freeze(this);
  }
}
