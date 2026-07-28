// src/domains/identity/domain/exceptions/authentication-disabled.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class AuthenticationDisabledException extends DomainException {
  public constructor() {
    super('Authentication account is disabled.', 'AUTHENTICATION_DISABLED');

    Object.freeze(this);
  }
}
