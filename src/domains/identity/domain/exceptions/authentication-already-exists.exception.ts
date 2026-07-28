// src/domains/identity/domain/exceptions/authentication-already-exists.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class AuthenticationAlreadyExistsException extends DomainException {
  public constructor(identityId: string) {
    super(
      `Authentication already exists for Identity '${identityId}'.`,
      'AUTHENTICATION_ALREADY_EXISTS',
    );

    Object.freeze(this);
  }
}
