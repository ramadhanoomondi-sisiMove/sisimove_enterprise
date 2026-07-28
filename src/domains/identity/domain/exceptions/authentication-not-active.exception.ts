// src/domains/identity/domain/exceptions/authentication-not-active.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class AuthenticationNotActiveException extends DomainException {
  public constructor() {
    super('Authentication account is not active.', 'AUTHENTICATION_NOT_ACTIVE');

    Object.freeze(this);
  }
}
