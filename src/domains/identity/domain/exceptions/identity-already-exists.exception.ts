// src/domains/identity/domain/exceptions/identity-already-exists.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class IdentityAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(
      `An identity with email '${email}' already exists.`,
      'IDENTITY_ALREADY_EXISTS',
    );
  }
}
