// src/domains/identity/domain/exceptions/identity-closed.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class IdentityClosedException extends DomainException {
  constructor() {
    super('Closed identities cannot be modified.', 'IDENTITY_CLOSED');
  }
}
