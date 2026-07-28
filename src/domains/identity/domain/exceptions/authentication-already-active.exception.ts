// src/domains/identity/domain/exceptions/authentication-already-active.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class AuthenticationAlreadyActiveException extends DomainException {
  public constructor() {
    super(
      'Authentication account is already active.',
      'AUTHENTICATION_ALREADY_ACTIVE',
    );

    Object.freeze(this);
  }
}
