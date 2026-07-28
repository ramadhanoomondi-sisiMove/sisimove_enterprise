// src/domains/identity/domain/exceptions/authentication-not-locked.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class AuthenticationNotLockedException extends DomainException {
  public constructor() {
    super('Authentication account is not locked.', 'AUTHENTICATION_NOT_LOCKED');

    Object.freeze(this);
  }
}
