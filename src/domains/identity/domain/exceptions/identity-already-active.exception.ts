// src/domains/identity/domain/exceptions/identity-already-active.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class IdentityAlreadyActiveException extends DomainException {
  constructor() {
    super('The identity is already active.', 'IDENTITY_ALREADY_ACTIVE');
  }
}
