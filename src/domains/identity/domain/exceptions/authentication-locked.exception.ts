// src/domains/identity/domain/exceptions/authentication-locked.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class AuthenticationLockedException extends DomainException {
  public constructor() {
    super(
      'Authentication account is currently locked.',
      'AUTHENTICATION_LOCKED',
    );

    Object.freeze(this);
  }
}
