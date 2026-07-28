// src/domains/identity/domain/exceptions/authentication-not-found.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class AuthenticationNotFoundException extends DomainException {
  public constructor(identityId: string) {
    super(
      `Authentication for Identity '${identityId}' was not found.`,
      'AUTHENTICATION_NOT_FOUND',
    );

    Object.freeze(this);
  }
}
